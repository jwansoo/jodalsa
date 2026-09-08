export const roundPrices = Array.from({ length: 10 }, (_, i) => ({
  count: i + 1,
  amount: (i + 1) * 20000,
}))

export interface MaterialOption {
  key: string
  title: string
  amount: number
}

export const materialOptions: MaterialOption[] = [
  { key: '필기', title: '필기', amount: 100000 },
  { key: '핵심규정', title: '핵심규정', amount: 50000 },
  { key: '실기', title: '실기', amount: 50000 },
]

export const annualSubscriptionAmount = 400000

export const bankAccount = {
  bank: '국민은행',
  number: '803501-00-153698',
  holder: '장완수(조달컨설팅)',
}
