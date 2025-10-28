export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  
  if (!userStore.isLoggedIn || !userStore.currentUser) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  
  if (userStore.currentUser.role !== 'RESTAURATEUR') {
    return navigateTo('/')
  }
})

