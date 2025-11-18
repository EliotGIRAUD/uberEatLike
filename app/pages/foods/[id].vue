<template>
  <div class="min-h-[calc(100vh-8rem)] p-4 sm:p-6 bg-[#F0FFF0]">
    <div v-if="fetchError" class="max-w-5xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center mt-6">
        <p class="text-red-600 text-xl font-bold mb-2">Erreur de chargement</p>
        <p class="text-gray-600 mb-6">Impossible de charger le plat. Vérifiez votre connexion.</p>
        <button 
          @click="() => window.location.reload()" 
          class="rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 font-bold hover:from-red-700 hover:to-red-800 transition-all hover:scale-105 shadow-lg"
        >
          Réessayer
        </button>
      </div>
    </div>

    <div v-else-if="pending" class="max-w-5xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-white rounded-2xl shadow-xl p-12 text-center mt-6">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#3AF24B] mb-6"></div>
        <p class="text-gray-900 text-xl font-bold">Chargement de la bombe calorique...</p>
        <p class="text-gray-500 mt-2">Préparation du festin</p>
      </div>
    </div>

    <div v-else-if="!food" class="max-w-5xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center mt-6">
        <p class="text-red-600 text-lg font-bold">{{ t('foods.notFound') }}</p>
      </div>
    </div>
    
    <div v-else class="max-w-5xl mx-auto">
      <BackButton :fallbackHref="`/restaurants/${food.restaurantId}`" />
      
      <article class="bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
        <div v-if="food.imageUrl" class="w-full h-80 sm:h-96 bg-gradient-to-br from-[#3AF24B] to-emerald-400 overflow-hidden">
          <img :src="food.imageUrl" :alt="food.name" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-full h-80 sm:h-96 bg-gradient-to-br from-[#3AF24B] to-emerald-400 flex items-center justify-center text-white text-4xl font-bold">
          Plat
        </div>
        
        <div class="p-6 sm:p-8">
          <header class="mb-6">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">{{ food.name }}</h1>
            <p class="text-3xl sm:text-4xl font-extrabold text-[#3AF24B]">{{ food.price.toFixed(2) }} €</p>
          </header>
          
          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 mb-3">{{ t('foods.description') }}</h2>
            <p class="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{{ food.grosseDescription || food.description }}</p>
          </section>
          
          <div class="flex gap-3">
            <button 
              @click="addToCart(food)" 
              class="flex-1 rounded-xl bg-gradient-to-r from-[#3AF24B] to-emerald-400 text-black py-4 px-6 font-bold hover:from-black hover:to-gray-800 hover:text-white transition-all duration-300 hover:scale-105 shadow-xl text-lg"
            >
              {{ t('foods.addToCart') }}
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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

const { data: jsonFoods, error: fetchError, pending } = await useAsyncData(
  'food-detail',
  () => $fetch<FoodJSON[]>('/api/foods'),
  { default: () => [] }
)

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


