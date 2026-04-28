<template>
  <div class="min-h-[calc(100vh-8rem)] p-4 sm:p-6 bg-[#F0FFF0]">
    <div v-if="restaurantError || foodsError" class="max-w-7xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center mt-6">
        <p class="text-red-600 text-xl font-bold mb-2">Erreur de chargement</p>
        <p class="text-gray-600 mb-6">Impossible de charger les données. Vérifiez votre connexion et {{ runtimeConfig.public.apiBase }}.</p>
        <button
          type="button"
          class="rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 font-bold hover:from-red-700 hover:to-red-800 transition-all hover:scale-105 shadow-lg"
          @click="reloadPage"
        >
          Réessayer
        </button>
      </div>
    </div>

    <div v-else-if="restaurantPending || foodsPending" class="max-w-7xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-white rounded-2xl shadow-xl p-12 text-center mt-6">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#3AF24B] mb-6"></div>
        <p class="text-gray-900 text-xl font-bold">Chargement du temple calorique...</p>
        <p class="text-gray-500 mt-2">Préparation du festin</p>
      </div>
    </div>

    <div v-else-if="!restaurant" class="max-w-7xl mx-auto">
      <BackButton fallbackHref="/restaurants" />
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center mt-6">
        <p class="text-red-600 text-lg font-bold">{{ t('restaurants.notFound') }}</p>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto space-y-8">
      <BackButton fallbackHref="/restaurants" />

      <header class="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row items-start gap-6">
          <div v-if="restaurant.imageUrl" class="w-full sm:w-40 h-40 rounded-xl shadow-md flex-shrink-0 overflow-hidden">
            <img :src="restaurant.imageUrl" :alt="restaurant.name" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-full sm:w-40 h-40 bg-gradient-to-br from-[#3AF24B] to-emerald-400 rounded-xl shadow-md flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold">
            Restaurant
          </div>

          <div class="flex-1">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{{ restaurant.name }}</h1>

            <div class="flex flex-wrap items-center gap-2 mb-4">
              <span class="inline-flex items-center gap-1 bg-gradient-to-r from-[#3AF24B] to-emerald-400 text-black px-4 py-2 rounded-full text-sm font-bold shadow-md">
                {{ restaurant.cuisine || 'Restaurant' }}
              </span>
              <span v-if="restaurant.rating" class="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-md">
                {{ restaurant.rating }}/5
              </span>
              <span v-if="restaurant.priceRange" class="inline-flex items-center bg-gradient-to-r from-black to-gray-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                {{ restaurant.priceRange }}
              </span>
            </div>

            <p v-if="restaurant.description" class="text-gray-700 mb-3 leading-relaxed">{{ restaurant.description }}</p>

            <p class="text-gray-600 text-sm font-medium">
              {{ restaurant.address }}
            </p>
          </div>
        </div>
      </header>

      <section>
        <div class="mb-6">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            {{ t('restaurants.ourMenu', { highlight: t('restaurants.menuHighlight') }) }}
          </h2>
          <p class="text-lg text-gray-600">{{ t('restaurants.menuSubtitle') }}</p>
        </div>

        <div v-if="foods.length === 0" class="bg-white rounded-2xl shadow-xl p-12 text-center">
          <p class="text-gray-900 text-xl font-bold mb-2">{{ t('restaurants.noFoods') }}</p>
          <p class="text-gray-500">{{ t('restaurants.noFoodsHint') }}</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <LazyFoodCard v-for="f in foods" :key="f.id" :food="f" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BackButton from "~/components/BackButton.vue";

const { t } = useI18n();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();

type ApiRestaurant = {
  id: string;
  name: string;
  image?: string | null;
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

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

type Paginated<T> = {
  data: T[];
  pagination: { total: number; limit: number; offset: number };
};

type DetailRestaurant = {
  id: string;
  name: string;
  address: string;
  cuisine?: string;
  rating?: number;
  priceRange?: string;
  description?: string;
  imageUrl?: string;
};

function formatAddress(r: ApiRestaurant): string {
  const parts = [r.address, r.postalCode, r.city].filter(Boolean);
  return parts.length ? parts.join(", ") : "Adresse non renseignée";
}

function absoluteImageUrl(base: string, image?: string | null): string | undefined {
  let imageUrl = image ?? undefined;
  if (imageUrl && !imageUrl.startsWith("http")) {
    imageUrl = `${base}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  }
  return imageUrl;
}

const { data: apiRestaurant, error: restaurantError, pending: restaurantPending } = await useAsyncData(
  () => `restaurant-detail-${route.params.id}`,
  async () => {
    const base = (runtimeConfig.public.apiBase as string).replace(/\/$/, "");
    const id = String(route.params.id);
    try {
      return await $fetch<ApiRestaurant>(`${base}/restaurants/${id}`);
    } catch {
      return null;
    }
  }
);

const { data: apiDishes, error: foodsError, pending: foodsPending } = await useAsyncData(
  () => `restaurant-dishes-${route.params.id}`,
  async () => {
    const base = (runtimeConfig.public.apiBase as string).replace(/\/$/, "");
    const res = await $fetch<Paginated<ApiDish>>(
      `${base}/restaurants/${route.params.id}/dishes?limit=100`
    );
    return res.data;
  },
  { default: () => [] as ApiDish[] }
);

const restaurant = computed((): DetailRestaurant | null => {
  const r = apiRestaurant.value;
  if (!r) return null;
  const base = (runtimeConfig.public.apiBase as string).replace(/\/$/, "");
  return {
    id: r.id,
    name: r.name,
    address: formatAddress(r),
    cuisine: r.city || undefined,
    imageUrl: absoluteImageUrl(base, r.image)
  };
});

const foods = computed(() => {
  const base = (runtimeConfig.public.apiBase as string).replace(/\/$/, "");
  return (apiDishes.value || []).map((d) => ({
    id: d.id,
    restaurantId: d.restaurantId,
    name: d.name,
    description: d.description ?? "",
    price: d.price,
    imageUrl: absoluteImageUrl(base, d.image)
  }));
});

function reloadPage() {
  if (import.meta.client) {
    window.location.reload();
  }
}

useHead(() => ({
  title: restaurant.value
    ? t("seo.restaurant.title", { name: restaurant.value.name })
    : t("seo.restaurants.title"),
  meta: [
    {
      name: "description",
      content: restaurant.value
        ? t("seo.restaurant.description", {
            name: restaurant.value.name,
            cuisine: restaurant.value.cuisine || "Restaurant",
            address: restaurant.value.address
          })
        : t("seo.restaurants.description")
    },
    {
      property: "og:title",
      content: restaurant.value
        ? t("seo.restaurant.title", { name: restaurant.value.name })
        : t("seo.restaurants.title")
    },
    { property: "og:type", content: "restaurant" }
  ]
}));
</script>
