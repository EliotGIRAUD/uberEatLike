export default defineNuxtPlugin(async () => {
  const user = useUserStore();
  if (import.meta.client && user.accessToken && !user.currentUser) {
    try {
      await user.hydrateFromMe();
    } catch {
      user.clearSession();
    }
  }
});
