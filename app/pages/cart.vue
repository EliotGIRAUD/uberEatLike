<template>
  <div class="min-h-[calc(100vh-8rem)] p-4 sm:p-6">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 sm:mb-3">
          {{ t('cart.title', { highlight: t('cart.highlight') }) }}
        </h1>
        <p class="text-base sm:text-lg text-gray-600">{{ t('cart.subtitle') }}</p>
      </div>
      <div v-if="cart.items.length === 0" class="bg-white rounded-2xl shadow-md p-8 sm:p-12 text-center">
        <div class="text-gray-400 text-5xl sm:text-6xl mb-4">🛒</div>
        <p class="text-gray-600 text-base sm:text-lg mb-4">{{ t('cart.empty') }}</p>
        <NuxtLink to="/restaurants" class="inline-block rounded-lg bg-[#3AF24B] text-black px-6 py-3 font-semibold hover:bg-black hover:text-white transition">{{ t('cart.discover') }}</NuxtLink>
      </div>
      <div v-else class="space-y-4">
        <div v-for="item in cart.items" :key="item.id" class="bg-white rounded-xl shadow-md p-4 sm:p-5 hover:shadow-lg transition">
          <div class="flex items-start gap-3 sm:gap-4">
            <img v-if="item.imageUrl" :src="item.imageUrl" alt="" class="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-base sm:text-lg text-gray-900 truncate">{{ item.name }}</h3>
              <p class="text-gray-600 font-medium text-sm sm:text-base">{{ item.price.toFixed(2) }} €</p>
              
              <!-- Contrôles mobile -->
              <div class="flex items-center justify-between mt-3 sm:hidden">
                <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1.5">
                  <button @click="cart.updateQuantity(item.id, item.quantity - 1)" class="w-8 h-8 rounded-lg bg-white hover:bg-gray-200 flex items-center justify-center font-semibold transition text-sm">−</button>
                  <span class="w-8 text-center font-semibold text-sm">{{ item.quantity }}</span>
                  <button @click="cart.updateQuantity(item.id, item.quantity + 1)" class="w-8 h-8 rounded-lg bg-white hover:bg-gray-200 flex items-center justify-center font-semibold transition text-sm">+</button>
                </div>
                <button @click="removeItemWithNotif(item.id)" class="text-red-600 hover:text-red-800 font-medium transition text-xl">✕</button>
              </div>
            </div>
            
            <!-- Contrôles desktop -->
            <div class="hidden sm:flex items-center gap-3">
              <div class="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                <button @click="cart.updateQuantity(item.id, item.quantity - 1)" class="w-8 h-8 rounded-lg bg-white hover:bg-gray-200 flex items-center justify-center font-semibold transition">−</button>
                <span class="w-10 text-center font-semibold">{{ item.quantity }}</span>
                <button @click="cart.updateQuantity(item.id, item.quantity + 1)" class="w-8 h-8 rounded-lg bg-white hover:bg-gray-200 flex items-center justify-center font-semibold transition">+</button>
              </div>
              <button @click="removeItemWithNotif(item.id)" class="text-red-600 hover:text-red-800 font-medium transition text-xl">✕</button>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <p class="text-gray-600 text-xs sm:text-sm mb-1">{{ t('cart.total') }}</p>
              <p class="text-2xl sm:text-3xl font-bold text-gray-900">{{ cart.totalPrice.toFixed(2) }} €</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button @click="clearCartWithConfirm" class="rounded-lg border-2 border-red-600 text-red-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold hover:bg-red-50 transition">{{ t('cart.clear') }}</button>
              <button @click="placeOrder" class="rounded-lg bg-[#3AF24B] text-black px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold hover:bg-black hover:text-white transition shadow-md">{{ t('cart.order') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart'
import { useUserStore } from '~/stores/user'
import { useOrderStore } from '../stores/order'

definePageMeta({
  middleware: ['client']
})

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()
const cart = useCartStore()
const orderStore = useOrderStore()
const toast = useToast()

useHead({
  title: t('seo.cart.title'),
  meta: [
    { name: 'description', content: t('seo.cart.description') },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

function clearCartWithConfirm() {
  cart.clearCart()
  toast.warning({
    title: t('cart.cleared'),
    message: t('cart.clearedMessage'),
    timeout: 2000,
  })
}

function removeItemWithNotif(id: number) {
  cart.removeItem(id)
  toast.info({
    title: t('cart.itemRemoved'),
    message: t('cart.itemRemovedMessage'),
    timeout: 2000,
  })
}

function placeOrder() {
  if (!userStore.currentUser?.email) {
    toast.error({
      title: t('cart.error'),
      message: t('cart.loginRequired'),
      timeout: 3000,
    })
    return
  }

  if (cart.items.length === 0) {
    toast.warning({
      title: t('cart.emptyWarning'),
      message: t('cart.emptyWarningMessage'),
      timeout: 2000,
    })
    return
  }

  const order = orderStore.createOrder(
    userStore.currentUser.email,
    cart.items,
    cart.totalPrice
  )

  cart.clearCart()

  toast.success({
    title: t('cart.orderSuccess'),
    message: t('cart.orderSuccessMessage', { id: order.id }),
    timeout: 3000,
  })

  router.push('/orders')
}
</script>

