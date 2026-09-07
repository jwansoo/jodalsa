import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, _from) => {
  const authStore = useAuthStore()
  await authStore.getSession()
  const isAuthPage = ['/login', '/register'].includes(to.path)
  const isPublicPage = to.path === '/' || isAuthPage
  if (!isPublicPage && !authStore.user) {
    return {
      name: '/login',
    }
  }
  if (authStore.user && isAuthPage) {
    return {
      name: '/',
    }
  }
  if (to.path.startsWith('/admin') && !authStore.profile?.is_admin) {
    return {
      name: '/',
    }
  }
})

export default router
