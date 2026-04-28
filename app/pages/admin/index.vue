<template>
  <div class="min-h-dvh p-6">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Back Office Administrateur</h1>
            <p class="mt-2 text-sm text-gray-600">
              Gestion des restaurants Gros<span class="text-[#3AF24B]">mino's</span>
            </p>
          </div>
          <button
            type="button"
            class="rounded-lg bg-[#3AF24B] text-black px-6 py-3 font-semibold hover:bg-black hover:text-white transition shadow-md"
            @click="showAddModal = true"
          >
            + Ajouter un restaurant
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <dl class="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <dt class="text-sm text-gray-600">Total restaurants</dt>
          </div>
          <dd class="w-12 h-12 bg-[#3AF24B] rounded-full flex items-center justify-center text-2xl font-bold">
            {{ restaurants.length }}
          </dd>
        </dl>
        <dl class="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <dt class="text-sm text-gray-600">Votre rôle</dt>
            <dd class="text-xl font-bold text-gray-900 mt-1">{{ userStore.currentUser?.role }}</dd>
          </div>
          <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-xl">
            A
          </div>
        </dl>
      </div>

      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6 border-b flex items-center justify-between flex-wrap gap-2">
          <h2 class="text-xl font-bold text-gray-900">Liste des restaurants</h2>
          <button
            v-if="loadError"
            type="button"
            class="text-sm font-semibold text-[#3AF24B] hover:underline"
            @click="loadRestaurants"
          >
            Réessayer
          </button>
        </div>

        <div v-if="loading" class="p-12 text-center text-gray-600">Chargement…</div>
        <div v-else-if="loadError" class="p-12 text-center text-red-600">{{ loadError }}</div>
        <div v-else-if="restaurants.length === 0" class="p-12 text-center">
          <p class="text-gray-500 text-lg">Aucun restaurant</p>
          <p class="text-gray-400 text-sm mt-2">Créez un compte restaurateur lié à un restaurant</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Adresse</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ville</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Propriétaire</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="r in restaurants" :key="r.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{{ r.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ r.address || "—" }}
                  <span v-if="r.postalCode" class="text-gray-500 block">{{ r.postalCode }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ r.city || "—" }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">{{ r.ownerId }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b sticky top-0 bg-white">
          <h2 class="text-2xl font-bold text-gray-900">Nouveau restaurant</h2>
          <p class="text-sm text-gray-500 mt-1">Crée le compte de connexion du restaurateur (email / mot de passe) et la fiche.</p>
        </div>

        <form class="p-6 space-y-4" @submit.prevent="submitCreate">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nom du restaurant *</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition"
              placeholder="Restaurant Le Gourmet"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Image (URL optionnelle)</label>
            <input
              v-model="form.image"
              type="text"
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition"
              placeholder="https://…"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Adresse</label>
            <input
              v-model="form.address"
              type="text"
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Code postal</label>
              <input v-model="form.postalCode" type="text" class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Ville</label>
              <input v-model="form.city" type="text" class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Email du restaurateur *</label>
            <input v-model="form.email" type="email" required class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe du restaurateur *</label>
            <input
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition"
            />
          </div>
          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              class="flex-1 rounded-lg bg-black text-white py-3 font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-md disabled:opacity-50"
              :disabled="submitting"
            >
              {{ submitting ? "…" : "Créer" }}
            </button>
            <button type="button" class="rounded-lg border-2 border-gray-200 text-gray-700 px-6 py-3 font-semibold hover:border-gray-400 transition" @click="closeModal">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useUserStore } from "../../stores/user";
import type { ApiError } from "~/composables/useApi";

definePageMeta({
  middleware: ["admin"]
});

const userStore = useUserStore();
const { request } = useApi();
const toast = useToast();

useHead({
  title: "Back Office Administrateur - Grosmino's",
  meta: [
    { name: "description", content: "Gestion des restaurants." },
    { name: "robots", content: "noindex, nofollow" }
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

const restaurants = ref<ApiRestaurant[]>([]);
const loading = ref(true);
const loadError = ref<string | null>(null);
const showAddModal = ref(false);
const submitting = ref(false);

const form = reactive({
  name: "",
  image: "",
  address: "",
  postalCode: "",
  city: "",
  email: "",
  password: ""
});

async function loadRestaurants() {
  loading.value = true;
  loadError.value = null;
  try {
    const res = await request<Paginated<ApiRestaurant>>("/restaurants?limit=100");
    restaurants.value = res.data;
  } catch (e) {
    const err = e as ApiError;
    loadError.value = err?.detail ?? "Impossible de charger les restaurants.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadRestaurants();
});

function resetForm() {
  form.name = "";
  form.image = "";
  form.address = "";
  form.postalCode = "";
  form.city = "";
  form.email = "";
  form.password = "";
}

function closeModal() {
  showAddModal.value = false;
  resetForm();
}

async function submitCreate() {
  submitting.value = true;
  try {
    const body: Record<string, string> = {
      email: form.email.trim(),
      password: form.password,
      name: form.name.trim()
    };
    if (form.image.trim()) body.image = form.image.trim();
    if (form.address.trim()) body.address = form.address.trim();
    if (form.postalCode.trim()) body.postalCode = form.postalCode.trim();
    if (form.city.trim()) body.city = form.city.trim();

    await request("/restaurants", {
      method: "POST",
      body: JSON.stringify(body)
    });
    toast.success({
      title: "Restaurant créé",
      message: "Le compte restaurateur et la fiche ont été créés.",
      timeout: 3000
    });
    closeModal();
    await loadRestaurants();
  } catch (e) {
    const err = e as ApiError;
    toast.error({
      title: "Erreur",
      message: err?.detail ?? "Création impossible.",
      timeout: 4000
    });
  } finally {
    submitting.value = false;
  }
}
</script>
