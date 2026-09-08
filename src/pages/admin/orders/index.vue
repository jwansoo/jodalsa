<script setup lang="ts">
import { allOrdersQuery, updateOrderStatusQuery, type AllOrders } from '@/utils/supaQuerys'

usePageStore().pageData.title = '입금확인'

useMeta({
  title: '입금확인',
  meta: [
    {
      name: 'description',
      content: '이용상품구매 신청 내역 및 입금 확인',
    },
  ],
})

const orders = ref<AllOrders>([])
const processingId = ref<number | null>(null)

const load = async () => {
  const { data, error } = await allOrdersQuery
  if (error) useErrorStore().setError({ error })
  orders.value = data ?? []
}

await load()

const productLabel = (order: AllOrders[number]) => {
  if (order.product_type === 'annual') return '년간이용'
  const parts: string[] = []
  if (order.rounds_count) parts.push(`모의고사 ${order.rounds_count}회`)
  if (order.materials?.length) parts.push(order.materials.join('/'))
  return parts.join(' + ') || '-'
}

const statusLabel = (status: string) =>
  status === 'confirmed' ? '입금확인' : status === 'canceled' ? '취소' : '대기중'

const confirmOrder = async (id: number) => {
  processingId.value = id
  const { error } = await updateOrderStatusQuery(id, 'confirmed')
  processingId.value = null
  if (error) {
    useErrorStore().setError({ error })
    return
  }
  await load()
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <h1 class="text-2xl font-bold">입금확인</h1>

    <Table v-if="orders.length">
      <TableHeader>
        <TableRow>
          <TableHead>신청일시</TableHead>
          <TableHead>사용자</TableHead>
          <TableHead>상품</TableHead>
          <TableHead>금액</TableHead>
          <TableHead>입금자명</TableHead>
          <TableHead>상태</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="order in orders" :key="order.id">
          <TableCell class="whitespace-nowrap">
            {{ new Date(order.created_at).toLocaleString() }}
          </TableCell>
          <TableCell>{{ order.username }}</TableCell>
          <TableCell>{{ productLabel(order) }}</TableCell>
          <TableCell>{{ order.amount.toLocaleString() }}원</TableCell>
          <TableCell>{{ order.depositor_name }}</TableCell>
          <TableCell>{{ statusLabel(order.status) }}</TableCell>
          <TableCell>
            <Button
              v-if="order.status === 'pending_transfer'"
              size="sm"
              :disabled="processingId === order.id"
              @click="confirmOrder(order.id)"
            >
              입금확인 처리
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <p v-else class="text-muted-foreground">신청 내역이 없습니다.</p>
  </div>
</template>

<style scoped></style>
