<template>
  <div class="min-h-[calc(100vh-8rem)] p-4 sm:p-6 bg-[#F0FFF0]">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <div class="flex flex-col gap-6">
          <div class="text-center md:text-left">
            <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
              {{ t('restaurants.title', { highlight: t('restaurants.highlight') }) }}
            </h1>
            <p class="text-lg text-gray-600">{{ t('restaurants.subtitle') }}</p>
          </div>

          <div class="w-full">
            <div class="bg-white rounded-2xl shadow-xl p-4">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="t('restaurants.search')"
                  class="w-full rounded-xl border-2 border-gray-200 pl-12 pr-12 py-4 text-lg focus:outline-none focus:border-[#3AF24B] focus:ring-2 focus:ring-[#3AF24B]/20 transition-all"
                />
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <button
                  v-if="searchQuery"
                  type="button"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  @click="searchQuery = ''"
                >
                  <span class="text-xl">✕</span>
                </button>
              </div>
              <div v-if="searchQuery" class="mt-3 text-sm font-semibold text-gray-600 pl-2">
                {{ t('restaurants.found', { count: filteredRestaurants.length }) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="fetchError" class="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
        <p class="text-red-600 text-xl font-bold mb-2">Erreur de chargement</p>
        <p class="text-gray-600 mb-6">Impossible de charger les restaurants. Vérifiez l’API et {{ runtimeConfig.public.apiBase }}.</p>
        <button
          type="button"
          class="rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 font-bold hover:from-red-700 hover:to-red-800 transition-all hover:scale-105 shadow-lg"
          @click="() => refresh()"
        >
          Réessayer
        </button>
      </div>

      <div v-else-if="pending" class="bg-white rounded-2xl shadow-xl p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#3AF24B] mb-6" />
        <p class="text-gray-900 text-xl font-bold">Chargement des temples du gras...</p>
        <p class="text-gray-500 mt-2">Préparation du festin</p>
      </div>

      <div v-else-if="filteredRestaurants.length === 0 && !searchQuery" class="bg-white rounded-2xl shadow-xl p-12 text-center">
        <p class="text-gray-900 text-xl font-bold mb-2">{{ t('restaurants.noRestaurants') }}</p>
        <p class="text-gray-500">{{ t('restaurants.noRestaurantsHint') }}</p>
      </div>

      <div v-else-if="filteredRestaurants.length === 0 && searchQuery" class="bg-white rounded-2xl shadow-xl p-12 text-center">
        <p class="text-gray-900 text-xl font-bold mb-2">{{ t('restaurants.noResults', { query: searchQuery }) }}</p>
        <p class="text-gray-500 mb-6">{{ t('restaurants.noResultsHint') }}</p>
        <button
          type="button"
          class="rounded-xl bg-gradient-to-r from-[#3AF24B] to-emerald-400 text-black px-8 py-4 font-bold hover:from-black hover:to-gray-800 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg"
          @click="searchQuery = ''"
        >
          {{ t('restaurants.showAll') }}
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="r in filteredRestaurants"
          :key="r.id"
          :to="`/restaurants/${r.id}`"
          class="block bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group"
        >
          <div class="aspect-video bg-gradient-to-br from-[#3AF24B] to-emerald-400 relative overflow-hidden">
            <img
              v-if="r.imageUrl"
              :src="r.imageUrl"
              :alt="r.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
              Restaurant
            </div>
            <div class="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
              {{ r.ville || 'Partenaire' }}
            </div>
          </div>

          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#3AF24B] transition-colors">
              {{ r.name }}
            </h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-1">
              {{ r.address }}
            </p>
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <span v-if="r.cuisine" class="inline-flex items-center gap-1 bg-[#3AF24B]/20 text-[#3AF24B] px-3 py-1 rounded-full text-xs font-bold">
                {{ r.cuisine }}
              </span>
              <span class="text-sm font-bold text-[#3AF24B] group-hover:translate-x-1 transition-transform">
                {{ t('restaurants.viewMenu') }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();

useHead({
  title: t('seo.restaurants.title'),
  meta: [
    { name: 'description', content: t('seo.restaurants.description') },
    { property: 'og:title', content: t('seo.restaurants.title') },
    { property: 'og:description', content: t('seo.restaurants.description') },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
});

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

type Paginated<T> = {
  data: T[];
  pagination: { total: number; limit: number; offset: number };
};

type ListRestaurant = {
  id: string;
  name: string;
  address: string;
  ville: string;
  cuisine?: string;
  imageUrl?: string;
};

const searchQuery = ref("");

const {
  data: rawList,
  error: fetchError,
  pending,
  refresh
} = await useAsyncData(
  "restaurants-list",
  async () => {
    const base = (runtimeConfig.public.apiBase as string).replace(/\/$/, "");
    const res = await $fetch<Paginated<ApiRestaurant>>(`${base}/restaurants?limit=100`);
    return res.data;
  },
  { default: () => [] as ApiRestaurant[] }
);

function formatAddress(r: ApiRestaurant): string {
  const parts = [r.address, r.postalCode, r.city].filter(Boolean);
  return parts.length ? parts.join(", ") : "Adresse non renseignée";
}

const allRestaurants = computed((): ListRestaurant[] => {
  const apiBase = (runtimeConfig.public.apiBase as string).replace(/\/$/, "");
  return (rawList.value || []).map((r) => {
    let imageUrl = r.image ?? undefined;
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `${apiBase}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
    }
    return {
      id: r.id,
      name: r.name,
      address: formatAddress(r),
      ville: r.city || "",
      cuisine: r.city || undefined,
      imageUrl
    };
  });
});

const filteredRestaurants = computed(() => {
  if (!searchQuery.value) {
    return allRestaurants.value;
  }
  const query = searchQuery.value.toLowerCase().trim();
  return allRestaurants.value.filter((restaurant) => {
    if (restaurant.name.toLowerCase().includes(query)) return true;
    if (restaurant.address.toLowerCase().includes(query)) return true;
    if (restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(query)) return true;
    if (restaurant.ville && restaurant.ville.toLowerCase().includes(query)) return true;
    return false;
  });
});
</script>
