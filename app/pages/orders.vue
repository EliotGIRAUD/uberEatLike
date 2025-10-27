<template>
  <div class="min-h-[calc(100vh-8rem)] p-6">
    <div class="max-w-5xl mx-auto">
      <div class="mb-8">
        <h1 class="text-5xl font-extrabold text-gray-900 mb-3">
          Mes <span class="text-[#3AF24B]">Commandes</span>
        </h1>
        <p class="text-lg text-gray-600">Suivez l'état de vos commandes en temps réel</p>
      </div>
      
      <div v-if="myOrders.length === 0" class="bg-white rounded-2xl shadow-md p-12 text-center">
        <div class="text-gray-400 text-6xl mb-4">📦</div>
        <p class="text-gray-600 text-lg mb-4">Vous n'avez pas encore passé de commande</p>
        <NuxtLink to="/restaurants" class="inline-block rounded-lg bg-[#3AF24B] text-black px-6 py-3 font-semibold hover:bg-black hover:text-white transition">
          Découvrir les restaurants
        </NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <div v-for="order in myOrders" :key="order.id" class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900">Commande #{{ order.id }}</h3>
              <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
            </div>
            <span :class="statusClasses[order.status]" class="px-3 py-1 rounded-full text-sm font-semibold">
              {{ statusLabels[order.status] }}
            </span>
          </div>

          <div class="border-t pt-4 space-y-2">
            <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-3">
                <img v-if="item.imageUrl" :src="item.imageUrl" alt="" class="w-12 h-12 object-cover rounded" />
                <div>
                  <p class="font-medium text-gray-900">{{ item.name }}</p>
                  <p class="text-gray-600">{{ item.price.toFixed(2) }} € × {{ item.quantity }}</p>
                </div>
              </div>
              <p class="font-semibold text-gray-900">{{ (item.price * item.quantity).toFixed(2) }} €</p>
            </div>
          </div>

          <div class="border-t mt-4 pt-4 flex items-center justify-between">
            <span class="text-gray-600 font-medium">Total</span>
            <span class="text-2xl font-bold text-gray-900">{{ order.totalPrice.toFixed(2) }} €</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrderStore } from '../stores/order'
import { useUserStore } from '../stores/user'
import { computed } from 'vue'

definePageMeta({
  middleware: ['client']
})

const userStore = useUserStore()
const orderStore = useOrderStore()

useHead({
  title: 'Mes Commandes - Grosmino\'s',
  meta: [
    { name: 'description', content: 'Suivez l\'état de vos commandes en temps réel.' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

const myOrders = computed(() => {
  if (!userStore.currentUser?.email) return []
  return orderStore.userOrders(userStore.currentUser.email).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})

const statusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const statusClasses = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

