<template>
  <div class="min-h-[calc(100vh-8rem)] p-4 sm:p-6 bg-[#F0FFF0]">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 sm:mb-3">
          {{ t('cart.title', { highlight: t('cart.highlight') }) }}
        </h1>
        <p class="text-base sm:text-lg text-gray-600">{{ t('cart.subtitle') }}</p>
      </div>
      
      <div v-if="cart.items.length === 0" class="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
        <p class="text-gray-900 text-xl sm:text-2xl font-bold mb-2">{{ t('cart.empty') }}</p>
        <NuxtLink 
          to="/restaurants" 
          class="inline-block rounded-xl bg-gradient-to-r from-[#3AF24B] to-emerald-400 text-black px-8 py-4 font-bold hover:from-black hover:to-gray-800 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg"
        >
          {{ t('cart.discover') }}
        </NuxtLink>
      </div>
      
      <div v-else class="space-y-4">
        <div v-for="item in cart.items" :key="item.id" class="bg-white rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div class="flex items-start gap-3 sm:gap-4">
            <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-xl flex-shrink-0 shadow-md" />
            <div v-else class="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-[#3AF24B] to-emerald-400 rounded-xl flex-shrink-0 shadow-md flex items-center justify-center text-white text-xl font-bold">
              Plat
            </div>
            
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-base sm:text-xl text-gray-900 truncate mb-1">{{ item.name }}</h3>
              <p class="text-[#3AF24B] font-extrabold text-lg sm:text-xl">{{ item.price.toFixed(2) }} €</p>
              
              <div class="flex items-center justify-between mt-3 sm:hidden">
                <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1.5">
                  <button @click="cart.updateQuantity(item.id, item.quantity - 1)" class="w-9 h-9 rounded-lg bg-white hover:bg-[#3AF24B] hover:text-black flex items-center justify-center font-bold transition-all text-sm shadow-sm">−</button>
                  <span class="w-9 text-center font-bold text-sm">{{ item.quantity }}</span>
                  <button @click="cart.updateQuantity(item.id, item.quantity + 1)" class="w-9 h-9 rounded-lg bg-white hover:bg-[#3AF24B] hover:text-black flex items-center justify-center font-bold transition-all text-sm shadow-sm">+</button>
                </div>
                <button @click="removeItemWithNotif(item.id)" class="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold transition-all shadow-sm">✕</button>
              </div>
            </div>
            
            <div class="hidden sm:flex items-center gap-3">
              <div class="flex items-center gap-3 bg-gray-100 rounded-xl p-2">
                <button @click="cart.updateQuantity(item.id, item.quantity - 1)" class="w-10 h-10 rounded-lg bg-white hover:bg-[#3AF24B] hover:text-black flex items-center justify-center font-bold transition-all shadow-sm">−</button>
                <span class="w-12 text-center font-bold text-lg">{{ item.quantity }}</span>
                <button @click="cart.updateQuantity(item.id, item.quantity + 1)" class="w-10 h-10 rounded-lg bg-white hover:bg-[#3AF24B] hover:text-black flex items-center justify-center font-bold transition-all shadow-sm">+</button>
              </div>
              <button @click="removeItemWithNotif(item.id)" class="w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold transition-all shadow-sm">✕</button>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-6">
            <div>
              <p class="text-gray-600 text-sm sm:text-base mb-1">{{ t('cart.total') }}</p>
              <p class="text-3xl sm:text-4xl font-extrabold text-gray-900">{{ cart.totalPrice.toFixed(2) }} €</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
              <button 
                @click="clearCartWithConfirm" 
                class="rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {{ t('cart.clear') }}
              </button>
              <button
                type="button"
                :disabled="ordering"
                @click="placeOrder"
                class="rounded-xl bg-gradient-to-r from-[#3AF24B] to-emerald-400 text-black px-8 py-4 font-bold hover:from-black hover:to-gray-800 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-60 disabled:pointer-events-none"
              >
                {{ ordering ? "…" : t("cart.order") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCartStore } from "../stores/cart";
import { useUserStore } from "~/stores/user";
import { useOrderStore } from "../stores/order";
import type { ApiError } from "~/composables/useApi";

definePageMeta({
  middleware: ['client']
})

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()
const cart = useCartStore()
const orderStore = useOrderStore();
const toast = useToast();
const ordering = ref(false);

useHead({
  title: t('seo.cart.title'),
  meta: [
    { name: 'description', content: t('seo.cart.description') },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

function clearCartWithConfirm() {
  cart.clearCart()
  toast.warning({
    title: t('cart.cleared'),
    message: t('cart.clearedMessage'),
    timeout: 2000,
  })
}

function removeItemWithNotif(id: string) {
  cart.removeItem(id);
  toast.info({
    title: t('cart.itemRemoved'),
    message: t('cart.itemRemovedMessage'),
    timeout: 2000,
  })
}

async function placeOrder() {
  if (!userStore.currentUser?.email) {
    toast.error({
      title: t("cart.error"),
      message: t("cart.loginRequired"),
      timeout: 3000
    });
    return;
  }

  if (userStore.currentUser.role !== "CLIENT") {
    toast.error({
      title: t("cart.error"),
      message: t("cart.clientOnlyOrder"),
      timeout: 3000
    });
    return;
  }

  if (cart.items.length === 0) {
    toast.warning({
      title: t("cart.emptyWarning"),
      message: t("cart.emptyWarningMessage"),
      timeout: 2000
    });
    return;
  }

  const first = cart.items[0];
  if (!first) return;
  const restaurantId = first.restaurantId;
  const byDish = new Map<string, number>();
  for (const line of cart.items) {
    if (line.restaurantId !== restaurantId) {
      toast.error({
        title: t("cart.error"),
        message: t("cart.mixedRestaurantError"),
        timeout: 3500
      });
      return;
    }
    byDish.set(line.id, (byDish.get(line.id) ?? 0) + line.quantity);
  }
  const items = [...byDish.entries()].map(([dishId, quantity]) => ({ dishId, quantity }));

  ordering.value = true;
  try {
    const orderId = await orderStore.createOrderApi(restaurantId, items);
    cart.clearCart();
    toast.success({
      title: t("cart.orderSuccess"),
      message: t("cart.orderSuccessMessage", { id: orderId }),
      timeout: 3000
    });
    await router.push("/orders");
  } catch (e) {
    const err = e as ApiError;
    toast.error({
      title: t("cart.error"),
      message: err?.detail ?? t("cart.orderFailed"),
      timeout: 4000
    });
  } finally {
    ordering.value = false;
  }
}
</script>

