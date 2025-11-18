<template>
  <div class="min-h-[calc(100vh-8rem)] p-4 sm:p-6 bg-[#F0FFF0] flex items-center justify-center">
    <div class="w-full max-w-2xl space-y-6 bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900">{{ t('profile.title') }}</h1>
          <p class="mt-2 text-sm sm:text-base text-gray-600">{{ t('profile.subtitle') }}</p>
        </div>
        <BackButton />
      </div>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <div class="grid grid-cols-1 gap-5">
          <div>
            <label class="block text-sm font-bold text-gray-900 mb-2">{{ t('profile.fullName') }}</label>
            <input 
              v-model="form.name" 
              type="text" 
              required 
              class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base focus:outline-none focus:border-[#3AF24B] focus:ring-2 focus:ring-[#3AF24B]/20 transition-all" 
              :placeholder="t('profile.fullNamePlaceholder')" 
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-900 mb-2">{{ t('auth.email') }}</label>
            <input 
              v-model="form.email" 
              type="email" 
              required 
              class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base focus:outline-none focus:border-[#3AF24B] focus:ring-2 focus:ring-[#3AF24B]/20 transition-all" 
              placeholder="votre@email.com" 
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-900 mb-2">{{ t('auth.role') }}</label>
            <select 
              v-model="form.role" 
              required 
              class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base focus:outline-none focus:border-[#3AF24B] focus:ring-2 focus:ring-[#3AF24B]/20 transition-all bg-white"
            >
              <option value="CLIENT">{{ t('profile.roles.CLIENT') }}</option>
              <option value="RESTAURATEUR">{{ t('profile.roles.RESTAURATEUR') }}</option>
              <option value="ADMIN">{{ t('profile.roles.ADMIN') }}</option>
            </select>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-xl font-extrabold text-gray-900 mb-2">{{ t('profile.changePassword') }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ t('profile.changePasswordHint') }}</p>
          
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-gray-900 mb-2">{{ t('profile.newPassword') }}</label>
              <input 
                v-model="form.newPassword" 
                type="password" 
                class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base focus:outline-none focus:border-[#3AF24B] focus:ring-2 focus:ring-[#3AF24B]/20 transition-all" 
                placeholder="••••••••" 
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-900 mb-2">{{ t('profile.confirmPassword') }}</label>
              <input 
                v-model="form.confirmPassword" 
                type="password" 
                class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base focus:outline-none focus:border-[#3AF24B] focus:ring-2 focus:ring-[#3AF24B]/20 transition-all" 
                placeholder="••••••••" 
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <button 
            type="submit" 
            class="flex-1 rounded-xl bg-gradient-to-r from-[#3AF24B] to-emerald-400 text-black py-4 text-base font-bold hover:from-black hover:to-gray-800 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg"
          >
            {{ t('profile.save') }}
          </button>
          <button 
            type="button" 
            @click="resetForm"
            class="rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 px-6 py-4 text-base font-bold hover:from-gray-300 hover:to-gray-400 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            {{ t('profile.cancel') }}
          </button>
        </div>
      </form>

      <div class="border-t border-gray-200 pt-6">
        <div class="bg-gradient-to-r from-[#3AF24B]/10 to-emerald-400/10 p-5 rounded-xl border-2 border-[#3AF24B]/20">
          <h3 class="text-sm font-bold text-gray-900 mb-3">{{ t('profile.accountInfo') }}</h3>
          <div class="text-sm text-gray-700 space-y-2">
            <p><span class="font-bold">{{ t('profile.status') }}:</span> {{ userStore.isLoggedIn ? t('profile.statusConnected') : t('profile.statusDisconnected') }}</p>
            <p><span class="font-bold">{{ t('profile.currentRole') }}:</span> {{ getRoleLabel(userStore.currentUser?.role) }}</p>
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

const { t } = useI18n()
const userStore = useUserStore()
const toast = useToast()

useHead({
  title: t('seo.profile.title'),
  meta: [
    { name: 'description', content: t('seo.profile.description') },
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
    title: t('profile.cancelled'),
    message: t('profile.cancelledMessage'),
    timeout: 2000,
  })
}

function getRoleLabel(role?: UserRole): string {
  if (!role) return ''
  return t(`profile.roles.${role}`)
}

function onSubmit() {
  if (form.newPassword || form.confirmPassword) {
    if (form.newPassword !== form.confirmPassword) {
      toast.error({
        title: t('profile.updateError'),
        message: t('profile.passwordMismatch'),
        timeout: 3000,
      })
      return
    }
    if (form.newPassword.length < 3) {
      toast.error({
        title: t('profile.updateError'),
        message: t('profile.passwordTooShort'),
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
      title: t('profile.updateSuccess'),
      message: t('profile.updateSuccessMessage'),
      timeout: 3000,
    })
    form.newPassword = ''
    form.confirmPassword = ''
  } else {
    toast.error({
      title: t('profile.updateError'),
      message: t('profile.emailTaken'),
      timeout: 3000,
    })
  }
}

initForm()
</script>

