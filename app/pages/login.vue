<template>
  <div class="min-h-dvh flex items-center justify-center p-4">
    <form @submit.prevent="onSubmit" class="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Connexion</h1>
        <p class="mt-2 text-sm text-gray-600">Accédez à votre compte Gros<span class="text-[#3AF24B]">mino's</span></p>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" required class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" placeholder="votre@email.com" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
          <input v-model="password" type="password" required class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" placeholder="••••••••" />
        </div>
      </div>
      <button type="submit" class="w-full rounded-lg bg-black text-white py-3 font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-md">Se connecter</button>
      <p class="text-center text-sm text-gray-600">Pas encore de compte ? <NuxtLink class="font-semibold text-[#3AF24B] hover:underline" to="/register">Créer un compte</NuxtLink></p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

const email = ref('')
const password = ref('')

function onSubmit() {
  const ok = userStore.login({ email: email.value, password: password.value })
  if (ok) {
    toast.success({
      title: 'Connexion réussie !',
      message: `Bienvenue ${userStore.currentUser?.name}`,
      timeout: 2000,
    })
    if (userStore.currentUser?.role === 'CLIENT') {
      router.push('/restaurants')
    } else {
      router.push('/')
    }
  } else {
    toast.error({
      title: 'Erreur de connexion',
      message: 'Email ou mot de passe incorrect',
      timeout: 3000,
    })
  }
}
</script>


