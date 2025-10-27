<template>
  <div class="min-h-dvh flex items-center justify-center p-4">
    <form @submit.prevent="onSubmit" class="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">{{ t('auth.login') }}</h1>
        <p class="mt-2 text-sm text-gray-600">{{ t('auth.loginSubtitle', { brand: 'mino\'s' }) }}</p>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ t('auth.email') }}</label>
          <input v-model="email" type="email" required class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" placeholder="votre@email.com" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ t('auth.password') }}</label>
          <input v-model="password" type="password" required class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" placeholder="••••••••" />
        </div>
      </div>
      <button type="submit" class="w-full rounded-lg bg-black text-white py-3 font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-md">{{ t('auth.login') }}</button>
      <p class="text-center text-sm text-gray-600">{{ t('auth.noAccount') }} <NuxtLink class="font-semibold text-[#3AF24B] hover:underline" to="/register">{{ t('nav.register') }}</NuxtLink></p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

definePageMeta({
  middleware: ['guest']
})

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

useHead({
  title: t('seo.login.title'),
  meta: [
    { name: 'description', content: t('seo.login.description') },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

const email = ref('')
const password = ref('')

function onSubmit() {
  const ok = userStore.login({ email: email.value, password: password.value })
  if (ok) {
    toast.success({
      title: t('auth.loginSuccess'),
      message: t('auth.loginWelcome', { name: userStore.currentUser?.name }),
      timeout: 2000,
    })
    
    if (userStore.currentUser?.role === 'ADMIN') {
      router.push('/admin')
    } else if (userStore.currentUser?.role === 'RESTAURATEUR') {
      router.push('/restaurateur')
    } else if (userStore.currentUser?.role === 'CLIENT') {
      router.push('/restaurants')
    } else {
      router.push('/')
    }
  } else {
    toast.error({
      title: t('auth.loginError'),
      message: t('auth.loginErrorMessage'),
      timeout: 3000,
    })
  }
}
</script>


