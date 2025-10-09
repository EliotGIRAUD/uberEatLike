<template>
  <div class="min-h-[calc(100vh-8rem)] p-6 flex items-center justify-center">
    <ClientOnly>
      <div v-if="user.isLoggedIn && user.currentUser" class="max-w-2xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div class="text-center">
            <div class="w-20 h-20 rounded-full bg-[#3AF24B] text-black flex items-center justify-center text-3xl font-bold mx-auto mb-4">
              {{ user.currentUser.name.charAt(0).toUpperCase() }}
            </div>
            <p class="text-gray-600 mt-2">{{ user.currentUser.email }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-sm text-gray-600">Rôle</p>
            <p class="text-lg font-semibold text-gray-900">{{ user.currentUser.role }}</p>
          </div>
          <div class="flex gap-3 justify-center">
            <NuxtLink to="/restaurants" class="rounded-lg bg-[#3AF24B] text-black px-6 py-3 font-semibold hover:bg-black hover:text-white transition">Explorer les restaurants</NuxtLink>
            <button @click="logout" class="rounded-lg bg-[#3AF24B] text-black px-6 py-3 font-semibold hover:bg-black hover:text-white transition">Se déconnecter</button>
          </div>
        </div>
      </div>
      <div v-else class="max-w-2xl mx-auto text-center space-y-8">
        <div>
          <h1 class="text-5xl font-bold text-gray-900 mb-4">Bienvenue sur Gros<span class="text-[#3AF24B]">mino's</span></h1>
          <p class="text-xl text-gray-600">Découvrez les meilleurs restaurants et commandez vos plats préférés</p>
        </div>
        <div class="flex items-center justify-center gap-4">
          <NuxtLink to="/login" class="rounded-lg bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-lg">Se connecter</NuxtLink>
          <NuxtLink to="/register" class="rounded-lg bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-lg">Créer un compte</NuxtLink>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'

const user = useUserStore()

function logout() {
  user.logout()
}
</script>


