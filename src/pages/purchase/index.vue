<script setup lang="ts">
import * as PortOne from '@portone/browser-sdk/v2'
import {
  annualSubscriptionAmount,
  bankAccount,
  DISCOUNT_TIERS,
  materialOptions,
  roundPrices,
  type DiscountTierKey,
} from '@/utils/purchaseOptions'
import { createOrderQuery, updateProfileQuery } from '@/utils/supaQuerys'

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

const { profile, user } = storeToRefs(useAuthStore())

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
const discountTier = ref<DiscountTierKey>('new')
const workplaceName = ref('')

const toggleRoundCount = (count: number) => {
  selectedRoundCount.value = selectedRoundCount.value === count ? null : count
}

const toggleMaterial = (material: (typeof materialOptions)[number]) => {
  if (material.disabled) return
  const index = selectedMaterials.value.indexOf(material.key)
  if (index === -1) selectedMaterials.value.push(material.key)
  else selectedMaterials.value.splice(index, 1)
}

const selectedTier = computed(
  () => DISCOUNT_TIERS.find((tier) => tier.key === discountTier.value) ?? DISCOUNT_TIERS[0],
)

const totalAmount = computed(() => {
  if (productType.value === 'annual') return annualSubscriptionAmount

  const roundAmount = roundPrices.find((r) => r.count === selectedRoundCount.value)?.amount ?? 0
  const materialsAmount = materialOptions
    .filter((m) => selectedMaterials.value.includes(m.key))
    .reduce((sum, m) => sum + m.amount, 0)
  return roundAmount + materialsAmount
})

const discountedAmount = computed(() =>
  Math.round(totalAmount.value * (1 - selectedTier.value.rate)),
)

const canSubmit = computed(
  () =>
    totalAmount.value > 0 &&
    !!depositorName.value.trim() &&
    (discountTier.value !== 'group' || !!workplaceName.value.trim()),
)

// 단체가입은 profiles.workplace_name에 저장해두고 관리자가 입금확인 시 함께 확인한다.
const saveWorkplaceNameIfNeeded = async () => {
  if (discountTier.value !== 'group' || !profile.value) return true
  const { error } = await updateProfileQuery(profile.value.id, {
    workplace_name: workplaceName.value.trim(),
  })
  return !error
}

const submitOrder = async () => {
  if (!profile.value || !canSubmit.value) return

  isSubmitting.value = true
  submitError.value = ''

  if (!(await saveWorkplaceNameIfNeeded())) {
    isSubmitting.value = false
    submitError.value = '직장명 저장에 실패했습니다. 잠시 후 다시 시도해주세요.'
    return
  }

  const { error } = await createOrderQuery({
    user_id: profile.value.id,
    username: profile.value.username,
    product_type: productType.value,
    rounds_count: productType.value === 'select' ? selectedRoundCount.value : null,
    materials:
      productType.value === 'select' && selectedMaterials.value.length
        ? selectedMaterials.value
        : null,
    amount: discountedAmount.value,
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
  discountTier.value = 'new'
  workplaceName.value = ''
}

const orderName = computed(() => {
  if (productType.value === 'annual') return '년간이용'
  const parts: string[] = []
  if (selectedRoundCount.value) parts.push(`모의고사 ${selectedRoundCount.value}회`)
  parts.push(...selectedMaterials.value)
  return parts.join(' + ') || '이용상품구매'
})

const cardPaySubmitting = ref(false)
const cardPayError = ref('')
const cardPaySuccess = ref(false)

const payWithCard = async () => {
  if (!profile.value || totalAmount.value <= 0) return
  if (discountTier.value === 'group' && !workplaceName.value.trim()) {
    cardPayError.value = '단체가입은 직장명을 입력해주세요.'
    return
  }

  cardPaySubmitting.value = true
  cardPayError.value = ''
  cardPaySuccess.value = false

  if (!(await saveWorkplaceNameIfNeeded())) {
    cardPaySubmitting.value = false
    cardPayError.value = '직장명 저장에 실패했습니다. 잠시 후 다시 시도해주세요.'
    return
  }

  try {
    const response = await PortOne.requestPayment({
      storeId: import.meta.env.VITE_PORTONE_STORE_ID,
      channelKey: import.meta.env.VITE_PORTONE_CHANNEL_KEY,
      paymentId: `jodal-${crypto.randomUUID().replace(/-/g, '')}`,
      orderName: orderName.value,
      totalAmount: discountedAmount.value,
      currency: 'KRW',
      payMethod: 'CARD',
      customer: {
        fullName: profile.value.full_name,
        email: user.value?.email,
        phoneNumber: profile.value.phone ?? undefined,
      },
    })

    if (!response || response.code) {
      cardPayError.value = response?.message || '결제가 취소되었거나 실패했습니다.'
      return
    }
    cardPaySuccess.value = true
  } catch (err) {
    cardPayError.value = err instanceof Error ? err.message : '결제 창 호출에 실패했습니다.'
  } finally {
    cardPaySubmitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
    <div>
      <h1 class="text-2xl font-bold">이용상품구매</h1>
      <p class="text-sm text-muted-foreground">
        회당 사용은 3개월, 교재구독은 3개월, 년간구독은 12개월(모의고사·수험교재 모두) 이용하실 수
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
          <strong class="text-foreground">{{ discountedAmount.toLocaleString() }}원</strong>을
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
          입금 후에는 전화(010-8625-5197)로 <strong class="text-foreground">'입금했다'</strong>라고
          메시지를 남겨주시면 확인 후 바로 상품이용이 가능합니다. 또는 홈 화면 우측 하단 채팅창에
          <strong class="text-foreground">'입금했다'</strong>라고 남겨주셔도 됩니다.
        </p>
        <Button variant="outline" @click="resetForm">다른 상품 신청하기</Button>
      </template>

      <template v-else>
        <div class="flex gap-2">
          <Button
            v-for="type in productTypes"
            :key="type.key"
            :variant="productType === type.key ? 'default' : 'outline'"
            :disabled="type.key === 'annual'"
            @click="type.key !== 'annual' && (productType = type.key)"
          >
            {{ type.title }}
            <span v-if="type.key === 'annual'" class="text-xs">(일시중단)</span>
          </Button>
        </div>

        <div v-if="productType === 'select'" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <p class="text-xs text-muted-foreground">
              모의고사 회차 수 (1회당 1만원, 선택 시 1회차부터 해당 회차까지 이용 가능, 선택 안 해도
              됩니다)
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
              <template v-for="material in materialOptions" :key="material.key">
                <Button
                  v-if="!material.disabled"
                  :variant="selectedMaterials.includes(material.key) ? 'default' : 'outline'"
                  size="sm"
                  class="justify-between"
                  @click="toggleMaterial(material)"
                >
                  <span>{{ material.title }}</span>
                  <span>{{ material.amount.toLocaleString() }}원</span>
                </Button>
                <div
                  v-else
                  class="flex items-center justify-between rounded-md border border-dashed px-3 py-1.5 text-sm text-muted-foreground"
                >
                  <span>{{ material.title }}</span>
                  <span class="text-xs">{{ material.note }}</span>
                </div>
              </template>
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

        <div class="flex flex-col gap-1.5">
          <p class="text-xs text-muted-foreground">가입 조건</p>
          <div class="flex gap-2">
            <Button
              v-for="tier in DISCOUNT_TIERS"
              :key="tier.key"
              :variant="discountTier === tier.key ? 'default' : 'outline'"
              size="sm"
              @click="discountTier = tier.key"
            >
              {{ tier.title }} ({{ Math.round(tier.rate * 100) }}% 할인)
            </Button>
          </div>
          <div v-if="discountTier === 'group'" class="grid gap-1.5 pt-1">
            <Label class="text-sm">직장명</Label>
            <Input
              v-model="workplaceName"
              placeholder="소속 단체/직장명을 입력하세요"
              required
            />
          </div>
        </div>

        <div class="flex items-center justify-between text-sm text-muted-foreground">
          <span>정가</span>
          <span class="line-through">{{ totalAmount.toLocaleString() }}원</span>
        </div>
        <div class="flex items-center justify-between text-primary">
          <span class="font-bold">
            결제 금액 ({{ selectedTier.title }} {{ Math.round(selectedTier.rate * 100) }}% 할인
            적용)
          </span>
          <span class="text-xl font-bold">{{ discountedAmount.toLocaleString() }}원</span>
        </div>

        <Separator />

        <div class="flex flex-col gap-3">
          <p class="text-xs text-muted-foreground">
            카드 결제(PG)는 현재 신청 완료되어 심사 중이며, 약 5일 후부터 이용하실 수 있습니다. 그
            전까지는 아래 계좌로 계좌이체 부탁드립니다. 입금 확인 후 이용 가능하도록 처리해드립니다.
          </p>

          <div class="flex flex-col gap-1.5 rounded-lg border border-dashed p-3">
            <p class="text-xs text-muted-foreground">
              PG 심사용 카드결제 테스트입니다. 실제 결제·출금은 이루어지지 않습니다.
            </p>
            <Button
              variant="secondary"
              :disabled="totalAmount === 0 || cardPaySubmitting"
              @click="payWithCard"
            >
              {{ cardPaySubmitting ? '결제창 여는 중...' : '카드결제 테스트하기' }}
            </Button>
            <p v-if="cardPaySuccess" class="text-sm text-primary">테스트 결제가 완료되었습니다.</p>
            <ul class="text-sm text-left text-red-500" v-if="cardPayError">
              <li class="list-disc">{{ cardPayError }}</li>
            </ul>
          </div>

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

    <BackHomeLink />
  </div>
</template>

<style scoped></style>
