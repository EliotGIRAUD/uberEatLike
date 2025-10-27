<template>
  <div class="min-h-[calc(100vh-8rem)] p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10">
        <h1 class="text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
          Nos <span class="text-[#3AF24B]">Restaurants</span>
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mb-6">Découvrez une sélection exceptionnelle de restaurants partenaires. De la cuisine traditionnelle aux saveurs du monde, trouvez votre bonheur !</p>
        
        <!-- Barre de recherche -->
        <div class="relative max-w-2xl">
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="Rechercher un restaurant, une cuisine, une ville..." class="w-full rounded-xl border-2 border-gray-200 pl-12 pr-12 py-4 text-lg focus:outline-none focus:border-[#3AF24B] transition shadow-sm"/>
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            </div>
            <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
              <span class="text-xl">✕</span>
            </button>
          </div>
          <div v-if="searchQuery" class="mt-2 text-sm text-gray-600">
            {{ filteredRestaurants.length }} restaurant{{ filteredRestaurants.length > 1 ? 's' : '' }} trouvé{{ filteredRestaurants.length > 1 ? 's' : '' }}
          </div>
        </div>
      </div>
      
      <div v-if="filteredRestaurants.length === 0 && !searchQuery" class="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
        <p class="text-gray-500 text-lg mb-2">Aucun restaurant disponible pour le moment</p>
        <p class="text-gray-400 text-sm">Revenez bientôt pour découvrir nos restaurants partenaires !</p>
      </div>
      
      <div v-else-if="filteredRestaurants.length === 0 && searchQuery" class="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
        <p class="text-gray-500 text-lg mb-2">Aucun résultat pour "{{ searchQuery }}"</p>
        <p class="text-gray-400 text-sm mb-4">Essayez avec d'autres mots-clés</p>
        <button 
          @click="searchQuery = ''"
          class="rounded-lg bg-[#3AF24B] text-black px-6 py-2 font-semibold hover:bg-black hover:text-white transition"
        >
          Afficher tous les restaurants
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
              <span class="text-sm font-semibold text-[#3AF24B]">Voir le menu →</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '~/stores/user'
import { useRestaurateurStore } from '~/stores/restaurateur'

const userStore = useUserStore()
const restaurateurStore = useRestaurateurStore()
const router = useRouter()

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

// État de la recherche
const searchQuery = ref('')

// Récupérer les restaurants du JSON
const { data: jsonRestaurants } = await useFetch<RestaurantJSON[]>('/restaurant.json', {
  server: false,
  default: () => [],
})

// Combiner les restaurants JSON et les restaurateurs créés
const allRestaurants = computed(() => {
  const restaurants: any[] = []
  
  // Ajouter les restaurants du JSON
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
  
  // Ajouter les restaurateurs créés dans le back office
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

// Filtrer les restaurants selon la recherche
const filteredRestaurants = computed(() => {
  if (!searchQuery.value) {
    return allRestaurants.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  
  return allRestaurants.value.filter(restaurant => {
    // Rechercher dans le nom
    if (restaurant.name.toLowerCase().includes(query)) {
      return true
    }
    
    // Rechercher dans l'adresse
    if (restaurant.address.toLowerCase().includes(query)) {
      return true
    }
    
    // Rechercher dans la cuisine (si disponible)
    if (restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(query)) {
      return true
    }
    
    // Rechercher dans la ville (si disponible)
    if (restaurant.ville && restaurant.ville.toLowerCase().includes(query)) {
      return true
    }
    
    return false
  })
})
</script>


