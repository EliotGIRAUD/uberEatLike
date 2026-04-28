import { useRuntimeConfig } from "#imports";
import { useUserStore } from "~/stores/user";

export type ApiError = {
  status: number;
  detail: string;
  title?: string;
};

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

export function useApi() {
  const config = useRuntimeConfig();
  const userStore = useUserStore();

  function getBase(): string {
    return (config.public.apiBase as string) || "http://localhost:3001";
  }

  async function tryRefresh(): Promise<boolean> {
    const refreshToken = userStore.refreshToken;
    if (!refreshToken) return false;
    try {
      const res = await fetch(joinUrl(getBase(), "/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
      });
      if (!res.ok) return false;
      const data = (await res.json()) as { accessToken: string; refreshToken: string };
      userStore.setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  async function request<T>(path: string, init: RequestInit = {}, allowRetry = true): Promise<T> {
    const url = joinUrl(getBase(), path);
    const headers = new Headers(init.headers);
    if (init.body != null && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    const token = userStore.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(url, { ...init, headers });

    if (res.status === 401 && allowRetry && userStore.refreshToken) {
      const ok = await tryRefresh();
      if (ok) {
        return request<T>(path, init, false);
      }
      userStore.clearSession();
    }

    if (!res.ok) {
      let detail = res.statusText;
      let title: string | undefined;
      try {
        const j = (await res.json()) as { detail?: string; title?: string };
        if (typeof j.detail === "string") detail = j.detail;
        if (typeof j.title === "string") title = j.title;
      } catch {
        /* ignore */
      }
      const err: ApiError = { status: res.status, detail, title };
      throw err;
    }

    if (res.status === 204) {
      return undefined as T;
    }

    return res.json() as Promise<T>;
  }

  return { request, getBase };
}
