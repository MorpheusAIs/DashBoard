import type { FieldOption } from '@/types'
import type { STEP_IDS } from './enums'

export type GeneralConfig = {
  projectName: string
}

export type ArbitrumConfigSettings = {
  tokenInAddress: string
  tokenOutAddress: string
  firstSwapFee: FieldOption<string>
  secondSwapFee: FieldOption<string>
}

export type ArbitrumConfig = {
  tokenName: string
  tokenSymbol: string
  adminContractAddress: string
  isUpgradeable: boolean
  settings: ArbitrumConfigSettings
}

export type EthereumConfigGroup = {
  isPublic: boolean
  payoutStartAt: string
  decreaseInterval: string
  withdrawLockPeriod: string
  claimLockPeriod: string
  withdrawLockPeriodAfterStake: string
  initialReward: string
  rewardDecrease: string
  minimalStake: string
}

export type EthereumConfig = {
  adminContractAddress: string
  isUpgradeable: boolean
  groups: EthereumConfigGroup[]
}

export type Form = {
  stepId: STEP_IDS
  generalConfig: GeneralConfig
  arbitrumConfig: ArbitrumConfig
  ethereumConfig: EthereumConfig
}

export type StepTab = {
  id: string
  title: string
}
