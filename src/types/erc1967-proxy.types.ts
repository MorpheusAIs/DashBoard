import { BigNumber } from 'ethers'

export type PoolData = {
  claimLockPeriod: BigNumber
  decreaseInterval: BigNumber
  initialReward: BigNumber
  isPublic: boolean
  lastUpdate: BigNumber
  minimalStake: BigNumber
  payoutStart: BigNumber
  rate: BigNumber
  rewardDecrease: BigNumber
  totalDeposited: BigNumber
  withdrawLockPeriod: BigNumber
  withdrawLockPeriodAfterStake: BigNumber
  totalVirtualDeposited: BigNumber
  claimLockPeriodAfterStake: BigNumber
  claimLockPeriodAfterClaim: BigNumber
}

export type UserData = {
  claimLockEnd: BigNumber
  claimLockStart: BigNumber
  deposited: BigNumber
  lastStake: BigNumber
  pendingRewards: BigNumber
  rate: BigNumber
  virtualDeposited: BigNumber
  referrer?: string
}
