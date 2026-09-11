export const roundPrices = Array.from({ length: 10 }, (_, i) => ({
  count: i + 1,
  amount: (i + 1) * 10000,
}))

export interface MaterialOption {
  key: string
  title: string
  amount: number
  /** true면 구매 버튼에서 선택 불가 (저작권 검토 중이거나, 별도 조건으로만 제공됨) */
  disabled?: boolean
  /** disabled인 경우 사유를 보여주는 안내 문구 */
  note?: string
}

export const materialOptions: MaterialOption[] = [
  { key: '필기', title: '필기', amount: 50000 },
  {
    key: '핵심규정',
    title: '핵심규정',
    amount: 20000,
    disabled: true,
    note: '필기 + 회차 10회 구매 회원에게 무료로 제공됩니다',
  },
  { key: '실기', title: '실기', amount: 20000, disabled: true, note: '오픈예정' },
]

export const annualSubscriptionAmount = 200000

// 신규가입/단체가입 할인 티어. 협력단체는 profiles.workplace_name으로 확인.
export const DISCOUNT_TIERS = [
  { key: 'new', title: '신입회원', rate: 0.5 },
  { key: 'group', title: '단체가입', rate: 0.7 },
] as const
export type DiscountTierKey = (typeof DISCOUNT_TIERS)[number]['key']

export const bankAccount = {
  bank: '국민은행',
  number: '803501-00-153698',
  holder: '장완수(조달컨설팅)',
}

// 회당 사용은 3개월, 교재구독은 3개월, 년간구독은 12개월(모의고사·수험교재 모두) 이용 가능.
export const VALIDITY_MONTHS = {
  rounds: 3,
  materials: 3,
  annual: 12,
} as const

export const addMonths = (date: Date, months: number) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}
