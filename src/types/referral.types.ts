import { ethers } from 'ethers'

export type ReferralData = {
  tier: number | string
  currentReward: ethers.BigNumber
  totalClaimed: ethers.BigNumber
  multiplier: ethers.BigNumber
  amountStaked: ethers.BigNumber
  virtualAmountStaked: ethers.BigNumber
  rate: ethers.BigNumber
  pendingRewards: ethers.BigNumber
  lastClaim: ethers.BigNumber
  depositedAmount?: ethers.BigNumber
}

export type UserReferral = {
  amount: string
  id: string
  poolId: string
  user: string
}

export type UserReferralDepositedAmount = {
  amount: string
}

export type ReferrerTotalClaimed = {
  totalClaimed: string
}
