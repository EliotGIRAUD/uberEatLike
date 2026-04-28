<template>
  <div class="min-h-[calc(100vh-8rem)] p-4 sm:p-6 bg-[#F0FFF0] flex items-center justify-center">
    <ClientOnly>
      <div v-if="user.isLoggedIn && user.currentUser" class="w-full max-w-6xl mx-auto py-8">
        <div class="mb-8 text-center">
          <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
            {{ t('home.welcomeBack') || 'Bienvenue' }} <span class="text-[#3AF24B]">{{ user.currentUser.name }}</span> ! 👋
          </h1>
          <p class="text-lg text-gray-600">{{ t('home.dashboardSubtitle') || 'Votre tableau de bord personnel' }}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div class="lg:col-span-1 bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div class="text-center">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-[#3AF24B] to-emerald-400 text-black flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-lg">
                {{ user.currentUser.name.charAt(0).toUpperCase() }}
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ user.currentUser.name }}</h2>
              <p class="text-sm text-gray-600 break-all mb-4">{{ user.currentUser.email }}</p>
              
              <div class="bg-gradient-to-r from-[#3AF24B]/20 to-emerald-400/20 rounded-xl p-4 border-2 border-[#3AF24B]/30">
                <p class="text-xs text-gray-600 mb-1">{{ t('home.role') }}</p>
                <p class="text-xl font-bold text-gray-900 capitalize">{{ user.currentUser.role }}</p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <NuxtLink to="/restaurants" class="bg-gradient-to-br from-[#3AF24B] to-emerald-400 hover:from-black hover:to-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div class="text-white">
                <h3 class="text-2xl font-bold mb-2">{{ t('nav.restaurants') }}</h3>
                <p class="text-white/80 text-sm mb-4">{{ t('home.restaurantsDesc') || 'Découvrez nos restaurants partenaires' }}</p>
                <div class="flex items-center text-white font-semibold">
                  <span>{{ t('home.explore') || 'Explorer' }}</span>
                  <span class="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </NuxtLink>

            <NuxtLink to="/orders" class="bg-gradient-to-br from-black to-gray-800 hover:from-[#3AF24B] hover:to-emerald-400 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div class="text-white">
                <h3 class="text-2xl font-bold mb-2">{{ t('nav.orders') || 'Mes commandes' }}</h3>
                <p class="text-white/80 text-sm mb-4">{{ t('home.ordersDesc') || 'Suivez vos commandes en cours' }}</p>
                <div class="flex items-center text-white font-semibold">
                  <span>{{ t('home.view') || 'Voir' }}</span>
                  <span class="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </NuxtLink>

            <NuxtLink to="/cart" class="bg-gradient-to-br from-black to-gray-800 hover:from-[#3AF24B] hover:to-emerald-400 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div class="text-white">
                <h3 class="text-2xl font-bold mb-2">{{ t('nav.cart') || 'Mon panier' }}</h3>
                <p class="text-white/80 text-sm mb-4">{{ t('home.cartDesc') || 'Finalisez votre commande' }}</p>
                <div class="flex items-center text-white font-semibold">
                  <span>{{ t('home.open') || 'Ouvrir' }}</span>
                  <span class="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </NuxtLink>

            <NuxtLink to="/profile" class="bg-gradient-to-br from-[#3AF24B] to-emerald-400 hover:from-black hover:to-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div class="text-white">
                <h3 class="text-2xl font-bold mb-2">{{ t('nav.profile') || 'Mon profil' }}</h3>
                <p class="text-white/80 text-sm mb-4">{{ t('home.profileDesc') || 'Gérez vos informations' }}</p>
                <div class="flex items-center text-white font-semibold">
                  <span>{{ t('home.manage') || 'Gérer' }}</span>
                  <span class="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div v-else class="w-full max-w-2xl mx-auto text-center space-y-6 sm:space-y-8 px-4">
        <div>
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">{{ t('home.welcome', { brand: 'mino\'s' }) }}</h1>
          <p class="text-base sm:text-lg md:text-xl text-gray-600">{{ t('home.subtitle') }}</p>
        </div>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <NuxtLink to="/login" class="w-full sm:w-auto rounded-lg bg-black text-white px-8 py-4 text-base sm:text-lg font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-lg">{{ t('nav.login') }}</NuxtLink>
          <NuxtLink to="/register" class="w-full sm:w-auto rounded-lg bg-black text-white px-8 py-4 text-base sm:text-lg font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-lg">{{ t('nav.register') }}</NuxtLink>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'

const { t } = useI18n()
const user = useUserStore()

useHead({
  title: t('seo.home.title'),
  meta: [
    { name: 'description', content: t('seo.home.description') },
    { property: 'og:title', content: t('seo.home.title') },
    { property: 'og:description', content: t('seo.home.description') },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t('seo.home.title') },
    { name: 'twitter:description', content: t('seo.home.description') },
  ],
})

async function logout() {
  await user.logout();
}
</script>


