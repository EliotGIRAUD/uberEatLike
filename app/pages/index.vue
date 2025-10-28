<template>
  <div class="min-h-[calc(100vh-8rem)] p-4 sm:p-6 flex items-center justify-center">
    <ClientOnly>
      <div v-if="user.isLoggedIn && user.currentUser" class="w-full max-w-2xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl p-4 sm:p-8 space-y-6">
          <div class="text-center">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#3AF24B] text-black flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-4">
              {{ user.currentUser.name.charAt(0).toUpperCase() }}
            </div>
            <p class="text-sm sm:text-base text-gray-600 mt-2 break-all">{{ user.currentUser.email }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs sm:text-sm text-gray-600">{{ t('home.role') }}</p>
            <p class="text-base sm:text-lg font-semibold text-gray-900">{{ user.currentUser.role }}</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink to="/restaurants" class="rounded-lg bg-[#3AF24B] text-black px-6 py-3 font-semibold hover:bg-black hover:text-white transition text-center">{{ t('nav.restaurants') }}</NuxtLink>
            <button @click="logout" class="rounded-lg px-6 py-3 font-semibold bg-black text-white hover:bg-[#3AF24B] hover:text-black transition">{{ t('nav.logout') }}</button>
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

function logout() {
  user.logout()
}
</script>


