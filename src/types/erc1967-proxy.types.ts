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
}

export type UserData = {
  lastStake: BigNumber
  deposited: BigNumber
  rate: BigNumber
  pendingRewards: BigNumber
}
