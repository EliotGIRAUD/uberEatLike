<template>
  <div class="p-6">
    <div v-if="pending" class="text-gray-500">Chargement...</div>
    <div v-else-if="!food" class="text-red-600">Plat introuvable.</div>
    <div v-else class="max-w-5xl mx-auto">
      <BackButton :fallbackHref="`/restaurants/${food.restaurantId}`" />
      
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
        <img v-if="food.imageUrl" :src="food.imageUrl" alt="" class="w-full h-80 object-cover" />
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

const userStore = useUserStore()
const router = useRouter()

// Vérification en dur : seuls les clients connectés peuvent accéder
if (!userStore.isLoggedIn || !userStore.currentUser || userStore.currentUser.role !== 'CLIENT') {
  router.push('/login')
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

const route = useRoute()
const id = computed(() => Number(route.params.id))
const cart = useCartStore()
const toast = useToast()

const { data, pending } = await useFetch<Food[]>('/food.json', { server: false, default: () => [] })
const food = computed(() => (data.value || []).find(f => f.id === id.value))

function addToCart(foodItem: Food) {
  cart.addItem(foodItem)
  toast.success({
    title: 'Ajouté au panier !',
    message: `${foodItem.name} a été ajouté à votre panier`,
    timeout: 2000,
  })
}
</script>


