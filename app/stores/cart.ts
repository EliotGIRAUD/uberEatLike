import { defineStore } from "pinia";

export interface CartItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore("cart", {
  state: (): CartState => ({
    items: []
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },
  actions: {
    addItem(food: {
      id: string;
      restaurantId: string;
      name: string;
      description: string;
      price: number;
      imageUrl?: string;
    }) {
      const existing = this.items.find((item) => item.id === food.id);
      const cartRestaurant = this.items[0]?.restaurantId;
      if (this.items.length > 0 && cartRestaurant && cartRestaurant !== food.restaurantId) {
        return {
          success: false as const,
          message: "Votre panier contient déjà des articles d’un autre restaurant."
        };
      }
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...food, quantity: 1 });
      }
      return { success: true as const };
    },
    removeItem(id: string) {
      const index = this.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },
    updateQuantity(id: string, quantity: number) {
      const item = this.items.find((item) => item.id === id);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(id);
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart() {
      this.items = [];
    }
  },
  persist: true
});
