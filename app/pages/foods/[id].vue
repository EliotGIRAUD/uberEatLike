<template>
  <div class="p-6">
    <div v-if="!food" class="max-w-5xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center mt-6">
        <p class="text-red-600 font-medium">Plat introuvable.</p>
      </div>
    </div>
    <div v-else class="max-w-5xl mx-auto">
      <BackButton :fallbackHref="`/restaurants/${food.restaurantId}`" />
      
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
        <div v-if="food.imageUrl" class="w-full h-80 bg-gradient-to-br from-[#3AF24B] to-emerald-400 overflow-hidden">
          <img :src="food.imageUrl" alt="" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-full h-80 bg-gradient-to-br from-[#3AF24B] to-emerald-400 flex items-center justify-center text-white text-8xl">
          🍽️
        </div>
        <div class="p-8">
          <div class="mb-6">
            <h1 class="text-4xl font-bold text-gray-900 mb-3">{{ food.name }}</h1>
            <p class="text-3xl font-bold text-[#3AF24B]">{{ food.price.toFixed(2) }} €</p>
          </div>
          
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ food.grosseDescription || food.description }}</p>
          </div>
          <div class="flex gap-3">
            <button @click="addToCart(food)" class="flex-1 rounded-lg bg-[#3AF24B] text-black py-4 font-bold hover:bg-black hover:text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg text-lg">
              <span>🛒</span>
              <span>Ajouter au panier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BackButton from '~/components/BackButton.vue'
import { useCartStore } from '../../stores/cart'
import { useUserStore } from '~/stores/user'
import { useFoodStore, type Food } from '~/stores/food'

const userStore = useUserStore()
const foodStore = useFoodStore()
const router = useRouter()
const route = useRoute()

if (!userStore.isLoggedIn || !userStore.currentUser || userStore.currentUser.role !== 'CLIENT') {
  router.push('/login')
}

type FoodJSON = {
  id: number
  restaurantId: number
  name: string
  description: string
  grosseDescription?: string
  price: number
  imageUrl?: string
}

const id = computed(() => Number(route.params.id))
const cart = useCartStore()
const toast = useToast()

// Récupérer les plats du JSON
const { data: jsonFoods } = await useFetch<FoodJSON[]>('/food.json', {
  server: false,
  default: () => [],
})

// Récupérer le plat : d'abord depuis le store food (plats des restaurateurs), puis depuis le JSON
const food = computed(() => {
  // Chercher dans les plats créés par les restaurateurs
  const restaurateurFood = foodStore.getFoodById(id.value)
  if (restaurateurFood) return restaurateurFood
  
  // Sinon chercher dans les plats du JSON
  return jsonFoods.value?.find(f => f.id === id.value)
})

function addToCart(foodItem: Food | FoodJSON) {
  cart.addItem(foodItem)
  toast.success({
    title: 'Ajouté au panier !',
    message: `${foodItem.name} a été ajouté à votre panier`,
    timeout: 2000,
  })
}
</script>


