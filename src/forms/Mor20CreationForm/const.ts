import { type FieldOption } from '@/types'

export const UNISWAP_FEE_OPTIONS: FieldOption<string>[] = [
  { title: '0.01%', value: '100' },
  { title: '0.05%', value: '500' },
  { title: '0.30%', value: '3000' },
  { title: '1.00%', value: '10000' },
]
