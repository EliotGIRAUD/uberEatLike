<template>
  <div class="min-h-[calc(100vh-8rem)] p-4 sm:p-6 bg-[#F0FFF0]">
    <div v-if="fetchError" class="max-w-5xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center mt-6">
        <p class="text-red-600 text-xl font-bold mb-2">Erreur de chargement</p>
        <p class="text-gray-600 mb-6">Impossible de charger le plat. Vérifiez votre connexion et {{ runtimeConfig.public.apiBase }}.</p>
        <button
          type="button"
          class="rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 font-bold hover:from-red-700 hover:to-red-800 transition-all hover:scale-105 shadow-lg"
          @click="reloadPage"
        >
          Réessayer
        </button>
      </div>
    </div>

    <div v-else-if="pending" class="max-w-5xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-white rounded-2xl shadow-xl p-12 text-center mt-6">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#3AF24B] mb-6"></div>
        <p class="text-gray-900 text-xl font-bold">Chargement de la bombe calorique...</p>
        <p class="text-gray-500 mt-2">Préparation du festin</p>
      </div>
    </div>

    <div v-else-if="!food" class="max-w-5xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center mt-6">
        <p class="text-red-600 text-lg font-bold">{{ t('foods.notFound') }}</p>
      </div>
    </div>

    <div v-else class="max-w-5xl mx-auto">
      <BackButton :fallbackHref="`/restaurants/${food.restaurantId}`" />

      <article class="bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
        <div v-if="food.imageUrl" class="w-full h-80 sm:h-96 bg-gradient-to-br from-[#3AF24B] to-emerald-400 overflow-hidden">
          <img :src="food.imageUrl" :alt="food.name" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-full h-80 sm:h-96 bg-gradient-to-br from-[#3AF24B] to-emerald-400 flex items-center justify-center text-white text-4xl font-bold">
          Plat
        </div>

        <div class="p-6 sm:p-8">
          <header class="mb-6">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">{{ food.name }}</h1>
            <p class="text-3xl sm:text-4xl font-extrabold text-[#3AF24B]">{{ food.price.toFixed(2) }} €</p>
          </header>

          <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 mb-3">{{ t('foods.description') }}</h2>
            <p class="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{{ food.description || "—" }}</p>
          </section>

          <div class="flex gap-3">
            <button
              type="button"
              class="flex-1 rounded-xl bg-gradient-to-r from-[#3AF24B] to-emerald-400 text-black py-4 px-6 font-bold hover:from-black hover:to-gray-800 hover:text-white transition-all duration-300 hover:scale-105 shadow-xl text-lg"
              @click="addToCart"
            >
              {{ t('foods.addToCart') }}
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BackButton from "~/components/BackButton.vue";
import { useCartStore } from "../../stores/cart";

const { t } = useI18n();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const cart = useCartStore();
const toast = useToast();

type ApiDish = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
};

type FoodView = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
};

function absoluteImageUrl(base: string, image?: string | null): string | undefined {
  let imageUrl = image ?? undefined;
  if (imageUrl && !imageUrl.startsWith("http")) {
    imageUrl = `${base}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  }
  return imageUrl;
}

const { data: apiDish, error: fetchError, pending } = await useAsyncData(
  () => `food-detail-${route.params.id}`,
  async () => {
    const base = (runtimeConfig.public.apiBase as string).replace(/\/$/, "");
    return $fetch<ApiDish>(`${base}/dishes/${route.params.id}`);
  }
);

const food = computed((): FoodView | null => {
  const d = apiDish.value;
  if (!d) return null;
  const base = (runtimeConfig.public.apiBase as string).replace(/\/$/, "");
  return {
    id: d.id,
    restaurantId: d.restaurantId,
    name: d.name,
    description: d.description ?? "",
    price: d.price,
    imageUrl: absoluteImageUrl(base, d.image)
  };
});

function reloadPage() {
  if (import.meta.client) {
    window.location.reload();
  }
}

function addToCart() {
  const f = food.value;
  if (!f) return;
  const result = cart.addItem({
    id: f.id,
    restaurantId: f.restaurantId,
    name: f.name,
    description: f.description,
    price: f.price,
    imageUrl: f.imageUrl
  });
  if (result.success === false) {
    toast.error({
      title: "Panier",
      message: result.message,
      timeout: 3500
    });
    return;
  }
  toast.success({
    title: t("cart.itemAdded"),
    message: t("cart.itemAddedMessage", { name: f.name }),
    timeout: 2000
  });
}

useHead(() => ({
  title: food.value
    ? t("seo.food.title", { name: food.value.name, price: food.value.price })
    : t("seo.restaurants.title"),
  meta: [
    {
      name: "description",
      content: food.value
        ? t("seo.food.description", { description: food.value.description })
        : t("seo.restaurants.description")
    },
    {
      property: "og:title",
      content: food.value
        ? t("seo.food.title", { name: food.value.name, price: food.value.price })
        : t("seo.restaurants.title")
    },
    { property: "og:type", content: "product" },
    { property: "product:price:amount", content: food.value?.price.toString() || "0" },
    { property: "product:price:currency", content: "EUR" }
  ]
}));
</script>
