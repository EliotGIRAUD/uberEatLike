import { defineStore } from "pinia";

/** Plat (aligné API / plats). */
export interface Food {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  grosseDescription?: string;
  price: number;
  imageUrl?: string;
}

/** Store minimal conservé pour le code splitting ; les données viennent de l’API. */
export const useFoodStore = defineStore("food", {
  state: () => ({
    foods: [] as Food[]
  })
});
