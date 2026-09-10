export const roundPrices = Array.from({ length: 10 }, (_, i) => ({
  count: i + 1,
  amount: (i + 1) * 10000,
}))

export interface MaterialOption {
  key: string
  title: string
  amount: number
}

export const materialOptions: MaterialOption[] = [
  { key: '필기', title: '필기', amount: 50000 },
  { key: '핵심규정', title: '핵심규정', amount: 20000 },
  { key: '실기', title: '실기', amount: 20000 },
]

export const annualSubscriptionAmount = 200000

export const bankAccount = {
  bank: '국민은행',
  number: '803501-00-153698',
  holder: '장완수(조달컨설팅)',
}

// 회당 사용은 3개월, 교재구독은 6개월, 년간구독은 12개월(모의고사·수험교재 모두) 이용 가능.
export const VALIDITY_MONTHS = {
  rounds: 3,
  materials: 6,
  annual: 12,
} as const

export const addMonths = (date: Date, months: number) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}
