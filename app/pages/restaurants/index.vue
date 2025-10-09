<template>
  <div class="min-h-[calc(100vh-8rem)] p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10">
        <h1 class="text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
          Nos <span class="text-[#3AF24B]">Restaurants</span>
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl">Découvrez une sélection exceptionnelle de restaurants partenaires. De la cuisine traditionnelle aux saveurs du monde, trouvez votre bonheur !</p>
      </div>
      <ClientOnly fallback="Chargement...">
        <template #default>
          <div v-if="pending" class="text-center py-12">
            <div class="animate-pulse text-gray-500 text-lg">Chargement des restaurants...</div>
          </div>
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p class="text-red-600 font-medium">Impossible de charger les restaurants.</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <RestaurantCard v-for="r in restaurants" :key="r.id" :restaurant="r" />
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import RestaurantCard from '~/components/RestaurantCard.vue'
import { computed } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const router = useRouter()

// Vérification en dur : seuls les clients connectés peuvent accéder
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
const { data, pending, error } = await useFetch<Restaurant[]>('/restaurant.json', {
  server: false,
  default: () => [],
})
const restaurants = computed(() => Array.isArray(data.value) ? data.value : [])
</script>


