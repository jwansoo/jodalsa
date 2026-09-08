import { ordersQuery } from '@/utils/supaQuerys'
import type { Tables } from 'database/types'

export const useEntitlementsStore = defineStore('entitlements-store', () => {
  const confirmedOrders = ref<Tables<'orders'>[]>([])
  const loaded = ref(false)

  const load = async () => {
    const authStore = useAuthStore()
    if (!authStore.profile) {
      confirmedOrders.value = []
      loaded.value = true
      return
    }

    const { data } = await ordersQuery(authStore.profile.id)
    confirmedOrders.value = (data ?? []).filter((order) => order.status === 'confirmed')
    loaded.value = true
  }

  const hasAnnual = computed(() =>
    confirmedOrders.value.some((order) => order.product_type === 'annual'),
  )

  const allowedRounds = computed(() => {
    if (hasAnnual.value) return new Set(Array.from({ length: 10 }, (_, i) => i + 1))

    // Buying tier N ('N회') grants cumulative access to rounds 1..N, not just round N.
    const maxRound = confirmedOrders.value
      .filter((order) => order.product_type === 'select')
      .reduce((max, order) => Math.max(max, order.rounds_count ?? 0), 0)
    return new Set(Array.from({ length: maxRound }, (_, i) => i + 1))
  })

  const allowedMaterials = computed(() => {
    if (hasAnnual.value) return new Set(['필기', '핵심규정', '실기'])
    const materials = new Set<string>()
    confirmedOrders.value.forEach((order) => order.materials?.forEach((m) => materials.add(m)))
    return materials
  })

  return { confirmedOrders, loaded, load, hasAnnual, allowedRounds, allowedMaterials }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEntitlementsStore, import.meta.hot))
}
