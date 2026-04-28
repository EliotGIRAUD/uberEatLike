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

      <div v-if="userStore.currentUser?.role !== 'CLIENT'" class="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        {{ t("profile.apiEditClientOnly") }}
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
            <p class="mt-1 text-xs text-gray-500">{{ t("profile.displayNameHint") }}</p>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-900 mb-2">{{ t('auth.email') }}</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base focus:outline-none focus:border-[#3AF24B] focus:ring-2 focus:ring-[#3AF24B]/20 transition-all"
              placeholder="votre@email.com"
              :disabled="userStore.currentUser?.role !== 'CLIENT'"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-900 mb-2">{{ t('auth.role') }}</label>
            <p class="w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3 text-base font-semibold text-gray-800">
              {{ getRoleLabel(userStore.currentUser?.role) }}
            </p>
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
                :disabled="userStore.currentUser?.role !== 'CLIENT'"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-900 mb-2">{{ t('profile.confirmPassword') }}</label>
              <input
                v-model="form.confirmPassword"
                type="password"
                class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base focus:outline-none focus:border-[#3AF24B] focus:ring-2 focus:ring-[#3AF24B]/20 transition-all"
                placeholder="••••••••"
                :disabled="userStore.currentUser?.role !== 'CLIENT'"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            class="flex-1 rounded-xl bg-gradient-to-r from-[#3AF24B] to-emerald-400 text-black py-4 text-base font-bold hover:from-black hover:to-gray-800 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-60"
            :disabled="saving"
          >
            {{ saving ? "…" : t("profile.save") }}
          </button>
          <button
            type="button"
            class="rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 px-6 py-4 text-base font-bold hover:from-gray-300 hover:to-gray-400 transition-all duration-300 hover:scale-105 shadow-lg"
            @click="resetForm"
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
import { reactive, ref } from "vue";
import { useUserStore, type UserRole } from "../stores/user";
import BackButton from "~/components/BackButton.vue";
import type { ApiError } from "~/composables/useApi";

definePageMeta({
  middleware: ["auth"]
});

const { t } = useI18n();
const userStore = useUserStore();
const toast = useToast();

useHead({
  title: t("seo.profile.title"),
  meta: [
    { name: "description", content: t("seo.profile.description") },
    { name: "robots", content: "noindex, nofollow" }
  ]
});

const form = reactive({
  name: "",
  email: "",
  newPassword: "",
  confirmPassword: ""
});

const saving = ref(false);

function initForm() {
  if (userStore.currentUser) {
    form.name = userStore.currentUser.name;
    form.email = userStore.currentUser.email;
    form.newPassword = "";
    form.confirmPassword = "";
  }
}

function resetForm() {
  initForm();
  toast.info({
    title: t("profile.cancelled"),
    message: t("profile.cancelledMessage"),
    timeout: 2000
  });
}

function getRoleLabel(role?: UserRole): string {
  if (!role) return "";
  return t(`profile.roles.${role}`);
}

async function onSubmit() {
  if (form.newPassword || form.confirmPassword) {
    if (form.newPassword !== form.confirmPassword) {
      toast.error({
        title: t("profile.updateError"),
        message: t("profile.passwordMismatch"),
        timeout: 3000
      });
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error({
        title: t("profile.updateError"),
        message: t("profile.passwordTooShort"),
        timeout: 3000
      });
      return;
    }
  }

  saving.value = true;
  try {
    userStore.setDisplayName(form.name);

    if (userStore.currentUser?.role !== "CLIENT") {
      toast.success({
        title: t("profile.updateSuccess"),
        message: t("profile.displayNameOnlySaved"),
        timeout: 3000
      });
      form.newPassword = "";
      form.confirmPassword = "";
      return;
    }

    const emailChanged = form.email.trim() !== userStore.currentUser!.email;
    const password = form.newPassword.trim() || undefined;

    if (!emailChanged && !password) {
      toast.success({
        title: t("profile.updateSuccess"),
        message: t("profile.updateSuccessMessage"),
        timeout: 3000
      });
      form.newPassword = "";
      form.confirmPassword = "";
      return;
    }

    await userStore.updateProfileApi({
      email: emailChanged ? form.email.trim() : undefined,
      password
    });

    toast.success({
      title: t("profile.updateSuccess"),
      message: t("profile.updateSuccessMessage"),
      timeout: 3000
    });
    form.newPassword = "";
    form.confirmPassword = "";
    initForm();
  } catch (e) {
    const err = e as ApiError;
    toast.error({
      title: t("profile.updateError"),
      message: err?.detail ?? t("profile.emailTaken"),
      timeout: 4000
    });
  } finally {
    saving.value = false;
  }
}

initForm();
</script>
