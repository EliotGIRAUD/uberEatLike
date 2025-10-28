<template>
  <div class="min-h-dvh flex items-center justify-center p-4">
    <div class="w-full max-w-2xl space-y-6 bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Mon profil</h1>
          <p class="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">Gérez vos informations personnelles</p>
        </div>
        <BackButton />
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4 sm:space-y-6">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Nom complet</label>
            <input 
              v-model="form.name" 
              type="text" 
              required 
              class="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-[#3AF24B] transition" 
              placeholder="Votre nom complet" 
            />
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              v-model="form.email" 
              type="email" 
              required 
              class="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-[#3AF24B] transition" 
              placeholder="votre@email.com" 
            />
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Rôle</label>
            <select 
              v-model="form.role" 
              required 
              class="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-[#3AF24B] transition bg-white"
            >
              <option value="CLIENT">Client</option>
              <option value="RESTAURATEUR">Restaurateur</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>
        </div>

        <div class="border-t pt-4 sm:pt-6">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Modifier le mot de passe</h3>
          <p class="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Laissez vide si vous ne souhaitez pas changer votre mot de passe</p>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Nouveau mot de passe</label>
              <input 
                v-model="form.newPassword" 
                type="password" 
                class="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-[#3AF24B] transition" 
                placeholder="••••••••" 
              />
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input 
                v-model="form.confirmPassword" 
                type="password" 
                class="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-[#3AF24B] transition" 
                placeholder="••••••••" 
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4">
          <button 
            type="submit" 
            class="flex-1 rounded-lg bg-black text-white py-2.5 sm:py-3 text-sm sm:text-base font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-md"
          >
            Enregistrer les modifications
          </button>
          <button 
            type="button" 
            @click="resetForm"
            class="rounded-lg border-2 border-gray-200 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold hover:border-gray-400 transition"
          >
            Annuler
          </button>
        </div>
      </form>

      <div class="border-t pt-4 sm:pt-6">
        <div class="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <h3 class="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Informations du compte</h3>
          <div class="text-xs sm:text-sm text-gray-600 space-y-1">
            <p><span class="font-medium">Status:</span> {{ userStore.isLoggedIn ? 'Connecté' : 'Déconnecté' }}</p>
            <p><span class="font-medium">Rôle actuel:</span> {{ getRoleLabel(userStore.currentUser?.role) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, type UserRole } from '../stores/user'
import { useToast } from '../composables/useToast'

definePageMeta({
  middleware: ['auth']
})

const userStore = useUserStore()
const toast = useToast()

useHead({
  title: 'Mon Profil - Grosmino\'s',
  meta: [
    { name: 'description', content: 'Gérez vos informations personnelles.' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

const form = reactive({
  name: '',
  email: '',
  role: 'CLIENT' as UserRole,
  newPassword: '',
  confirmPassword: '',
})

function initForm() {
  if (userStore.currentUser) {
    form.name = userStore.currentUser.name
    form.email = userStore.currentUser.email
    form.role = userStore.currentUser.role
    form.newPassword = ''
    form.confirmPassword = ''
  }
}

function resetForm() {
  initForm()
  toast.info({
    title: 'Annulé',
    message: 'Les modifications ont été annulées',
    timeout: 2000,
  })
}

function getRoleLabel(role?: UserRole): string {
  if (!role) return ''
  const labels: Record<UserRole, string> = {
    CLIENT: 'Client',
    RESTAURATEUR: 'Restaurateur',
    ADMIN: 'Administrateur',
  }
  return labels[role] || role
}

function onSubmit() {
  if (form.newPassword || form.confirmPassword) {
    if (form.newPassword !== form.confirmPassword) {
      toast.error({
        title: 'Erreur',
        message: 'Les mots de passe ne correspondent pas',
        timeout: 3000,
      })
      return
    }
    if (form.newPassword.length < 3) {
      toast.error({
        title: 'Erreur',
        message: 'Le mot de passe doit contenir au moins 3 caractères',
        timeout: 3000,
      })
      return
    }
  }

  const updateData: any = {
    name: form.name,
    email: form.email,
    role: form.role,
  }

  if (form.newPassword) {
    updateData.password = form.newPassword
  } else if (userStore.currentUser) {
    updateData.password = userStore.currentUser.password
  }

  const success = userStore.updateProfile(updateData)

  if (success) {
    toast.success({
      title: 'Profil mis à jour',
      message: 'Vos informations ont été enregistrées avec succès',
      timeout: 3000,
    })
    form.newPassword = ''
    form.confirmPassword = ''
  } else {
    toast.error({
      title: 'Erreur',
      message: 'Cet email est déjà utilisé par un autre utilisateur',
      timeout: 3000,
    })
  }
}

initForm()
</script>

