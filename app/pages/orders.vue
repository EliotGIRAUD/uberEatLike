<template>
  <div class="min-h-[calc(100vh-8rem)] p-4 sm:p-6 bg-[#F0FFF0]">
    <div class="max-w-5xl mx-auto">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 sm:mb-3">
          {{ t('orders.title', { highlight: '' }) }}<span class="text-[#3AF24B]">{{ t('orders.highlight') }}</span>
        </h1>
        <p class="text-base sm:text-lg text-gray-600">{{ t('orders.subtitle') }}</p>
      </div>
      
      <div v-if="myOrders.length === 0" class="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
        <p class="text-gray-900 text-xl sm:text-2xl font-bold mb-2">{{ t('orders.empty') }}</p>
        <p class="text-gray-600 text-sm sm:text-base mb-6">{{ t('orders.emptyHint') }}</p>
        <NuxtLink 
          to="/restaurants" 
          class="inline-block rounded-xl bg-gradient-to-r from-[#3AF24B] to-emerald-400 text-black px-8 py-4 font-bold hover:from-black hover:to-gray-800 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg"
        >
          {{ t('orders.discover') }}
        </NuxtLink>
      </div>

      <div v-else class="space-y-6">
        <div v-for="order in myOrders" :key="order.id" class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-3 sm:gap-0">
            <div>
              <h3 class="text-lg sm:text-xl font-extrabold text-gray-900">{{ t('orders.orderNumber', { id: order.id }) }}</h3>
              <p class="text-sm sm:text-base text-gray-600 mt-1">{{ formatDate(order.createdAt) }}</p>
            </div>
            <span :class="statusClasses[order.status]" class="px-4 py-2 rounded-full text-sm font-bold w-fit shadow-md">
              {{ t(`orders.status.${order.status}`) }}
            </span>
          </div>

          <div class="border-t border-gray-200 pt-4 space-y-4">
            <div v-for="item in order.items" :key="item.id" class="flex items-start sm:items-center justify-between gap-3 text-sm sm:text-base">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl flex-shrink-0 shadow-md" />
                <div v-else class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#3AF24B] to-emerald-400 rounded-xl flex-shrink-0 shadow-md flex items-center justify-center text-white text-sm font-bold">
                  Plat
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-bold text-gray-900 truncate">{{ item.name }}</p>
                  <p class="text-gray-600 font-medium">{{ item.price.toFixed(2) }} € × {{ item.quantity }}</p>
                </div>
              </div>
              <p class="font-extrabold text-[#3AF24B] flex-shrink-0 text-lg">{{ (item.price * item.quantity).toFixed(2) }} €</p>
            </div>
          </div>

          <div class="border-t border-gray-200 mt-6 pt-6 flex items-center justify-between">
            <span class="text-base sm:text-lg text-gray-600 font-bold">{{ t('orders.total') }}</span>
            <span class="text-2xl sm:text-3xl font-extrabold text-gray-900">{{ order.totalPrice.toFixed(2) }} €</span>
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

const { t } = useI18n()
const userStore = useUserStore()
const orderStore = useOrderStore()

useHead({
  title: t('seo.orders.title'),
  meta: [
    { name: 'description', content: t('seo.orders.description') },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

const myOrders = computed(() => {
  if (!userStore.currentUser?.email) return []
  return orderStore.userOrders(userStore.currentUser.email).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})

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

