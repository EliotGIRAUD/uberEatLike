<template>
  <div class="p-6">
    <ClientOnly fallback="Chargement...">
      <template #default>
        <div v-if="pendingRestaurant || pendingFoods" class="text-gray-500">Chargement...</div>
        <div v-else-if="!restaurant" class="text-red-600">Restaurant introuvable.</div>
        <div v-else class="max-w-7xl mx-auto space-y-8">
          <BackButton fallbackHref="/restaurants" />
          
          <header class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-start gap-6">
              <img v-if="restaurant.imageUrl" :src="restaurant.imageUrl" alt="" class="w-32 h-32 object-cover rounded-xl shadow-md flex-shrink-0" />
              <div class="flex-1">
                <h1 class="text-4xl font-bold text-gray-900 mb-3">{{ restaurant.name }}</h1>
                <div class="flex flex-wrap items-center gap-3 mb-3">
                  <span class="inline-flex items-center gap-1 bg-[#3AF24B] text-black px-3 py-1 rounded-full text-sm font-bold">
                    <span>🍴</span>
                    {{ restaurant.cuisine }}
                  </span>
                  <span class="inline-flex items-center gap-1 text-yellow-600 text-sm font-semibold">
                    <span>⭐</span>
                    {{ restaurant.rating }}/5
                  </span>
                  <span class="text-gray-600 text-sm font-medium">{{ restaurant.priceRange }}</span>
                </div>
                <p class="text-gray-700 mb-2">{{ restaurant.description }}</p>
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
            <div v-if="foods.length === 0" class="text-gray-600">Aucun plat disponible.</div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FoodCard v-for="f in foods" :key="f.id" :food="f" />
            </div>
          </section>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FoodCard from '~/components/FoodCard.vue'
import BackButton from '~/components/BackButton.vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const router = useRouter()

if (!userStore.isLoggedIn || !userStore.currentUser || userStore.currentUser.role !== 'CLIENT') {
  router.push('/login')
}

type Restaurant = {
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
  price: number
  imageUrl?: string
}

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { data: restaurantsData, pending: pendingRestaurant } = await useFetch<Restaurant[]>('/restaurant.json', { server: false, default: () => [] })
const restaurant = computed(() => (restaurantsData.value || []).find(r => r.id === id.value))

const { data: foodsData, pending: pendingFoods } = await useFetch<Food[]>('/food.json', { server: false, default: () => [] })
const foods = computed(() => (foodsData.value || []).filter(f => f.restaurantId === id.value))
</script>


