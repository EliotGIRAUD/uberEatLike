<template>
  <div class="p-6">
    <div v-if="fetchError" class="max-w-5xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-red-50 border-2 border-red-200 rounded-xl p-8 sm:p-12 text-center mt-6">
        <p class="text-red-600 text-lg font-semibold mb-2">Erreur de chargement</p>
        <p class="text-red-500 text-sm mb-4">Impossible de charger le plat. Vérifiez votre connexion.</p>
        <button @click="() => window.location.reload()" class="rounded-lg bg-red-600 text-white px-6 py-3 font-semibold hover:bg-red-700 transition">
          Réessayer
        </button>
      </div>
    </div>

    <div v-else-if="pending" class="max-w-5xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center mt-6">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#3AF24B] mb-4"></div>
        <p class="text-gray-600 text-lg">Chargement de la bombe calorique...</p>
      </div>
    </div>

    <div v-else-if="!food" class="max-w-5xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center mt-6">
        <p class="text-red-600 font-medium">{{ t('foods.notFound') }}</p>
      </div>
    </div>
    <div v-else class="max-w-5xl mx-auto">
      <BackButton :fallbackHref="`/restaurants/${food.restaurantId}`" />
      
      <article class="bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
        <div v-if="food.imageUrl" class="w-full h-80 bg-gradient-to-br from-[#3AF24B] to-emerald-400 overflow-hidden">
          <img :src="food.imageUrl" :alt="food.name" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-full h-80 bg-gradient-to-br from-[#3AF24B] to-emerald-400 flex items-center justify-center text-white text-8xl">
          🍽️
        </div>
        <div class="p-8">
          <header class="mb-6">
            <h1 class="text-4xl font-bold text-gray-900 mb-3">{{ food.name }}</h1>
            <p class="text-3xl font-bold text-[#3AF24B]">{{ food.price.toFixed(2) }} €</p>
          </header>
          
          <section class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ t('foods.description') }}</h2>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ food.grosseDescription || food.description }}</p>
          </section>
          <div class="flex gap-3">
            <button @click="addToCart(food)" class="flex-1 rounded-lg bg-[#3AF24B] text-black py-4 font-bold hover:bg-black hover:text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg text-lg">
              <span>🛒</span>
              <span>{{ t('foods.addToCart') }}</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BackButton from '~/components/BackButton.vue'
import { useCartStore } from '../../stores/cart'
import { useFoodStore, type Food } from '~/stores/food'

const { t } = useI18n()
const foodStore = useFoodStore()
const route = useRoute()

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

const { data: jsonFoods, error: fetchError, pending } = await useFetch<FoodJSON[]>('/food.json', {
  default: () => [],
  onResponseError({ response }) {
    console.error('Erreur de chargement du plat:', response.status)
  }
})

const food = computed(() => {
  const restaurateurFood = foodStore.getFoodById(id.value)
  if (restaurateurFood) return restaurateurFood
  
  return jsonFoods.value?.find(f => f.id === id.value)
})

useHead(() => ({
  title: food.value 
    ? t('seo.food.title', { name: food.value.name, price: food.value.price })
    : t('seo.restaurants.title'),
  meta: [
    { 
      name: 'description', 
      content: food.value 
        ? t('seo.food.description', { description: food.value.description })
        : t('seo.restaurants.description')
    },
    { 
      property: 'og:title', 
      content: food.value 
        ? t('seo.food.title', { name: food.value.name, price: food.value.price })
        : t('seo.restaurants.title')
    },
    { property: 'og:type', content: 'product' },
    { property: 'product:price:amount', content: food.value?.price.toString() || '0' },
    { property: 'product:price:currency', content: 'EUR' },
  ],
}))

function addToCart(foodItem: Food | FoodJSON) {
  cart.addItem(foodItem)
  toast.success({
    title: t('cart.itemAdded'),
    message: t('cart.itemAddedMessage', { name: foodItem.name }),
    timeout: 2000,
  })
}
</script>


