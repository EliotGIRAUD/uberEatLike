<template>
  <div class="p-6">
    <div v-if="restaurantError || foodsError" class="max-w-7xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-red-50 border-2 border-red-200 rounded-xl p-8 sm:p-12 text-center mt-6">
        <p class="text-red-600 text-lg font-semibold mb-2">Erreur de chargement</p>
        <p class="text-red-500 text-sm mb-4">Impossible de charger les données. Vérifiez votre connexion.</p>
        <button @click="() => window.location.reload()" class="rounded-lg bg-red-600 text-white px-6 py-3 font-semibold hover:bg-red-700 transition">
          Réessayer
        </button>
      </div>
    </div>

    <div v-else-if="restaurantPending || foodsPending" class="max-w-7xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center mt-6">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#3AF24B] mb-4"></div>
        <p class="text-gray-600 text-lg">Chargement du temple calorique...</p>
      </div>
    </div>

    <div v-else-if="!restaurant" class="max-w-7xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center mt-6">
        <p class="text-red-600 font-medium">{{ t('restaurants.notFound') }}</p>
      </div>
    </div>
    <div v-else class="max-w-7xl mx-auto space-y-8">
      <BackButton fallbackHref="/restaurants" />
      
      <header class="bg-white rounded-2xl shadow-lg p-8">
        <div class="flex items-start gap-6">
          <div v-if="restaurant.imageUrl" class="w-32 h-32 rounded-xl shadow-md flex-shrink-0 overflow-hidden">
            <img :src="restaurant.imageUrl" :alt="restaurant.name" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-32 h-32 bg-gradient-to-br from-[#3AF24B] to-emerald-400 rounded-xl shadow-md flex-shrink-0 flex items-center justify-center text-white text-5xl">
            🏪
          </div>
          <div class="flex-1">
            <h1 class="text-4xl font-bold text-gray-900 mb-3">{{ restaurant.name }}</h1>
            <div class="flex flex-wrap items-center gap-3 mb-3">
              <span class="inline-flex items-center gap-1 bg-[#3AF24B] text-black px-3 py-1 rounded-full text-sm font-bold">
                <span>🍴</span>
                {{ restaurant.cuisine || 'Restaurant' }}
              </span>
              <span v-if="restaurant.rating" class="inline-flex items-center gap-1 text-yellow-600 text-sm font-semibold">
                <span>⭐</span>
                {{ restaurant.rating }}/5
              </span>
              <span v-if="restaurant.priceRange" class="text-gray-600 text-sm font-medium">{{ restaurant.priceRange }}</span>
            </div>
            <p v-if="restaurant.description" class="text-gray-700 mb-2">{{ restaurant.description }}</p>
            <p class="text-gray-500 text-sm flex items-center gap-1">
              <span>📍</span>
              {{ restaurant.address }}
            </p>
          </div>
        </div>
      </header>
      
      <section>
        <div class="mb-6">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ t('restaurants.ourMenu', { highlight: t('restaurants.menuHighlight') }) }}</h2>
          <p class="text-gray-600">{{ t('restaurants.menuSubtitle') }}</p>
        </div>
        <div v-if="foods.length === 0" class="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <p class="text-gray-500 text-lg mb-2">{{ t('restaurants.noFoods') }}</p>
          <p class="text-gray-400 text-sm">{{ t('restaurants.noFoodsHint') }}</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LazyFoodCard v-for="f in foods" :key="f.id" :food="f" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BackButton from '~/components/BackButton.vue'
import { useRestaurateurStore } from '~/stores/restaurateur'
import { useFoodStore } from '~/stores/food'

const { t } = useI18n()
const restaurateurStore = useRestaurateurStore()
const foodStore = useFoodStore()
const route = useRoute()

type RestaurantJSON = {
  id: number
  name: string
  address: string
  cuisine: string
  rating: number
  priceRange: string
  description: string
  imageUrl?: string
}

type Food = {
  id: number
  restaurantId: number
  name: string
  description: string
  grosseDescription?: string
  price: number
  imageUrl?: string
}

const restaurantId = computed(() => route.params.id)
const isNumericId = computed(() => !isNaN(Number(restaurantId.value)))

// Utiliser useFetch avec les API routes pour le SSR
const { data: jsonRestaurants, error: restaurantError, pending: restaurantPending } = await useFetch<RestaurantJSON[]>('/api/restaurants', {
  default: () => []
})

const { data: jsonFoods, error: foodsError, pending: foodsPending } = await useFetch<Food[]>('/api/foods', {
  default: () => []
})

const restaurant = computed(() => {
  if (isNumericId.value) {
    const jsonRestaurant = jsonRestaurants.value?.find(r => r.id === Number(restaurantId.value))
    return jsonRestaurant
  } else {
    const restaurateurData = restaurateurStore.getRestaurateurById(restaurantId.value as string)
    if (restaurateurData) {
      return {
        name: restaurateurData.nom,
        address: `${restaurateurData.adresse}, ${restaurateurData.codePostal} ${restaurateurData.ville}`,
        cuisine: undefined,
        rating: undefined,
        priceRange: undefined,
        description: undefined,
        imageUrl: undefined,
      }
    }
    return null
  }
})

const foods = computed(() => {
  if (isNumericId.value) {
    return jsonFoods.value?.filter(f => f.restaurantId === Number(restaurantId.value)) || []
  } else {
    return foodStore.getFoodsByRestaurant(restaurantId.value as string)
  }
})

useHead(() => ({
  title: restaurant.value 
    ? t('seo.restaurant.title', { name: restaurant.value.name })
    : t('seo.restaurants.title'),
  meta: [
    { 
      name: 'description', 
      content: restaurant.value 
        ? t('seo.restaurant.description', { 
            name: restaurant.value.name, 
            cuisine: restaurant.value.cuisine || 'Restaurant',
            address: restaurant.value.address 
          })
        : t('seo.restaurants.description')
    },
    { 
      property: 'og:title', 
      content: restaurant.value 
        ? t('seo.restaurant.title', { name: restaurant.value.name })
        : t('seo.restaurants.title')
    },
    { property: 'og:type', content: 'restaurant' },
  ],
}))
</script>


