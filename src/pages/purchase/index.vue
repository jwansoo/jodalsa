<script setup lang="ts">
import {
  annualSubscriptionAmount,
  bankAccount,
  materialOptions,
  roundPrices,
} from '@/utils/purchaseOptions'
import { createOrderQuery } from '@/utils/supaQuerys'

usePageStore().pageData.title = '이용상품구매'

useMeta({
  title: '이용상품구매',
  meta: [
    {
      name: 'description',
      content: '모의고사 회당 구매, 수험교재 구독, 년간구독 상품 안내',
    },
  ],
})

const { profile } = storeToRefs(useAuthStore())

type ProductType = 'select' | 'annual'
const productTypes: { key: ProductType; title: string }[] = [
  { key: 'select', title: '선택이용' },
  { key: 'annual', title: '년간이용' },
]
const productType = ref<ProductType>('select')

const selectedRoundCount = ref<number | null>(null)
const selectedMaterials = ref<string[]>([])
const depositorName = ref('')
const isSubmitting = ref(false)
const submitError = ref('')
const submitted = ref(false)

const toggleRoundCount = (count: number) => {
  selectedRoundCount.value = selectedRoundCount.value === count ? null : count
}

const toggleMaterial = (key: string) => {
  const index = selectedMaterials.value.indexOf(key)
  if (index === -1) selectedMaterials.value.push(key)
  else selectedMaterials.value.splice(index, 1)
}

const totalAmount = computed(() => {
  if (productType.value === 'annual') return annualSubscriptionAmount

  const roundAmount = roundPrices.find((r) => r.count === selectedRoundCount.value)?.amount ?? 0
  const materialsAmount = materialOptions
    .filter((m) => selectedMaterials.value.includes(m.key))
    .reduce((sum, m) => sum + m.amount, 0)
  return roundAmount + materialsAmount
})

const canSubmit = computed(() => totalAmount.value > 0 && !!depositorName.value.trim())

const submitOrder = async () => {
  if (!profile.value || !canSubmit.value) return

  isSubmitting.value = true
  submitError.value = ''

  const { error } = await createOrderQuery({
    user_id: profile.value.id,
    username: profile.value.username,
    product_type: productType.value,
    rounds_count: productType.value === 'select' ? selectedRoundCount.value : null,
    materials:
      productType.value === 'select' && selectedMaterials.value.length
        ? selectedMaterials.value
        : null,
    amount: totalAmount.value,
    depositor_name: depositorName.value.trim(),
  })

  isSubmitting.value = false
  if (error) {
    submitError.value = '신청 접수에 실패했습니다. 잠시 후 다시 시도해주세요.'
    return
  }
  submitted.value = true
}

const resetForm = () => {
  submitted.value = false
  selectedRoundCount.value = null
  selectedMaterials.value = []
  depositorName.value = ''
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
    <div>
      <h1 class="text-2xl font-bold">이용상품구매</h1>
      <p class="text-sm text-muted-foreground">
        회당 사용은 3개월, 교재구독은 6개월, 년간구독은 12개월(모의고사·수험교재 모두) 이용하실 수
        있습니다.
      </p>
    </div>

    <div
      class="flex flex-col gap-4 rounded-xl border bg-muted/20 p-5"
      :class="{ 'items-start': submitted }"
    >
      <template v-if="submitted">
        <h2 class="text-lg font-bold">신청이 접수되었습니다</h2>
        <p class="text-sm text-muted-foreground">
          아래 계좌로
          <strong class="text-foreground">{{ totalAmount.toLocaleString() }}원</strong>을
          입금해주시면 입금자명 확인 후 이용 가능하도록 처리해드립니다.
        </p>
        <div
          class="flex flex-col gap-1 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm"
        >
          <p>
            <span class="text-muted-foreground">은행</span>
            <span class="ml-2 font-bold">{{ bankAccount.bank }}</span>
          </p>
          <p>
            <span class="text-muted-foreground">계좌번호</span>
            <span class="ml-2 font-mono font-bold">{{ bankAccount.number }}</span>
            <span class="ml-2 font-bold">{{ bankAccount.holder }}</span>
          </p>
        </div>
        <p class="text-sm text-muted-foreground">
          입금 후 홈 화면 우측 하단 채팅창에 <strong class="text-foreground">'입금했다'</strong>라고
          남겨주시면 확인 후 바로 상품이용이 가능합니다.
        </p>
        <Button variant="outline" @click="resetForm">다른 상품 신청하기</Button>
      </template>

      <template v-else>
        <div class="flex gap-2">
          <Button
            v-for="type in productTypes"
            :key="type.key"
            :variant="productType === type.key ? 'default' : 'outline'"
            @click="productType = type.key"
          >
            {{ type.title }}
          </Button>
        </div>

        <div v-if="productType === 'select'" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <p class="text-xs text-muted-foreground">
              모의고사 회차 수 (1회당 2만원, 선택 안 해도 됩니다)
            </p>
            <div class="grid grid-cols-5 gap-1.5">
              <Button
                v-for="round in roundPrices"
                :key="round.count"
                :variant="selectedRoundCount === round.count ? 'default' : 'outline'"
                size="sm"
                class="flex h-auto flex-col py-1.5"
                @click="toggleRoundCount(round.count)"
              >
                <span>{{ round.count }}회</span>
                <span class="text-[10px] opacity-80">{{ round.amount.toLocaleString() }}원</span>
              </Button>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <p class="text-xs text-muted-foreground">교재구독 (복수 선택 가능)</p>
            <div class="flex flex-col gap-1.5">
              <Button
                v-for="material in materialOptions"
                :key="material.key"
                :variant="selectedMaterials.includes(material.key) ? 'default' : 'outline'"
                size="sm"
                class="justify-between"
                @click="toggleMaterial(material.key)"
              >
                <span>{{ material.title }}</span>
                <span>{{ material.amount.toLocaleString() }}원</span>
              </Button>
            </div>
          </div>
        </div>

        <div v-else class="rounded-lg border bg-background p-3">
          <p class="font-bold">년간이용</p>
          <p class="text-xs text-muted-foreground">
            모의고사 전 회차와 수험교재(필기·핵심규정·실기)를 12개월간 모두 이용할 수 있습니다.
          </p>
          <p class="mt-1 text-lg font-bold">{{ annualSubscriptionAmount.toLocaleString() }}원</p>
        </div>

        <Separator />

        <div class="flex items-center justify-between">
          <span class="font-bold">결제 금액</span>
          <span class="text-xl font-bold">{{ totalAmount.toLocaleString() }}원</span>
        </div>

        <Separator />

        <div class="flex flex-col gap-3">
          <p class="text-xs text-muted-foreground">
            카드 결제(PG)는 현재 신청 완료되어 심사 중이며, 약 5일 후부터 이용하실 수 있습니다. 그
            전까지는 아래 계좌로 계좌이체 부탁드립니다. 입금 확인 후 이용 가능하도록 처리해드립니다.
          </p>
          <div
            class="flex flex-col gap-1 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm"
          >
            <p>
              <span class="text-muted-foreground">은행</span>
              <span class="ml-2 font-bold">{{ bankAccount.bank }}</span>
            </p>
            <p>
              <span class="text-muted-foreground">계좌번호</span>
              <span class="ml-2 font-mono font-bold">{{ bankAccount.number }}</span>
              <span class="ml-2 font-bold">{{ bankAccount.holder }}</span>
            </p>
          </div>

          <div class="grid gap-1.5">
            <Label class="text-sm">입금자명</Label>
            <Input v-model="depositorName" placeholder="입금하실 분의 성함을 입력하세요" required />
          </div>

          <ul class="text-sm text-left text-red-500" v-if="submitError">
            <li class="list-disc">{{ submitError }}</li>
          </ul>

          <Button :disabled="!canSubmit || isSubmitting" @click="submitOrder">
            {{ isSubmitting ? '처리 중...' : '신청하기' }}
          </Button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
