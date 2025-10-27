<template>
  <div class="min-h-dvh flex items-center justify-center p-4">
    <form @submit.prevent="onSubmit" class="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Créer un compte</h1>
        <p class="mt-2 text-sm text-gray-600">Rejoignez Gros<span class="text-[#3AF24B]">mino's</span> dès maintenant</p>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
          <input v-model="name" type="text" required class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" placeholder="Votre nom" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" required class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" placeholder="votre@email.com" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
          <input v-model="password" type="password" required class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" placeholder="••••••••" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Rôle</label>
          <select v-model="role" required class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition bg-white">
            <option value="CLIENT">Client</option>
            <option value="RESTAURATEUR">Restaurateur</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>
      <button type="submit" class="w-full rounded-lg bg-[#3AF24B] text-black py-3 font-semibold hover:bg-black hover:text-white transition shadow-md">Créer le compte</button>
      <p class="text-center text-sm text-gray-600">Vous avez déjà un compte ? <NuxtLink class="font-semibold text-[#3AF24B] hover:underline" to="/login">Se connecter</NuxtLink></p>
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
const role = ref<UserRole>('CLIENT')

function onSubmit() {
  userStore.registerOrLogin({ name: name.value, email: email.value, password: password.value, role: role.value })
  toast.success({
    title: t('auth.registerSuccess'),
    message: t('auth.registerWelcome', { name: name.value }),
    timeout: 2000,
  })
  if (role.value === 'CLIENT') {
    router.push('/restaurants')
  } else {
    router.push('/')
  }
}
</script>


