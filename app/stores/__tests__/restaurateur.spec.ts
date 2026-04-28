import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useRestaurateurStore } from "../restaurateur";

describe("useRestaurateurStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("expose une liste vide par défaut (données via API)", () => {
    const store = useRestaurateurStore();
    expect(store.restaurateurs).toEqual([]);
  });
});
