<template>
  <div class="min-h-[calc(100vh-8rem)] p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10">
        <h1 class="text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
          {{ t('restaurants.title', { highlight: t('restaurants.highlight') }) }}
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mb-6">{{ t('restaurants.subtitle') }}</p>
        
        <!-- Barre de recherche -->
        <div class="relative max-w-2xl">
          <div class="relative">
            <input v-model="searchQuery" type="text" :placeholder="t('restaurants.search')" class="w-full rounded-xl border-2 border-gray-200 pl-12 pr-12 py-4 text-lg focus:outline-none focus:border-[#3AF24B] transition shadow-sm"/>
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            </div>
            <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
              <span class="text-xl">✕</span>
            </button>
          </div>
          <div v-if="searchQuery" class="mt-2 text-sm text-gray-600">
            {{ t('restaurants.found', { count: filteredRestaurants.length }) }}
          </div>
        </div>
      </div>
      
      <div v-if="filteredRestaurants.length === 0 && !searchQuery" class="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
        <p class="text-gray-500 text-lg mb-2">{{ t('restaurants.noRestaurants') }}</p>
        <p class="text-gray-400 text-sm">{{ t('restaurants.noRestaurantsHint') }}</p>
      </div>
      
      <div v-else-if="filteredRestaurants.length === 0 && searchQuery" class="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
        <p class="text-gray-500 text-lg mb-2">{{ t('restaurants.noResults', { query: searchQuery }) }}</p>
        <p class="text-gray-400 text-sm mb-4">{{ t('restaurants.noResultsHint') }}</p>
        <button 
          @click="searchQuery = ''"
          class="rounded-lg bg-[#3AF24B] text-black px-6 py-2 font-semibold hover:bg-black hover:text-white transition"
        >
          {{ t('restaurants.showAll') }}
        </button>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink 
          v-for="r in filteredRestaurants" 
          :key="r.id" 
          :to="`/restaurants/${r.id}`"
          class="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden group"
        >
          <div class="aspect-video bg-gradient-to-br from-[#3AF24B] to-emerald-400 relative overflow-hidden">
            <img 
              v-if="r.imageUrl" 
              :src="r.imageUrl" 
              :alt="r.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-white text-6xl">
              🏪
            </div>
          </div>
          <div class="p-5">
            <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#3AF24B] transition-colors">
              {{ r.name }}
            </h3>
            <p class="text-sm text-gray-600 mb-3 flex items-center gap-1">
              <span>📍</span>
              {{ r.address }}
            </p>
            <div class="flex items-center justify-between">
              <span v-if="r.cuisine" class="inline-flex items-center gap-1 bg-[#3AF24B]/20 text-[#3AF24B] px-2 py-1 rounded-full text-xs font-bold">
                <span>🍴</span>
                {{ r.cuisine }}
              </span>
              <span v-else class="text-xs text-gray-500">{{ r.ville }}</span>
              <span class="text-sm font-semibold text-[#3AF24B]">{{ t('restaurants.viewMenu') }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRestaurateurStore } from '~/stores/restaurateur'

const { t } = useI18n()
const restaurateurStore = useRestaurateurStore()

useHead({
  title: t('seo.restaurants.title'),
  meta: [
    { name: 'description', content: t('seo.restaurants.description') },
    { property: 'og:title', content: t('seo.restaurants.title') },
    { property: 'og:description', content: t('seo.restaurants.description') },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})

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

const searchQuery = ref('')

const { data: jsonRestaurants } = await useFetch<RestaurantJSON[]>('/restaurant.json', {
  default: () => [],
})

const allRestaurants = computed(() => {
  const restaurants: any[] = []
  
  if (jsonRestaurants.value) {
    restaurants.push(...jsonRestaurants.value.map(r => ({
      id: r.id,
      name: r.name,
      address: r.address,
      cuisine: r.cuisine,
      rating: r.rating,
      priceRange: r.priceRange,
      description: r.description,
      imageUrl: r.imageUrl,
      type: 'json' as const,
    })))
  }
  
  restaurants.push(...restaurateurStore.restaurateurs.map(resto => ({
    id: resto.id,
    name: resto.nom,
    address: `${resto.adresse}, ${resto.codePostal} ${resto.ville}`,
    ville: resto.ville,
    imageUrl: '/images/restaurants/common.png',
    type: 'restaurateur' as const,
  })))
  
  return restaurants
})

const filteredRestaurants = computed(() => {
  if (!searchQuery.value) {
    return allRestaurants.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  
  return allRestaurants.value.filter(restaurant => {
    if (restaurant.name.toLowerCase().includes(query)) return true
    if (restaurant.address.toLowerCase().includes(query)) return true
    if (restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(query)) return true
    if (restaurant.ville && restaurant.ville.toLowerCase().includes(query)) return true
    return false
  })
})
</script>


