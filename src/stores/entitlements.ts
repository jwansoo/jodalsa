import { addMonths, VALIDITY_MONTHS } from '@/utils/purchaseOptions'
import { ordersQuery } from '@/utils/supaQuerys'
import type { Tables } from 'database/types'

const isActive = (confirmedAt: string | null, months: number) => {
  if (!confirmedAt) return false
  return addMonths(new Date(confirmedAt), months).getTime() > Date.now()
}

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

  // 년간구독은 12개월 — 만료되면 회당/교재구독처럼 개별 항목으로 다시 걸러진다.
  const hasAnnual = computed(() =>
    confirmedOrders.value.some(
      (order) =>
        order.product_type === 'annual' && isActive(order.confirmed_at, VALIDITY_MONTHS.annual),
    ),
  )

  const allowedRounds = computed(() => {
    if (hasAnnual.value) return new Set(Array.from({ length: 10 }, (_, i) => i + 1))

    // 회당 사용은 3개월. 만료되지 않은 주문 중 가장 큰 rounds_count까지 누적 접근(1..N) 허용.
    const maxRound = confirmedOrders.value
      .filter(
        (order) =>
          order.product_type === 'select' && isActive(order.confirmed_at, VALIDITY_MONTHS.rounds),
      )
      .reduce((max, order) => Math.max(max, order.rounds_count ?? 0), 0)
    return new Set(Array.from({ length: maxRound }, (_, i) => i + 1))
  })

  const allowedMaterials = computed(() => {
    if (hasAnnual.value) return new Set(['필기', '핵심규정', '실기'])

    // 교재구독은 6개월.
    const materials = new Set<string>()
    confirmedOrders.value
      .filter((order) => isActive(order.confirmed_at, VALIDITY_MONTHS.materials))
      .forEach((order) => order.materials?.forEach((m) => materials.add(m)))
    return materials
  })

  return { confirmedOrders, loaded, load, hasAnnual, allowedRounds, allowedMaterials }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEntitlementsStore, import.meta.hot))
}
