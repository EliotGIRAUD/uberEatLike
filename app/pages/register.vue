<template>
  <div class="min-h-dvh flex items-center justify-center p-4">
    <form @submit.prevent="onSubmit" class="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">{{ t('auth.register') }}</h1>
        <p class="mt-2 text-sm text-gray-600">{{ t('auth.registerSubtitle', { brand: "mino's" }) }}</p>
        <p class="mt-2 text-xs text-gray-500">{{ t('auth.registerClientOnlyHint') }}</p>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ t('auth.name') }}</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition"
            placeholder="Votre nom"
            :disabled="submitting"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ t('auth.email') }}</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition"
            placeholder="votre@email.com"
            :disabled="submitting"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ t('auth.password') }}</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition"
            placeholder="••••••••"
            :disabled="submitting"
          />
        </div>
      </div>
      <button
        type="submit"
        class="w-full rounded-lg bg-[#3AF24B] text-black py-3 font-semibold hover:bg-black hover:text-white transition shadow-md disabled:opacity-60 disabled:pointer-events-none"
        :disabled="submitting"
      >
        {{ submitting ? "…" : t("nav.register") }}
      </button>
      <p class="text-center text-sm text-gray-600">{{ t('auth.hasAccount') }} <NuxtLink class="font-semibold text-[#3AF24B] hover:underline" to="/login">{{ t('nav.login') }}</NuxtLink></p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";

definePageMeta({
  middleware: ["guest"]
});

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const toast = useToast();

useHead({
  title: t("seo.register.title"),
  meta: [
    { name: "description", content: t("seo.register.description") },
    { name: "robots", content: "noindex, nofollow" }
  ]
});

const name = ref("");
const email = ref("");
const password = ref("");
const submitting = ref(false);

async function onSubmit() {
  submitting.value = true;
  try {
    await userStore.registerAccount(name.value.trim(), email.value.trim(), password.value);
    toast.success({
      title: t("auth.registerSuccess"),
      message: t("auth.registerWelcome", { name: name.value }),
      timeout: 2000
    });
    await router.push("/");
  } catch (e) {
    const message = e instanceof Error ? e.message : t("auth.registerErrorMessage");
    toast.error({
      title: t("auth.registerError"),
      message,
      timeout: 3500
    });
  } finally {
    submitting.value = false;
  }
}
</script>
