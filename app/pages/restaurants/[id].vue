<template>
  <div class="p-6">
    <div v-if="!restaurant" class="max-w-7xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center mt-6">
        <p class="text-red-600 font-medium">Restaurant introuvable.</p>
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
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Notre <span class="text-[#3AF24B]">Menu</span></h2>
          <p class="text-gray-600">Parcourez nos délicieux plats et ajoutez vos favoris au panier</p>
        </div>
        <div v-if="foods.length === 0" class="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <p class="text-gray-500 text-lg mb-2">Aucun plat disponible pour le moment</p>
          <p class="text-gray-400 text-sm">Le restaurant n'a pas encore ajouté de plats à sa carte</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FoodCard v-for="f in foods" :key="f.id" :food="f" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FoodCard from '~/components/FoodCard.vue'
import BackButton from '~/components/BackButton.vue'
import { useUserStore } from '~/stores/user'
import { useRestaurateurStore } from '~/stores/restaurateur'
import { useFoodStore } from '~/stores/food'

const userStore = useUserStore()
const restaurateurStore = useRestaurateurStore()
const foodStore = useFoodStore()
const router = useRouter()
const route = useRoute()

if (!userStore.isLoggedIn || !userStore.currentUser || userStore.currentUser.role !== 'CLIENT') {
  router.push('/login')
}

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

// Récupérer l'ID du restaurant depuis l'URL
const restaurantId = computed(() => route.params.id)

// Vérifier si c'est un ID numérique (restaurant JSON) ou string (restaurateur créé)
const isNumericId = computed(() => !isNaN(Number(restaurantId.value)))

// Récupérer les restaurants du JSON
const { data: jsonRestaurants } = await useFetch<RestaurantJSON[]>('/restaurant.json', {
  server: false,
  default: () => [],
})

// Récupérer les plats du JSON
const { data: jsonFoods } = await useFetch<Food[]>('/food.json', {
  server: false,
  default: () => [],
})

// Récupérer les infos du restaurant
const restaurant = computed(() => {
  if (isNumericId.value) {
    // Restaurant du JSON
    const jsonRestaurant = jsonRestaurants.value?.find(r => r.id === Number(restaurantId.value))
    return jsonRestaurant
  } else {
    // Restaurateur créé via back office
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

// Récupérer les plats du restaurant
const foods = computed(() => {
  if (isNumericId.value) {
    // Plats du JSON
    return jsonFoods.value?.filter(f => f.restaurantId === Number(restaurantId.value)) || []
  } else {
    // Plats créés par le restaurateur
    return foodStore.getFoodsByRestaurant(restaurantId.value as string)
  }
})
</script>


