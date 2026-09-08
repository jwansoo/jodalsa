<script setup lang="ts">
import { ordersQuery, type Orders } from '@/utils/supaQuerys'

usePageStore().pageData.title = '구매내역'

useMeta({
  title: '구매내역',
  meta: [
    {
      name: 'description',
      content: '나의 이용상품구매 신청 내역',
    },
  ],
})

const { profile } = storeToRefs(useAuthStore())
const orders = ref<Orders>([])

const load = async () => {
  if (!profile.value) return
  const { data, error } = await ordersQuery(profile.value.id)
  if (error) useErrorStore().setError({ error })
  orders.value = data ?? []
}

await load()

const productLabel = (order: Orders[number]) => {
  if (order.product_type === 'annual') return '년간이용'
  const parts: string[] = []
  if (order.rounds_count) parts.push(`모의고사 1~${order.rounds_count}회`)
  if (order.materials?.length) parts.push(order.materials.join('/'))
  return parts.join(' + ') || '-'
}

const statusLabel = (status: string) =>
  status === 'confirmed' ? '이용가능' : status === 'canceled' ? '취소됨' : '입금대기'
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <h1 class="text-2xl font-bold">구매내역</h1>

    <Table v-if="orders.length">
      <TableHeader>
        <TableRow>
          <TableHead>신청일시</TableHead>
          <TableHead>상품</TableHead>
          <TableHead>금액</TableHead>
          <TableHead>상태</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="order in orders" :key="order.id">
          <TableCell class="whitespace-nowrap">
            {{ new Date(order.created_at).toLocaleString() }}
          </TableCell>
          <TableCell>{{ productLabel(order) }}</TableCell>
          <TableCell>{{ order.amount.toLocaleString() }}원</TableCell>
          <TableCell>{{ statusLabel(order.status) }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <p v-else class="text-muted-foreground">
      구매 내역이 없습니다.
      <RouterLink :to="{ name: '/purchase/' }" class="text-primary underline">
        이용상품구매
      </RouterLink>
      에서 상품을 구매해보세요.
    </p>

    <BackHomeLink />
  </div>
</template>

<style scoped></style>
