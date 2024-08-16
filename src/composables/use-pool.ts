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
    )
      return true

    if (userPoolData.value?.claimLockEnd) {
      return (
        currentTimestamp.value <= userPoolData.value.claimLockEnd.toNumber()
      )
    }

    return (
      currentTimestamp.value <=
      poolData.value.payoutStart.add(poolData.value.claimLockPeriod).toNumber()
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
    )
      return true

    if (currentTimestamp.value < poolData.value.payoutStart.toNumber())
      return false

    return userPoolData.value.lastStake.isZero()
      ? currentTimestamp.value <=
          poolData.value.payoutStart
            .add(poolData.value.withdrawLockPeriod)
            .toNumber()
      : currentTimestamp.value <=
          userPoolData.value.lastStake
            .add(poolData.value.withdrawLockPeriodAfterStake)
            .toNumber()
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

  const fetchPoolData = async (): Promise<Erc1967ProxyType.PoolData> => {
    const poolDataResponses = await Promise.all([
      erc1967ProxyContract.value.poolsData(poolId.value),
      erc1967ProxyContract.value.pools(poolId.value),
      erc1967ProxyContract.value.totalDepositedInPublicPools(),
    ])

    // TODO: refactor

    return {
      claimLockPeriod: poolDataResponses[1].claimLockPeriod,
      decreaseInterval: poolDataResponses[1].decreaseInterval,
      initialReward: poolDataResponses[1].initialReward,
      isPublic: poolDataResponses[1].isPublic,
      lastUpdate: poolDataResponses[0].lastUpdate,
      minimalStake: poolDataResponses[1].minimalStake,
      rate: poolDataResponses[0].rate,
      payoutStart: poolDataResponses[1].payoutStart,
      rewardDecrease: poolDataResponses[1].rewardDecrease,
      totalDeposited:
        poolDataResponses[2] ?? poolDataResponses[0].totalVirtualDeposited,
      withdrawLockPeriod: poolDataResponses[1].withdrawLockPeriod,
      withdrawLockPeriodAfterStake:
        poolDataResponses[1].withdrawLockPeriodAfterStake,
    }
  }

  const fetchUserPoolData = async (): Promise<Erc1967ProxyType.UserData> => {
    if (!web3ProvidersStore.provider.selectedAddress)
      throw new errors.UserAddressError()

    const response = await erc1967ProxyContract.value.usersData(
      web3ProvidersStore.provider.selectedAddress,
      poolId.value,
    )

    return {
      claimLockEnd: response?.claimLockEnd ?? ethers.BigNumber.from(0),
      claimLockStart: response?.claimLockStart ?? ethers.BigNumber.from(0),
      deposited: response.deposited,
      lastStake: response.lastStake,
      pendingRewards: response.pendingRewards,
      rate: response.rate,
      virtualDeposited: response?.virtualDeposited ?? ethers.BigNumber.from(0),
    }
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
      const multiplier =
        //eslint-disable-next-line max-len
        await erc1967ProxyContract.value?.getClaimLockPeriodMultiplier(
          poolId.value,
          lockStart,
          lockPeriod || 0,
        )
      expectedRewardsMultiplier.value = humanizeRewards(multiplier)
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
      const response =
        // eslint-disable-next-line max-len
        await erc1967ProxyContract.value?.getCurrentUserMultiplier(
          poolId.value,
          web3ProvidersStore.provider.selectedAddress,
        )

      rewardsMultiplier.value = humanizeRewards(response)
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

    fetchExpectedMultiplier,
  }
}
