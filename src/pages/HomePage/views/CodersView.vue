<template>
  <div class="coders-view">
    <info-bar
      :status="poolData?.isPublic ? 'public' : 'private'"
      :title="$t('home-page.coders-view.info-bar.title')"
      :subtitle="$t('home-page.coders-view.info-bar.subtitle')"
      :description="$t('home-page.coders-view.info-bar.description')"
      :indicators="barIndicators"
      :is-loading="isInitializing"
    />
    <info-dashboard
      :indicators="dashboardIndicators"
      :progress="dashboardProgress"
      :is-loading="isInitializing || isUserDataUpdating"
    >
      <app-button
        class="coders-view__dashboard-btn"
        :text="$t('home-page.coders-view.claim-btn')"
        :is-loading="isInitializing || isUserDataUpdating"
        :disabled="!currentUserReward || currentUserReward.isZero()"
        @click="isClaimModalShown = true"
      />
      <claim-modal
        v-if="currentUserReward"
        v-model:is-shown="isClaimModalShown"
        :amount="formatEther(currentUserReward)"
        :pool-id="POOL_ID"
      />
    </info-dashboard>
  </div>
</template>

<script lang="ts" setup>
import { AppButton, ClaimModal, InfoBar, InfoDashboard } from '@/common'
import { useContext, useContract } from '@/composables'
import { DEFAULT_TIME_FORMAT } from '@/const'
import { ETHEREUM_RPC_URLS, ICON_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import type {
  Erc1967ProxyType,
  InfoBarType,
  InfoDashboardType,
  ProgressBarType,
} from '@/types'
import { formatEther, BigNumber, Time } from '@/utils'
import { config } from '@config'
import { computed, onMounted, ref, watch } from 'vue'

const POOL_ID = 1

const { $t } = useContext()
const web3ProvidersStore = useWeb3ProvidersStore()

const { contractWithProvider: erc1967Proxy } = useContract(
  'ERC1967Proxy__factory',
  config.ERC1967_PROXY_CONTRACT_ADDRESS,
  config.IS_MAINNET ? ETHEREUM_RPC_URLS.ethereum : ETHEREUM_RPC_URLS.sepolia,
)

const poolData = ref<Erc1967ProxyType.PoolData | null>(null)
const dailyReward = ref<BigNumber | null>(null)
const userData = ref<Erc1967ProxyType.UserData | null>(null)
const currentUserReward = ref<BigNumber | null>(null)

const isClaimModalShown = ref(false)

const barIndicators = computed<InfoBarType.Indicator[]>(() => [
  {
    title: $t('home-page.coders-view.daily-reward-title'),
    value: dailyReward.value ? `${formatEther(dailyReward.value)} MOR` : '',
  },
  {
    title: $t('home-page.coders-view.started-at-title'),
    value: poolData.value
      ? new Time(poolData.value.payoutStart.toNumber() * 1000).format(
          DEFAULT_TIME_FORMAT,
        )
      : '',
  },
  {
    title: $t('home-page.coders-view.claim-at-title'),
    value: poolData.value
      ? new Time(
          (poolData.value.payoutStart.toNumber() +
            poolData.value.claimLockPeriod.toNumber()) *
            1000,
        ).format(DEFAULT_TIME_FORMAT)
      : '',
    note: $t('home-page.coders-view.claim-at-note'),
  },
])

const dashboardIndicators = computed<InfoDashboardType.Indicator[]>(() => [
  {
    iconName: ICON_NAMES.arbitrum,
    title: $t('home-page.coders-view.available-to-claim-title'),
    value: currentUserReward.value
      ? `${formatEther(currentUserReward.value)} MOR`
      : '',
  },
])

const dashboardProgress = computed<ProgressBarType.Progress>(() => ({
  value: userData.value?.deposited || BigNumber.from('0'),
  total: poolData.value?.totalDeposited || BigNumber.from('1'),
}))

const fetchPoolData = async (): Promise<Erc1967ProxyType.PoolData> => {
  const poolDataResponses = await Promise.all([
    erc1967Proxy.value.poolsData(POOL_ID),
    erc1967Proxy.value.pools(POOL_ID),
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
    totalDeposited: poolDataResponses[0].totalDeposited,
    withdrawLockPeriod: poolDataResponses[1].withdrawLockPeriod,
    withdrawLockPeriodAfterStake:
      poolDataResponses[1].withdrawLockPeriodAfterStake,
  }
}

const fetchDailyReward = async (): Promise<BigNumber> => {
  if (!poolData.value) throw new Error('poolData unavailable')

  const currentTimestamp = new Time().timestamp
  const decreaseIntervalTimestamp = poolData.value.decreaseInterval.toNumber()

  const startTimestamp =
    currentTimestamp - (currentTimestamp % decreaseIntervalTimestamp)
  const endTimestamp = startTimestamp + decreaseIntervalTimestamp

  return erc1967Proxy.value.getPeriodReward(
    POOL_ID,
    startTimestamp,
    endTimestamp,
  )
}

const fetchUserData = async (): Promise<Erc1967ProxyType.UserData> => {
  if (!web3ProvidersStore.provider.selectedAddress)
    throw new Error('user address unavailable')

  const response = await erc1967Proxy.value.usersData(
    web3ProvidersStore.provider.selectedAddress,
    POOL_ID,
  )

  return {
    lastStake: response.lastStake,
    deposited: response.deposited,
    rate: response.rate,
    pendingRewards: response.pendingRewards,
  }
}

const fetchCurrentUserReward = async (): Promise<BigNumber> => {
  if (!web3ProvidersStore.provider.selectedAddress)
    throw new Error('user address unavailable')

  return erc1967Proxy.value.getCurrentUserReward(
    POOL_ID,
    web3ProvidersStore.provider.selectedAddress,
  )
}

const isUserDataUpdating = ref(false)
const updateUserData = async (): Promise<void> => {
  isUserDataUpdating.value = true

  try {
    const [userDataResponse, currentUserRewardResponse] = await Promise.all([
      fetchUserData(),
      fetchCurrentUserReward(),
    ])

    userData.value = userDataResponse
    currentUserReward.value = currentUserRewardResponse
  } finally {
    isUserDataUpdating.value = false
  }
}

watch(
  () => web3ProvidersStore.provider.selectedAddress,
  async newAddress => {
    if (newAddress) {
      try {
        await updateUserData()
      } catch (error) {
        ErrorHandler.process(error)
      }
    }
  },
)

const isInitializing = ref(false)
const init = async () => {
  isInitializing.value = true

  try {
    poolData.value = await fetchPoolData()
    dailyReward.value = await fetchDailyReward()

    if (web3ProvidersStore.provider.selectedAddress) await updateUserData()
  } catch (error) {
    ErrorHandler.process(error)
  }

  isInitializing.value = false
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.coders-view .coders-view__dashboard-btn {
  min-width: toRem(184);

  @include respond-to(medium) {
    width: 100%;
  }
}
</style>
