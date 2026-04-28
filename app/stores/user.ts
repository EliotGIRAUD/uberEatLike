import { defineStore } from "pinia";

export type UserRole = "ADMIN" | "CLIENT" | "RESTAURATEUR";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** Identifiant du restaurant (API) lorsque le rôle est restaurateur */
  restaurateurId?: string;
}

interface UserState {
  accessToken: string | null;
  refreshToken: string | null;
  currentUser: AppUser | null;
  isLoggedIn: boolean;
}

function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] || email;
  if (!local) return email;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function mapRole(r: "USER" | "RESTAURANT" | "ADMIN"): UserRole {
  if (r === "USER") return "CLIENT";
  if (r === "RESTAURANT") return "RESTAURATEUR";
  return "ADMIN";
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    accessToken: null,
    refreshToken: null,
    currentUser: null,
    isLoggedIn: false
  }),
  actions: {
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    },
    clearSession() {
      this.accessToken = null;
      this.refreshToken = null;
      this.currentUser = null;
      this.isLoggedIn = false;
    },
    async hydrateFromMe(preferredDisplayName?: string) {
      const { request } = useApi();
      const me = await request<{ id: string; email: string; role: "USER" | "RESTAURANT" | "ADMIN" }>("/auth/me");
      const role = mapRole(me.role);
      let restaurateurId: string | undefined;
      if (me.role === "RESTAURANT") {
        const restaurant = await request<{
          id: string;
          name: string;
        }>("/restaurants/me");
        restaurateurId = restaurant.id;
      }
      const name =
        preferredDisplayName?.trim() ||
        this.currentUser?.name ||
        displayNameFromEmail(me.email);
      this.currentUser = {
        id: me.id,
        email: me.email,
        name,
        role,
        restaurateurId
      };
      this.isLoggedIn = true;
    },
    async login(payload: { email: string; password: string }) {
      const email = payload.email.trim();
      const password = payload.password.trim();
      const config = useRuntimeConfig();
      const base = (config.public.apiBase as string) || "http://localhost:3001";
      const res = await fetch(`${base.replace(/\/$/, "")}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        let detail = "Échec de la connexion";
        try {
          const j = (await res.json()) as { detail?: string };
          if (j.detail) detail = j.detail;
        } catch {
          /* ignore */
        }
        throw new Error(detail);
      }
      const data = (await res.json()) as { accessToken: string; refreshToken: string };
      this.setTokens(data.accessToken, data.refreshToken);
      await this.hydrateFromMe(displayNameFromEmail(email));
    },
    async registerAccount(name: string, email: string, password: string) {
      const config = useRuntimeConfig();
      const base = (config.public.apiBase as string) || "http://localhost:3001";
      const res = await fetch(`${base.replace(/\/$/, "")}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        let detail = "Inscription impossible";
        try {
          const j = (await res.json()) as { detail?: string };
          if (j.detail) detail = j.detail;
        } catch {
          /* ignore */
        }
        throw new Error(detail);
      }
      const data = (await res.json()) as { accessToken: string; refreshToken: string };
      this.setTokens(data.accessToken, data.refreshToken);
      await this.hydrateFromMe(name);
    },
    async logout() {
      if (this.accessToken) {
        try {
          const { request } = useApi();
          await request("/auth/logout", { method: "POST" });
        } catch {
          /* ignore */
        }
      }
      this.clearSession();
    },
    async updateProfileApi(payload: { email?: string; password?: string }) {
      const { request } = useApi();
      const body: Record<string, string> = {};
      if (payload.email) body.email = payload.email;
      if (payload.password) body.password = payload.password;
      if (Object.keys(body).length === 0) return;
      await request("/users/me", { method: "PATCH", body: JSON.stringify(body) });
      await this.hydrateFromMe(this.currentUser?.name);
      if (this.currentUser && payload.email) {
        this.currentUser.email = payload.email;
      }
    },
    /** Nom d’affichage local (l’API ne expose pas de champ « nom » pour les clients). */
    setDisplayName(name: string) {
      if (!this.currentUser) return;
      const n = name.trim();
      if (n) this.currentUser.name = n;
    }
  },
  persist: true
});
