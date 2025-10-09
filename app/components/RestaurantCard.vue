<template>
  <NuxtLink 
    :to="`/restaurants/${restaurant.id}`" 
    class="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
  >
    <div class="relative overflow-hidden h-48">
      <img 
        v-if="restaurant.imageUrl" 
        :src="restaurant.imageUrl" 
        alt="" 
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
      />
      <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
        <span class="text-yellow-500 text-sm">★</span>
        <span class="font-semibold text-sm">{{ restaurant.rating }}</span>
      </div>
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <span class="inline-block bg-[#3AF24B] text-black text-xs font-bold px-2 py-1 rounded-full">{{ restaurant.cuisine }}</span>
      </div>
    </div>
    <div class="p-5 space-y-2">
      <h2 class="text-xl font-bold text-gray-900 group-hover:text-[#3AF24B] transition-colors">{{ restaurant.name }}</h2>
      <p class="text-sm text-gray-500 flex items-center gap-1">
        <span>📍</span>
        <span class="line-clamp-1">{{ restaurant.address }}</span>
      </p>
      <p class="text-sm text-gray-700 line-clamp-2">{{ restaurant.description }}</p>
      <div class="flex items-center justify-between pt-2">
        <span class="text-sm font-semibold text-gray-600">{{ restaurant.priceRange }}</span>
        <span class="text-sm font-semibold text-[#3AF24B] group-hover:underline">Voir le menu →</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Restaurant {
  id: number
  name: string
  address: string
  cuisine: string
  rating: number
  priceRange: string
  description: string
  imageUrl?: string
}

defineProps<{ restaurant: Restaurant }>()
</script>


