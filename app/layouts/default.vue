<template>
  <div class="min-h-dvh flex flex-col bg-[#F0FFF0]">
    <header class="border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition">
          <img src="/icon-192.png" alt="Grosmino's" class="w-8 h-8" />
          <span>Gros<span class="text-[#3AF24B]">mino's</span></span>
        </NuxtLink>
        
        <!-- Menu Desktop -->
        <nav class="hidden lg:flex items-center gap-4 text-sm">
          <NuxtLink to="/" class="rounded border-2 border-black px-3 py-1 hover:border-[#3AF24B] transition">{{ $t('nav.home') }}</NuxtLink>
          <NuxtLink to="/restaurants" class="rounded border-2 border-black px-3 py-1 hover:border-[#3AF24B] transition">{{ $t('nav.restaurants') }}</NuxtLink>
          <NuxtLink to="/orders" class="rounded border-2 border-black px-3 py-1 hover:border-[#3AF24B] transition">{{ $t('nav.myOrders') }}</NuxtLink>
          <NuxtLink to="/cart" class="rounded border-2 border-black px-3 py-1 hover:border-[#3AF24B] transition relative">
            {{ $t('nav.cart') }}
            <span v-if="cart.totalItems > 0" class="absolute -top-2 -right-2 bg-[#3AF24B] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{{ cart.totalItems }}</span>
          </NuxtLink>
          <template v-if="user.isLoggedIn && user.currentUser">
            <NuxtLink v-if="user.currentUser.role === 'ADMIN'" to="/admin" class="rounded border-2 border-black px-3 py-1 hover:border-purple-600 transition relative">{{ $t('nav.backOffice') }}</NuxtLink>
            <NuxtLink v-if="user.currentUser.role === 'RESTAURATEUR'" to="/restaurateur" class="rounded border-2 border-black px-3 py-1 hover:border-[#3AF24B] transition relative">{{ $t('nav.myRestaurant') }}</NuxtLink>
            <NuxtLink to="/profile" class="rounded border-2 border-black px-3 py-1 hover:border-[#3AF24B] transition">{{ user.currentUser.name }}</NuxtLink>
            <button @click="logout" class="rounded bg-black text-white px-3 py-1 hover:bg-[#3AF24B] hover:text-black transition">{{ $t('nav.logout') }}</button>
          </template>
          <LazyLanguageSwitcher />
        </nav>

        <!-- Menu Mobile -->
        <div class="flex items-center gap-3 lg:hidden">
          <NuxtLink to="/cart" class="relative">
            <span class="text-2xl">🛒</span>
            <span v-if="cart.totalItems > 0" class="absolute -top-1 -right-1 bg-[#3AF24B] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{{ cart.totalItems }}</span>
          </NuxtLink>
          <button @click="menuOpen = !menuOpen" class="text-2xl">☰</button>
        </div>
      </div>

      <!-- Menu Mobile Drawer -->
      <Transition name="slide">
        <div v-if="menuOpen" class="lg:hidden border-t bg-white">
          <nav class="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-2">
            <NuxtLink @click="menuOpen = false" to="/" class="rounded border-2 border-black px-4 py-2 hover:border-[#3AF24B] transition text-center">{{ $t('nav.home') }}</NuxtLink>
            <NuxtLink @click="menuOpen = false" to="/restaurants" class="rounded border-2 border-black px-4 py-2 hover:border-[#3AF24B] transition text-center">{{ $t('nav.restaurants') }}</NuxtLink>
            <NuxtLink @click="menuOpen = false" to="/orders" class="rounded border-2 border-black px-4 py-2 hover:border-[#3AF24B] transition text-center">{{ $t('nav.myOrders') }}</NuxtLink>
            <NuxtLink @click="menuOpen = false" to="/cart" class="rounded border-2 border-black px-4 py-2 hover:border-[#3AF24B] transition text-center relative">
              {{ $t('nav.cart') }}
              <span v-if="cart.totalItems > 0" class="ml-2 bg-[#3AF24B] text-black text-xs rounded-full px-2 py-0.5 font-bold">{{ cart.totalItems }}</span>
            </NuxtLink>
            <template v-if="user.isLoggedIn && user.currentUser">
              <NuxtLink v-if="user.currentUser.role === 'ADMIN'" @click="menuOpen = false" to="/admin" class="rounded border-2 border-black px-4 py-2 hover:border-purple-600 transition text-center">{{ $t('nav.backOffice') }}</NuxtLink>
              <NuxtLink v-if="user.currentUser.role === 'RESTAURATEUR'" @click="menuOpen = false" to="/restaurateur" class="rounded border-2 border-black px-4 py-2 hover:border-[#3AF24B] transition text-center">{{ $t('nav.myRestaurant') }}</NuxtLink>
              <NuxtLink @click="menuOpen = false" to="/profile" class="rounded border-2 border-black px-4 py-2 hover:border-[#3AF24B] transition text-center">{{ user.currentUser.name }}</NuxtLink>
              <button type="button" @click="logoutAndCloseMenu" class="rounded bg-black text-white px-4 py-2 hover:bg-[#3AF24B] hover:text-black transition">{{ $t('nav.logout') }}</button>
            </template>
            <div class="flex justify-center mt-2">
              <LazyLanguageSwitcher />
            </div>
          </nav>
        </div>
      </Transition>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t text-center text-xs text-gray-500 py-4 px-4">{{ $t('footer.copyright', { year, brand: 'mino\'s' }) }}</footer>
    <LazyToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'

const { t } = useI18n()
const user = useUserStore()
const cart = useCartStore()
const toast = useToast()
const router = useRouter()
const year = new Date().getFullYear()
const menuOpen = ref(false)

async function logout() {
  await user.logout();
  toast.info({
    title: t("auth.logoutSuccess"),
    message: t("auth.logoutMessage"),
    timeout: 2000
  });
  await router.push("/");
}

async function logoutAndCloseMenu() {
  menuOpen.value = false;
  await logout();
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>

