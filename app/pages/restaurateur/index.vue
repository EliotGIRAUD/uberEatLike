<template>
  <div class="min-h-dvh p-6">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dashboard Restaurateur</h1>
            <p class="mt-2 text-sm text-gray-600">
              Bienvenue
              <span class="font-semibold text-[#3AF24B]">{{ restaurant?.name || "…" }}</span>
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              :class="activeTab === 'profile' ? 'bg-[#3AF24B] text-black' : 'bg-gray-200 text-gray-700'"
              class="rounded-lg px-4 py-2 font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-sm"
              @click="activeTab = 'profile'"
            >
              Mon restaurant
            </button>
            <button
              type="button"
              :class="activeTab === 'foods' ? 'bg-[#3AF24B] text-black' : 'bg-gray-200 text-gray-700'"
              class="rounded-lg px-4 py-2 font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-sm"
              @click="activeTab = 'foods'"
            >
              Mes plats
            </button>
            <button
              type="button"
              :class="activeTab === 'orders' ? 'bg-[#3AF24B] text-black' : 'bg-gray-200 text-gray-700'"
              class="rounded-lg px-4 py-2 font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-sm relative"
              @click="activeTab = 'orders'"
            >
              Commandes
              <span
                v-if="restaurantOrders.length > 0"
                class="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
              >
                {{ restaurantOrders.length }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="pageLoadError" class="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-4">
        {{ pageLoadError }}
        <button type="button" class="ml-3 underline font-semibold" @click="bootstrap">Réessayer</button>
      </div>

      <div v-if="activeTab === 'profile'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Informations du restaurant</h2>
        <p class="text-sm text-gray-500 mb-4">
          Les identifiants de connexion ne sont pas modifiables ici (contact administrateur).
        </p>
        <form @submit.prevent="updateRestaurantInfo" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nom du restaurant *</label>
            <input v-model="profileForm.name" type="text" required class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Image (URL)</label>
            <input v-model="profileForm.image" type="text" class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Adresse</label>
            <input v-model="profileForm.address" type="text" class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Code postal</label>
              <input v-model="profileForm.postalCode" type="text" class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Ville</label>
              <input v-model="profileForm.city" type="text" class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" />
            </div>
          </div>
          <button
            type="submit"
            class="w-full rounded-lg bg-black text-white py-3 font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-md disabled:opacity-50"
            :disabled="savingProfile"
          >
            {{ savingProfile ? "…" : "Enregistrer" }}
          </button>
        </form>
      </div>

      <div v-if="activeTab === 'foods'">
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 class="text-2xl font-bold text-gray-900">Mes plats ({{ dishes.length }})</h2>
            <button
              type="button"
              class="rounded-lg bg-[#3AF24B] text-black px-6 py-3 font-semibold hover:bg-black hover:text-white transition shadow-md"
              @click="openAddFood"
            >
              + Ajouter un plat
            </button>
          </div>

          <div v-if="dishes.length === 0" class="p-12 text-center text-gray-500">Aucun plat</div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="food in dishes" :key="food.id" class="border-2 border-gray-200 rounded-xl p-4 hover:border-[#3AF24B] transition">
              <div class="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img v-if="food.imageUrl" :src="food.imageUrl" :alt="food.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-sm">Pas d'image</div>
              </div>
              <h3 class="font-bold text-lg text-gray-900">{{ food.name }}</h3>
              <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ food.description }}</p>
              <p class="text-xl font-bold text-[#3AF24B] mt-3">{{ food.price.toFixed(2) }} €</p>
              <div class="flex gap-2 mt-4">
                <button type="button" class="flex-1 rounded-lg border-2 border-gray-200 py-2 text-sm font-semibold hover:border-blue-500" @click="editFood(food)">Modifier</button>
                <button type="button" class="flex-1 rounded-lg border-2 border-red-200 text-red-600 py-2 text-sm font-semibold hover:bg-red-600 hover:text-white" @click="confirmDeleteFood(food)">Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'orders'" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-900">Commandes ({{ restaurantOrders.length }})</h2>
          <button type="button" class="text-sm font-semibold text-[#3AF24B] hover:underline" @click="refreshOrders">Rafraîchir</button>
        </div>
        <div v-if="restaurantOrders.length === 0" class="p-12 text-center text-gray-500">Aucune commande</div>
        <div v-else class="divide-y divide-gray-200">
          <div v-for="order in restaurantOrders" :key="order.id" class="p-6 hover:bg-gray-50 transition">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <p class="text-sm text-gray-500">Commande #{{ order.id }}</p>
                <p class="text-sm text-gray-600 font-mono">Client : {{ order.userId }}</p>
                <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-[#3AF24B]">{{ order.totalPrice.toFixed(2) }} €</p>
                <span :class="statusBadgeClass(order.status)" class="inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2">
                  {{ statusLabel(order.status) }}
                </span>
              </div>
            </div>
            <div class="space-y-2 mb-4">
              <p class="font-semibold text-sm text-gray-700">Articles</p>
              <div v-for="item in order.items" :key="item.id" class="flex justify-between text-sm">
                <span class="text-gray-600">{{ item.name }} × {{ item.quantity }}</span>
                <span class="text-gray-900 font-medium">{{ (item.price * item.quantity).toFixed(2) }} €</span>
              </div>
            </div>
            <div v-if="nextApiStatus(order.status)" class="flex flex-wrap gap-2">
              <button type="button" class="flex-1 min-w-[140px] rounded-lg bg-black text-white py-2 text-sm font-semibold hover:bg-[#3AF24B] hover:text-black" @click="advanceOrder(order)">
                {{ nextActionLabel(order.status) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showFoodModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="closeFoodModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">{{ editingDish ? "Modifier le plat" : "Nouveau plat" }}</h2>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Nom *</label>
          <input v-model="foodForm.name" required type="text" class="w-full rounded-lg border-2 border-gray-200 px-4 py-3" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea v-model="foodForm.description" rows="3" class="w-full rounded-lg border-2 border-gray-200 px-4 py-3" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Prix (€) *</label>
          <input v-model.number="foodForm.price" type="number" step="0.01" min="0.01" required class="w-full rounded-lg border-2 border-gray-200 px-4 py-3" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Image (URL)</label>
          <input v-model="foodForm.image" type="text" class="w-full rounded-lg border-2 border-gray-200 px-4 py-3" placeholder="https://…" />
        </div>
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            class="flex-1 rounded-lg bg-black text-white py-3 font-semibold disabled:opacity-50"
            :disabled="savingDish"
            @click="submitFood"
          >
            {{ savingDish ? "…" : "Enregistrer" }}
          </button>
          <button type="button" class="rounded-lg border-2 px-4" @click="closeFoodModal">Annuler</button>
        </div>
      </div>
    </div>

    <div
      v-if="deleteDishTarget"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="deleteDishTarget = null"
    >
      <div class="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
        <p class="text-gray-800">Supprimer <strong>{{ deleteDishTarget.name }}</strong> ?</p>
        <div class="flex gap-3">
          <button type="button" class="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold" @click="deleteDishConfirmed">Supprimer</button>
          <button type="button" class="flex-1 border-2 py-2 rounded-lg" @click="deleteDishTarget = null">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useUserStore } from "../../stores/user";
import { useOrderStore, type Order, type UiOrderStatus } from "../../stores/order";
import type { ApiError } from "~/composables/useApi";

definePageMeta({
  middleware: ["restaurateur"]
});

const userStore = useUserStore();
const orderStore = useOrderStore();
const { request, getBase } = useApi();
const toast = useToast();

useHead({
  title: "Dashboard Restaurateur - Grosmino's",
  meta: [
    { name: "description", content: "Gérez votre restaurant et vos plats." },
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

type DishCard = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
};

const activeTab = ref<"profile" | "foods" | "orders">("profile");
const restaurant = ref<ApiRestaurant | null>(null);
const dishes = ref<DishCard[]>([]);
const pageLoadError = ref<string | null>(null);
const savingProfile = ref(false);

const profileForm = reactive({
  name: "",
  image: "",
  address: "",
  postalCode: "",
  city: ""
});

function absoluteUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  const base = getBase().replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

function mapDish(d: ApiDish): DishCard {
  return {
    id: d.id,
    name: d.name,
    description: d.description ?? "",
    price: d.price,
    imageUrl: absoluteUrl(d.image)
  };
}

function syncProfileForm() {
  const r = restaurant.value;
  if (!r) return;
  profileForm.name = r.name;
  profileForm.image = r.image ?? "";
  profileForm.address = r.address ?? "";
  profileForm.postalCode = r.postalCode ?? "";
  profileForm.city = r.city ?? "";
}

async function loadRestaurant() {
  const r = await request<ApiRestaurant>("/restaurants/me");
  restaurant.value = r;
  syncProfileForm();
}

async function loadDishes() {
  const id = restaurant.value?.id ?? userStore.currentUser?.restaurateurId;
  if (!id) return;
  const raw = await request<Paginated<ApiDish>>(`/restaurants/${id}/dishes?limit=100`);
  dishes.value = raw.data.map(mapDish);
}

async function bootstrap() {
  pageLoadError.value = null;
  try {
    await loadRestaurant();
    await loadDishes();
    await orderStore.fetchRestaurantOrders();
  } catch (e) {
    const err = e as ApiError;
    pageLoadError.value = err?.detail ?? "Chargement impossible.";
  }
}

onMounted(() => {
  void bootstrap();
});

const restaurantOrders = computed(() => {
  const rid = restaurant.value?.id ?? userStore.currentUser?.restaurateurId;
  if (!rid) return [];
  return orderStore.orders.filter((o) => o.restaurantId === rid);
});

async function updateRestaurantInfo() {
  savingProfile.value = true;
  try {
    const body: Record<string, string> = { name: profileForm.name.trim() };
    if (profileForm.image.trim()) body.image = profileForm.image.trim();
    if (profileForm.address.trim()) body.address = profileForm.address.trim();
    if (profileForm.postalCode.trim()) body.postalCode = profileForm.postalCode.trim();
    if (profileForm.city.trim()) body.city = profileForm.city.trim();
    const updated = await request<ApiRestaurant>("/restaurants/me", {
      method: "PATCH",
      body: JSON.stringify(body)
    });
    restaurant.value = updated;
    syncProfileForm();
    userStore.setDisplayName(updated.name);
    toast.success({ title: "Enregistré", message: "Restaurant mis à jour.", timeout: 2500 });
  } catch (e) {
    const err = e as ApiError;
    toast.error({ title: "Erreur", message: err?.detail ?? "Mise à jour impossible.", timeout: 3500 });
  } finally {
    savingProfile.value = false;
  }
}

const showFoodModal = ref(false);
const editingDish = ref<DishCard | null>(null);
const savingDish = ref(false);
const deleteDishTarget = ref<DishCard | null>(null);

const foodForm = reactive({
  name: "",
  description: "",
  price: 0,
  image: ""
});

function openAddFood() {
  editingDish.value = null;
  foodForm.name = "";
  foodForm.description = "";
  foodForm.price = 0;
  foodForm.image = "";
  showFoodModal.value = true;
}

function editFood(f: DishCard) {
  editingDish.value = f;
  foodForm.name = f.name;
  foodForm.description = f.description;
  foodForm.price = f.price;
  foodForm.image = f.imageUrl?.startsWith("http") ? f.imageUrl : "";
  showFoodModal.value = true;
}

function closeFoodModal() {
  showFoodModal.value = false;
  editingDish.value = null;
}

async function submitFood() {
  const rid = restaurant.value?.id;
  if (!rid) return;
  savingDish.value = true;
  try {
    const payload: { name: string; description?: string; price: number; image?: string } = {
      name: foodForm.name.trim(),
      price: foodForm.price
    };
    const desc = foodForm.description.trim();
    if (desc) payload.description = desc;
    if (foodForm.image.trim()) payload.image = foodForm.image.trim();

    if (editingDish.value) {
      await request(`/dishes/${editingDish.value.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
    } else {
      await request(`/restaurants/${rid}/dishes`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }
    await loadDishes();
    toast.success({ title: "OK", message: editingDish.value ? "Plat mis à jour." : "Plat créé.", timeout: 2000 });
    closeFoodModal();
  } catch (e) {
    const err = e as ApiError;
    toast.error({ title: "Erreur", message: err?.detail ?? "Sauvegarde impossible.", timeout: 3500 });
  } finally {
    savingDish.value = false;
  }
}

function confirmDeleteFood(f: DishCard) {
  deleteDishTarget.value = f;
}

async function deleteDishConfirmed() {
  const t = deleteDishTarget.value;
  if (!t) return;
  try {
    await request(`/dishes/${t.id}`, { method: "DELETE" });
    deleteDishTarget.value = null;
    await loadDishes();
    toast.success({ title: "Supprimé", message: "Le plat a été retiré.", timeout: 2000 });
  } catch (e) {
    const err = e as ApiError;
    toast.error({ title: "Erreur", message: err?.detail ?? "Suppression impossible.", timeout: 3500 });
  }
}

async function refreshOrders() {
  try {
    await orderStore.fetchRestaurantOrders();
  } catch (e) {
    const err = e as ApiError;
    toast.error({ title: "Erreur", message: err?.detail ?? "Rafraîchissement impossible.", timeout: 3000 });
  }
}

function statusLabel(s: UiOrderStatus): string {
  const m: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmée",
    preparing: "En préparation",
    ready: "Prête",
    delivered: "Livrée",
    cancelled: "Annulée"
  };
  return m[s] ?? s;
}

function statusBadgeClass(s: UiOrderStatus): string {
  const cl: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-orange-100 text-orange-800",
    ready: "bg-lime-100 text-lime-900",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  };
  return cl[s] ?? "bg-gray-100 text-gray-800";
}

function nextApiStatus(s: UiOrderStatus): "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | null {
  if (s === "pending") return "CONFIRMED";
  if (s === "confirmed") return "PREPARING";
  if (s === "preparing") return "READY";
  if (s === "ready") return "DELIVERED";
  return null;
}

function nextActionLabel(s: UiOrderStatus): string {
  if (s === "pending") return "Confirmer";
  if (s === "confirmed") return "En préparation";
  if (s === "preparing") return "Marquer prête";
  if (s === "ready") return "Marquer livrée";
  return "";
}

async function advanceOrder(order: Order) {
  const next = nextApiStatus(order.status);
  if (!next) return;
  try {
    await orderStore.updateOrderStatusApi(order.id, next);
    toast.success({ title: "Statut", message: `Commande ${order.id} — ${nextActionLabel(order.status)}`, timeout: 2500 });
  } catch (e) {
    const err = e as ApiError;
    toast.error({ title: "Erreur", message: err?.detail ?? "Mise à jour impossible.", timeout: 3500 });
  }
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(dateString));
}
</script>
