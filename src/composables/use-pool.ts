import { bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import {
  type BigNumber,
  type Erc1967ProxyType,
  type Mor1967ProxyType,
} from '@/types'
import { useTimestamp } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ethers } from 'ethers'
import { Time } from '@distributedlab/tools'
import { errors } from '@/errors'

const MULTIPLIER_SCALE = 21 //digits
const REWARDS_DIVIDER = 10000

// TODO: REFACTOR
export const usePool = (poolId: Ref<number>) => {
  let _currentUserRewardUpdateIntervalId: NodeJS.Timeout

  const route = useRoute()

  const currentUserReward = ref<BigNumber | null>(null)
  const dailyReward = ref<BigNumber | null>(null)
  const poolData = ref<
    Erc1967ProxyType.PoolData | Mor1967ProxyType.PoolData | null
  >(null)
  const userPoolData = ref<
    Erc1967ProxyType.UserData | Mor1967ProxyType.UserData | null
  >(null)
  const rewardsMultiplier = ref('1')
  const expectedRewardsMultiplier = ref('1')

  const isInitializing = ref(false)
  const isUserDataUpdating = ref(false)

  const currentTimestamp = computed<number>(
    () => currentTimestampMs.value / 1000,
  )

  const isClaimDisabled = computed<boolean>(() => {
    if (
      !poolData.value ||
      !currentUserReward.value ||
      currentUserReward.value.isZero()
    ) {
      return true
    }

    if (!userPoolData.value) return true

    if (
      userPoolData.value.claimLockEnd &&
      currentTimestamp.value <= userPoolData.value.claimLockEnd.toNumber()
    ) {
      return true
    }

    if (
      currentTimestamp.value <=
      poolData.value.payoutStart.add(poolData.value.claimLockPeriod).toNumber()
    ) {
      return true
    }

    if (
      currentTimestamp.value <=
      userPoolData.value.lastStake
        .add(poolData.value.withdrawLockPeriodAfterStake)
        .toNumber()
    ) {
      return true
    }

    return (
      currentTimestamp.value <=
      (userPoolData.value.lastClaim || ethers.BigNumber.from(0))
        .add(poolData.value.claimLockPeriodAfterClaim)
        .toNumber()
    )
  })

  const isDepositDisabled = computed<boolean>(() => {
    if (!web3ProvidersStore.balances.depositToken) return true
    return web3ProvidersStore.balances.depositToken.isZero()
  })

  const isWithdrawDisabled = computed<boolean>(() => {
    if (
      !poolData.value ||
      !userPoolData.value ||
      userPoolData.value.deposited.isZero()
    ) {
      return true
    }

    const payoutStart = poolData.value.payoutStart.toNumber()
    const withdrawLockEnd =
      payoutStart + poolData.value.withdrawLockPeriod.toNumber()
    const stakeLockEnd = userPoolData.value.lastStake
      .add(poolData.value.withdrawLockPeriodAfterStake)
      .toNumber()

    const currentTime = currentTimestamp.value

    return (
      currentTime < payoutStart ||
      (currentTime > payoutStart && currentTime <= withdrawLockEnd) ||
      currentTime <= stakeLockEnd
    )
  })

  const currentTimestampMs = useTimestamp()

  const web3ProvidersStore = useWeb3ProvidersStore()
  const erc1967ProxyContract = computed(
    () => web3ProvidersStore.erc1967ProxyContract.providerBased.value,
  )

  const fetchCurrentUserReward = async (): Promise<BigNumber> => {
    if (!web3ProvidersStore.provider.selectedAddress)
      throw new errors.UserAddressError()

    return erc1967ProxyContract.value.getCurrentUserReward(
      poolId.value,
      web3ProvidersStore.provider.selectedAddress,
    )
  }

  const getDailyReward = (): BigNumber => {
    if (!poolData.value) throw new errors.PoolDataNotFoundError()

    const payoutStartTimestamp = poolData.value.payoutStart.toNumber()

    if (currentTimestamp.value <= payoutStartTimestamp)
      return poolData.value.initialReward

    const intervalsCount = Math.floor(
      (currentTimestamp.value - payoutStartTimestamp) /
        poolData.value.decreaseInterval.toNumber(),
    )

    return poolData.value.initialReward.sub(
      poolData.value.rewardDecrease.mul(intervalsCount),
    )
  }

  const fetchPoolLimits = async () => {
    const isPoolLimitsCanBeFetched = 'poolsLimits' in erc1967ProxyContract.value

    if (isPoolLimitsCanBeFetched) {
      const [claimLockPeriodAfterClaim, claimLockPeriodAfterStake] =
        await erc1967ProxyContract.value.poolsLimits(poolId.value)
      return {
        claimLockPeriodAfterStake: claimLockPeriodAfterStake,
        claimLockPeriodAfterClaim: claimLockPeriodAfterClaim,
      }
    }
    return {
      claimLockPeriodAfterStake: ethers.BigNumber.from(0),
      claimLockPeriodAfterClaim: ethers.BigNumber.from(0),
    }
  }

  const fetchPoolData = async (): Promise<
    Erc1967ProxyType.PoolData | Mor1967ProxyType.PoolData
  > => {
    const [
      poolsDataResponse,
      poolsResponse,
      totalDepositedInPublicPools,
      poolLimits,
    ] = await Promise.all([
      erc1967ProxyContract.value.poolsData(poolId.value),
      erc1967ProxyContract.value.pools(poolId.value),
      erc1967ProxyContract.value.totalDepositedInPublicPools(),
      fetchPoolLimits(),
    ])

    const isTotalVirtualDepositedDefined =
      'totalVirtualDeposited' in poolsDataResponse
    const totalDeposited =
      totalDepositedInPublicPools ??
      (isTotalVirtualDepositedDefined
        ? (poolsDataResponse as unknown as Erc1967ProxyType.PoolData)
            .totalVirtualDeposited
        : ethers.BigNumber.from(0))

    return {
      claimLockPeriod: poolsResponse.claimLockPeriod,
      decreaseInterval: poolsResponse.decreaseInterval,
      initialReward: poolsResponse.initialReward,
      isPublic: poolsResponse.isPublic,
      lastUpdate: poolsDataResponse.lastUpdate,
      minimalStake: poolsResponse.minimalStake,
      payoutStart: poolsResponse.payoutStart,
      rate: poolsDataResponse.rate,
      rewardDecrease: poolsResponse.rewardDecrease,
      totalDeposited,
      claimLockPeriodAfterStake: poolLimits.claimLockPeriodAfterStake,
      claimLockPeriodAfterClaim: poolLimits.claimLockPeriodAfterClaim,
      withdrawLockPeriod: poolsResponse.withdrawLockPeriod,
      withdrawLockPeriodAfterStake: poolsResponse.withdrawLockPeriodAfterStake,
    } as Erc1967ProxyType.PoolData | Mor1967ProxyType.PoolData
  }

  const fetchUserPoolData = async (): Promise<
    Erc1967ProxyType.UserData | Mor1967ProxyType.UserData
  > => {
    if (!web3ProvidersStore.provider.selectedAddress)
      throw new errors.UserAddressError()

    const response = await erc1967ProxyContract.value.usersData(
      web3ProvidersStore.provider.selectedAddress,
      poolId.value,
    )

    const isClaimLockEndDefined = 'claimLockEnd' in response
    const claimLockEnd = isClaimLockEndDefined
      ? response.claimLockEnd
      : ethers.BigNumber.from(0)

    const isClaimLockStartDefined = 'claimLockStart' in response
    const claimLockStart = isClaimLockStartDefined
      ? response.claimLockStart
      : ethers.BigNumber.from(0)

    const isVirtualDepositedDefined = 'virtualDeposited' in response
    const virtualDeposited = isVirtualDepositedDefined
      ? response.virtualDeposited
      : ethers.BigNumber.from(0)

    const isLastClaim = 'lastClaim' in response
    const lastClaim = isLastClaim
      ? response.lastClaim
      : ethers.BigNumber.from(0)

    const isReferrerDefined = 'referrer' in response
    const referrer = isReferrerDefined ? response.referrer : ''

    return {
      claimLockEnd,
      claimLockStart,
      deposited: response.deposited,
      lastStake: response.lastStake,
      pendingRewards: response.pendingRewards,
      rate: response.rate,
      lastClaim,
      virtualDeposited,
      referrer,
    } as Erc1967ProxyType.UserData | Mor1967ProxyType.UserData
  }

  const humanizeRewards = (reward: BigNumber) => {
    const scaleFactor = ethers.BigNumber.from(10).pow(MULTIPLIER_SCALE)
    const scaledNumber = reward.div(scaleFactor)
    return (scaledNumber.toNumber() / REWARDS_DIVIDER).toFixed(4)
  }

  const fetchExpectedMultiplier = async (lockPeriod: string) => {
    try {
      if (!lockPeriod) return

      const lockStart = new Time().isAfter(
        userPoolData.value?.claimLockStart?.toString(),
      )
        ? new Time().timestamp
        : userPoolData.value?.claimLockStart?.toString()

      if ('getClaimLockPeriodMultiplier' in erc1967ProxyContract.value) {
        const multiplier =
          await erc1967ProxyContract.value.getClaimLockPeriodMultiplier(
            poolId.value,
            lockStart || 0,
            lockPeriod || 0,
          )

        expectedRewardsMultiplier.value = humanizeRewards(multiplier)
      }
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  }

  const updateUserData = async (): Promise<void> => {
    isUserDataUpdating.value = true

    try {
      const [userDataResponse, currentUserRewardResponse] = await Promise.all([
        fetchUserPoolData(),
        fetchCurrentUserReward(),
      ])

      userPoolData.value = userDataResponse
      currentUserReward.value = currentUserRewardResponse
    } finally {
      isUserDataUpdating.value = false
    }
  }

  const updateUserReward = async (): Promise<void> => {
    if (route.query.address) return

    isUserDataUpdating.value = true

    try {
      if ('getCurrentUserMultiplier' in erc1967ProxyContract.value) {
        const response =
          await erc1967ProxyContract.value.getCurrentUserMultiplier(
            poolId.value,
            web3ProvidersStore.provider.selectedAddress,
          )

        rewardsMultiplier.value = humanizeRewards(response)
      }
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
    isUserDataUpdating.value = false
  }

  const init = async () => {
    isInitializing.value = true

    try {
      if (
        web3ProvidersStore.isConnected &&
        web3ProvidersStore.provider.selectedAddress
      ) {
        const [pooDataResponse] = await Promise.all([
          fetchPoolData(),
          updateUserData(),
          updateUserReward(),
        ])

        poolData.value = pooDataResponse
      } else {
        poolData.value = await fetchPoolData()
      }

      if (poolData.value) dailyReward.value = getDailyReward()
    } catch (error) {
      ErrorHandler.process(error)
    }

    isInitializing.value = false
  }

  const onChangeCurrentUserReward = async (): Promise<void> => {
    if (web3ProvidersStore.provider.selectedAddress) {
      try {
        currentUserReward.value = await fetchCurrentUserReward()
      } catch (error) {
        ErrorHandler.process(error)
      }
    }
  }

  const onChangePoolData = async (): Promise<void> => {
    try {
      if (web3ProvidersStore.provider.selectedAddress) {
        const [pooDataResponse] = await Promise.all([
          fetchPoolData(),
          updateUserData(),
          updateUserReward(),
        ])

        poolData.value = pooDataResponse
        return
      }

      poolData.value = await fetchPoolData()
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  watch(() => [poolId, web3ProvidersStore.dashboardInfo], init, { deep: true })

  watch(
    () => [
      web3ProvidersStore.provider.selectedAddress,
      web3ProvidersStore.isConnected,
      web3ProvidersStore.networkId,
      web3ProvidersStore.dashboardInfo,
    ],
    async () => {
      currentUserReward.value = null
      userPoolData.value = null

      if (
        (route.query.address || web3ProvidersStore.provider.selectedAddress) &&
        web3ProvidersStore.isConnected
      ) {
        try {
          await Promise.all([updateUserData(), updateUserReward()])
        } catch (error) {
          ErrorHandler.process(error)
        }
      }
    },
  )

  onMounted(() => {
    init()
    bus.on(BUS_EVENTS.changedPoolData, onChangePoolData)
    bus.on(BUS_EVENTS.changedCurrentUserReward, onChangeCurrentUserReward)
    _currentUserRewardUpdateIntervalId = setInterval(async () => {
      if (
        !web3ProvidersStore.isConnected ||
        !web3ProvidersStore.provider.selectedAddress ||
        !web3ProvidersStore.isValidChain ||
        web3ProvidersStore.isAddingToken
      )
        return

      try {
        currentUserReward.value = await fetchCurrentUserReward()
      } catch (error) {
        ErrorHandler.process(error)
      }
    }, 30000)
  })

  onBeforeUnmount(() => {
    bus.off(BUS_EVENTS.changedPoolData, onChangePoolData)
    bus.off(BUS_EVENTS.changedCurrentUserReward, onChangeCurrentUserReward)
    clearInterval(_currentUserRewardUpdateIntervalId)
  })

  return {
    currentUserReward,
    dailyReward,
    poolData,
    userPoolData,
    rewardsMultiplier,
    expectedRewardsMultiplier,

    isClaimDisabled,
    isDepositDisabled,
    isWithdrawDisabled,

    isInitializing,
    isUserDataUpdating,

    currentTimestamp,

    fetchExpectedMultiplier,
  }
}
