import { bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { storeToRefs, useWeb3ProvidersStore } from '@/store'
import { type BigNumber, type Erc1967ProxyType } from '@/types'
import { useTimestamp } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ethers } from 'ethers'

const MULTIPLIER_SCALE = 25 //digits

export const usePool = (poolId: number) => {
  let _currentUserRewardUpdateIntervalId: NodeJS.Timeout

  const currentUserReward = ref<BigNumber | null>(null)
  const dailyReward = ref<BigNumber | null>(null)
  const poolData = ref<Erc1967ProxyType.PoolData | null>(null)
  const userPoolData = ref<Erc1967ProxyType.UserData | null>(null)
  const rewardsMultiplier = ref(1)

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
    if (!web3ProvidersStore.balances.stEth) return true
    return web3ProvidersStore.balances.stEth.isZero()
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
  const { erc1967ProxyContract } = storeToRefs(web3ProvidersStore)

  const fetchCurrentUserReward = async (): Promise<BigNumber> => {
    if (!web3ProvidersStore.provider.selectedAddress)
      throw new Error('user address unavailable')

    return erc1967ProxyContract.value.providerBased.value.getCurrentUserReward(
      poolId,
      web3ProvidersStore.provider.selectedAddress,
    )
  }

  const getDailyReward = (): BigNumber => {
    if (!poolData.value) throw new Error('poolData unavailable')

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
      erc1967ProxyContract.value.providerBased.value.poolsData(poolId),
      erc1967ProxyContract.value.providerBased.value.pools(poolId),
    ])

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
      totalDeposited: poolDataResponses[0].totalVirtualDeposited,
      withdrawLockPeriod: poolDataResponses[1].withdrawLockPeriod,
      withdrawLockPeriodAfterStake:
        poolDataResponses[1].withdrawLockPeriodAfterStake,
    }
  }

  const fetchUserPoolData = async (): Promise<Erc1967ProxyType.UserData> => {
    if (!web3ProvidersStore.provider.selectedAddress)
      throw new Error('user address unavailable')

    const response =
      await erc1967ProxyContract.value.providerBased.value.usersData(
        web3ProvidersStore.provider.selectedAddress,
        poolId,
      )

    return {
      claimLockEnd: response.claimLockEnd,
      claimLockStart: response.claimLockStart,
      deposited: response.deposited,
      lastStake: response.lastStake,
      pendingRewards: response.pendingRewards,
      rate: response.rate,
      virtualDeposited: response.virtualDeposited,
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
    isUserDataUpdating.value = true

    try {
      const response =
        // eslint-disable-next-line max-len
        await erc1967ProxyContract.value.providerBased.value.getCurrentUserMultiplier(
          poolId,
          web3ProvidersStore.provider.selectedAddress,
        )

      const scaleFactor = ethers.BigNumber.from(10).pow(MULTIPLIER_SCALE)
      const scaledNumber = response.div(scaleFactor)

      rewardsMultiplier.value = Number(
        parseFloat(scaledNumber.toString()).toFixed(2),
      )
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

  watch(
    () => [
      web3ProvidersStore.provider.selectedAddress,
      web3ProvidersStore.isConnected,
    ],
    async ([newAddress, isConnected]) => {
      currentUserReward.value = null
      userPoolData.value = null

      if (newAddress && isConnected) {
        try {
          await Promise.all([updateUserReward(), updateUserData()])
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

    isClaimDisabled,
    isDepositDisabled,
    isWithdrawDisabled,

    isInitializing,
    isUserDataUpdating,
  }
}
