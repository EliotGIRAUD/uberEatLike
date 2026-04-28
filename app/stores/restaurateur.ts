import { defineStore } from "pinia";

/** Conservé pour compatibilité ; les données restaurateur viennent de l’API. */
export const useRestaurateurStore = defineStore("restaurateur", {
  state: () => ({
    restaurateurs: [] as Array<{ id: string; nom: string; email: string }>
  })
});
