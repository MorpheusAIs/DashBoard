import { ethers } from 'ethers'

export type ReferralData = {
  tier: number | string
  currentReward: ethers.BigNumber
  multiplier: ethers.BigNumber
  amountStaked: ethers.BigNumber
  virtualAmountStaked: ethers.BigNumber
  rate: ethers.BigNumber
  pendingRewards: ethers.BigNumber
  lastClaim: ethers.BigNumber
}
