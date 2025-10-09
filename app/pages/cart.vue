<template>
  <div class="min-h-[calc(100vh-8rem)] p-6">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-5xl font-extrabold text-gray-900 mb-3">
          Mon <span class="text-[#3AF24B]">Panier</span>
        </h1>
        <p class="text-lg text-gray-600">Finalisez votre commande et régalez-vous !</p>
      </div>
      <div v-if="cart.items.length === 0" class="bg-white rounded-2xl shadow-md p-12 text-center">
        <div class="text-gray-400 text-6xl mb-4">🛒</div>
        <p class="text-gray-600 text-lg mb-4">Votre panier est vide</p>
        <NuxtLink to="/restaurants" class="inline-block rounded-lg bg-[#3AF24B] text-black px-6 py-3 font-semibold hover:bg-black hover:text-white transition">Découvrir les restaurants</NuxtLink>
      </div>
      <div v-else class="space-y-4">
        <div v-for="item in cart.items" :key="item.id" class="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition">
          <img v-if="item.imageUrl" :src="item.imageUrl" alt="" class="w-24 h-24 object-cover rounded-lg" />
          <div class="flex-1">
            <h3 class="font-semibold text-lg text-gray-900">{{ item.name }}</h3>
            <p class="text-gray-600 font-medium">{{ item.price.toFixed(2) }} €</p>
          </div>
          <div class="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
            <button @click="cart.updateQuantity(item.id, item.quantity - 1)" class="w-8 h-8 rounded-lg bg-white hover:bg-gray-200 flex items-center justify-center font-semibold transition">−</button>
            <span class="w-10 text-center font-semibold">{{ item.quantity }}</span>
            <button @click="cart.updateQuantity(item.id, item.quantity + 1)" class="w-8 h-8 rounded-lg bg-white hover:bg-gray-200 flex items-center justify-center font-semibold transition">+</button>
          </div>
          <button @click="removeItemWithNotif(item.id)" class="text-red-600 hover:text-red-800 font-medium transition">✕</button>
        </div>
        <div class="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">
          <div>
            <p class="text-gray-600 text-sm mb-1">Total</p>
            <p class="text-3xl font-bold text-gray-900">{{ cart.totalPrice.toFixed(2) }} €</p>
          </div>
          <div class="flex gap-3">
            <button @click="clearCartWithConfirm" class="rounded-lg border-2 border-red-600 text-red-600 px-6 py-3 font-semibold hover:bg-red-50 transition">Vider le panier</button>
            <button @click="placeOrder" class="rounded-lg bg-[#3AF24B] text-black px-8 py-3 font-semibold hover:bg-black hover:text-white transition shadow-md">Commander</button>
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

const userStore = useUserStore()
const router = useRouter()

// Vérification en dur : seuls les clients connectés peuvent accéder
if (!userStore.isLoggedIn || !userStore.currentUser || userStore.currentUser.role !== 'CLIENT') {
  router.push('/login')
}

const cart = useCartStore()
const orderStore = useOrderStore()
const toast = useToast()

function clearCartWithConfirm() {
  cart.clearCart()
  toast.warning({
    title: 'Panier vidé',
    message: 'Tous les articles ont été retirés',
    timeout: 2000,
  })
}

function removeItemWithNotif(id: number) {
  cart.removeItem(id)
  toast.info({
    title: 'Article retiré',
    message: 'L\'article a été retiré du panier',
    timeout: 2000,
  })
}

function placeOrder() {
  if (!userStore.currentUser?.email) {
    toast.error({
      title: 'Erreur',
      message: 'Vous devez être connecté pour commander',
      timeout: 3000,
    })
    return
  }

  if (cart.items.length === 0) {
    toast.warning({
      title: 'Panier vide',
      message: 'Ajoutez des articles avant de commander',
      timeout: 2000,
    })
    return
  }

  // Créer la commande
  const order = orderStore.createOrder(
    userStore.currentUser.email,
    cart.items,
    cart.totalPrice
  )

  // Vider le panier
  cart.clearCart()

  // Notification et redirection
  toast.success({
    title: 'Commande passée !',
    message: `Votre commande #${order.id} a été créée avec succès`,
    timeout: 3000,
  })

  router.push('/orders')
}
</script>

