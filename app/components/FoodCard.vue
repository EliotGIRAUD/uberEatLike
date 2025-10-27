<template>
  <div class="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
    <NuxtLink :to="`/foods/${food.id}`" class="relative overflow-hidden h-44">
      <img 
        v-if="food.imageUrl" 
        :src="food.imageUrl" 
        alt="" 
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
      />
      <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <span class="font-bold text-gray-900">{{ food.price.toFixed(2) }} €</span>
      </div>
    </NuxtLink>
    <div class="p-4 flex-1 flex flex-col">
      <NuxtLink :to="`/foods/${food.id}`" class="flex-1">
        <h3 class="font-bold text-lg text-gray-900 group-hover:text-[#3AF24B] transition-colors">{{ food.name }}</h3>
        <p class="text-sm text-gray-600 line-clamp-2 mt-1">{{ food.description }}</p>
      </NuxtLink>
      <button 
        @click="addToCart" 
        class="mt-4 w-full rounded-lg bg-[#3AF24B] text-black py-2.5 font-bold hover:bg-black hover:text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
      >
        <span>🛒</span>
        <span>Ajouter</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart'

interface Food {
  id: number
  restaurantId: string | number
  name: string
  description: string
  grosseDescription?: string
  price: number
  imageUrl?: string
}

const props = defineProps<{ food: Food }>()
const cart = useCartStore()
const toast = useToast()

function addToCart() {
  cart.addItem(props.food)
  toast.success({
    title: 'Ajouté au panier !',
    message: `${props.food.name} a été ajouté à votre panier`,
    timeout: 2000,
  })
}
</script>


