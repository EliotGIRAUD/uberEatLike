<template>
  <div class="min-h-dvh flex items-center justify-center p-4">
    <form @submit.prevent="onSubmit" class="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">{{ t('auth.register') }}</h1>
        <p class="mt-2 text-sm text-gray-600">{{ t('auth.registerSubtitle', { brand: "mino's" }) }}</p>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ t('auth.name') }}</label>
          <input v-model="name" type="text" required class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" placeholder="Votre nom" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ t('auth.email') }}</label>
          <input v-model="email" type="email" required class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" placeholder="votre@email.com" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ t('auth.password') }}</label>
          <input v-model="password" type="password" required class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" placeholder="••••••••" />
        </div>
      </div>
      <button type="submit" class="w-full rounded-lg bg-[#3AF24B] text-black py-3 font-semibold hover:bg-black hover:text-white transition shadow-md">{{ t('nav.register') }}</button>
      <p class="text-center text-sm text-gray-600">{{ t('auth.hasAccount') }} <NuxtLink class="font-semibold text-[#3AF24B] hover:underline" to="/login">{{ t('nav.login') }}</NuxtLink></p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import type { UserRole } from '../stores/user'

definePageMeta({
  middleware: ['guest']
})

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

useHead({
  title: t('seo.register.title'),
  meta: [
    { name: 'description', content: t('seo.register.description') },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

const name = ref('')
const email = ref('')
const password = ref('')
// Le rôle est fixé à CLIENT pour l'inscription publique
// Seul l'admin peut créer des comptes RESTAURATEUR via le back office
const role = ref<UserRole>('CLIENT')

function onSubmit() {
  userStore.registerOrLogin({ name: name.value, email: email.value, password: password.value, role: role.value })
  toast.success({
    title: t('auth.registerSuccess'),
    message: t('auth.registerWelcome', { name: name.value }),
    timeout: 2000,
  })
  // Redirection vers la page des restaurants après inscription
  router.push('/restaurants')
}
</script>


