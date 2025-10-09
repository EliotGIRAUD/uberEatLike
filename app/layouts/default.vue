<template>
  <div class="min-h-dvh flex flex-col bg-[#F0FFF0]">
    <header class="border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="font-bold text-xl">Gros<span class="text-[#3AF24B]">mino's</span></NuxtLink>
        <nav class="flex items-center gap-4 text-sm">
          <NuxtLink to="/" class="hover:underline">Accueil</NuxtLink>
          <NuxtLink to="/restaurants" class="hover:underline">Restaurants</NuxtLink>
          <NuxtLink to="/orders" class="hover:underline">Mes commandes</NuxtLink>
          <NuxtLink to="/cart" class="hover:underline relative">
            Panier
            <span v-if="cart.totalItems > 0" class="absolute -top-2 -right-2 bg-[#3AF24B] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{{ cart.totalItems }}</span>
          </NuxtLink>
          <template v-if="user.isLoggedIn && user.currentUser">
            <span class="text-gray-600 hidden sm:inline">{{ user.currentUser.name }}</span>
            <button @click="logout" class="rounded bg-black text-white px-3 py-1 hover:bg-[#3AF24B] hover:text-black transition">Déconnexion</button>
          </template>
        </nav>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t text-center text-xs text-gray-500 py-4">© {{ year }} Gros<span class="text-[#3AF24B]">mino's</span></footer>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'

const user = useUserStore()
const cart = useCartStore()
const toast = useToast()
const router = useRouter()
const year = new Date().getFullYear()

function logout() {
  user.logout()
  toast.info({
    title: 'Déconnexion',
    message: 'Vous avez été déconnecté avec succès',
    timeout: 2000,
  })
  router.push('/')
}
</script>

