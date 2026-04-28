import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "../user";

describe("useUserStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.stubGlobal(
      "useRuntimeConfig",
      () => ({ public: { apiBase: "http://localhost:3001" } })
    );
    vi.stubGlobal("useApi", () => ({
      request: vi.fn().mockRejectedValue(new Error("not used in these tests")),
      getBase: () => "http://localhost:3001"
    }));
  });

  it("clearSession réinitialise l’état", () => {
    const store = useUserStore();
    store.setTokens("a", "b");
    store.$patch({
      currentUser: {
        id: "u1",
        name: "Test",
        email: "t@example.com",
        role: "CLIENT"
      },
      isLoggedIn: true
    });
    store.clearSession();
    expect(store.accessToken).toBeNull();
    expect(store.refreshToken).toBeNull();
    expect(store.currentUser).toBeNull();
    expect(store.isLoggedIn).toBe(false);
  });

  it("setDisplayName met à jour le nom si connecté", () => {
    const store = useUserStore();
    store.$patch({
      currentUser: {
        id: "u1",
        name: "Old",
        email: "t@example.com",
        role: "CLIENT"
      },
      isLoggedIn: true
    });
    store.setDisplayName("  New Name  ");
    expect(store.currentUser?.name).toBe("New Name");
  });

  it("setTokens enregistre les jetons", () => {
    const store = useUserStore();
    store.setTokens("access", "refresh");
    expect(store.accessToken).toBe("access");
    expect(store.refreshToken).toBe("refresh");
  });
});
