import { BigNumber } from '@/utils'
import { CONTRACT_METHODS } from '@/const'

export type PoolInteraction = {
  timestamp: string
  rate: string
}

export type UserInteraction = {
  timestamp: string
  rate: string
  deposited: string
  claimedRewards: string
  pendingRewards: string
}

export type YieldQueryData = {
  initialUserInteractions: UserInteraction[]
  userInteractions: UserInteraction[]
  [key: string]: PoolInteraction[]
}

export type ChartQueryData = Record<`r${number}`, { totalStaked?: string }[]>

export type ChartData = Record<number, BigNumber>

export type ContractMethods =
  (typeof CONTRACT_METHODS)[keyof typeof CONTRACT_METHODS]
