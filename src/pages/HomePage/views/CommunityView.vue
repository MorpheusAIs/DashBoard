<template>
  <div class="community-view">
    <info-bar
      :status="poolData?.isPublic ? 'public' : 'private'"
      :title="$t('home-page.community-view.info-bar.title')"
      :subtitle="$t('home-page.community-view.info-bar.subtitle')"
      :description="$t('home-page.community-view.info-bar.description')"
      :indicators="barIndicators"
      :is-loading="isInitializing"
    >
      <transition name="fade">
        <div v-if="web3ProvidersStore.provider.isConnected">
          <div class="community-view__bar-buttons-wrp">
            <app-button
              class="community-view__bar-button"
              :text="$t('home-page.community-view.deposit-btn')"
              :is-loading="isInitializing"
              @click="isDepositModalShown = true"
            />
            <app-button
              class="community-view__bar-button"
              scheme="link"
              color="none"
              href="https://help.lido.fi/en/articles/5232811-how-do-i-get-steth"
              target="_blank"
              rel="noopener noreferrer"
              :text="$t('home-page.community-view.external-link')"
              :icon-right="$icons.externalLink"
              :is-loading="isInitializing"
            />
          </div>
          <deposit-modal v-model:is-shown="isDepositModalShown" />
        </div>
      </transition>
    </info-bar>
    <info-dashboard
      :progress="dashboardProgress"
      :indicators="dashboardIndicators"
      :is-loading="isInitializing || isUserDataUpdating"
    >
      <div class="community-view__dashboard-buttons-wrp">
        <app-button
          class="community-view__dashboard-button"
          color="secondary"
          :text="$t('home-page.community-view.withdraw-btn')"
          :is-loading="isInitializing || isUserDataUpdating"
          @click="isWithdrawModalShown = true"
        />
        <app-button
          class="community-view__dashboard-button"
          :text="$t('home-page.community-view.claim-btn')"
          :is-loading="isInitializing || isUserDataUpdating"
          @click="isClaimModalShown = true"
        />
      </div>
      <p class="community-view__dashboard-description">
        {{ $t('home-page.community-view.dashboard-description') }}
      </p>
      <withdraw-modal v-model:is-shown="isWithdrawModalShown" />
      <claim-modal v-model:is-shown="isClaimModalShown" amount="12 647.574" />
    </info-dashboard>
  </div>
</template>

<script lang="ts" setup>
import {
  AppButton,
  ClaimModal,
  DepositModal,
  InfoBar,
  InfoDashboard,
  WithdrawModal,
} from '@/common'
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
import { BigNumber, formatEther, Time } from '@/utils'
import { config } from '@config'
import { computed, onMounted, ref, watch } from 'vue'

const POOL_ID = 0

const { $t } = useContext()

const { contractWithProvider: erc1967Proxy } = useContract(
  'ERC1967Proxy__factory',
  config.ERC1967_PROXY_CONTRACT_ADDRESS,
  !config.IS_TESTNET ? ETHEREUM_RPC_URLS.ethereum : ETHEREUM_RPC_URLS.sepolia,
)

const web3ProvidersStore = useWeb3ProvidersStore()

const poolData = ref<Erc1967ProxyType.PoolData | null>(null)
const dailyReward = ref<BigNumber | null>(null)
const userData = ref<Erc1967ProxyType.UserData | null>(null)
const currentUserReward = ref<BigNumber | null>(null)

const isClaimModalShown = ref(false)
const isDepositModalShown = ref(false)
const isWithdrawModalShown = ref(false)

const barIndicators = computed<InfoBarType.Indicator[]>(() => [
  {
    title: $t('home-page.community-view.total-invested-title'),
    value: poolData.value
      ? `${formatEther(poolData.value.totalDeposited)} stETH`
      : '',
  },
  {
    title: $t('home-page.community-view.daily-reward-title'),
    value: dailyReward.value ? `${formatEther(dailyReward.value)} MOR` : '',
  },
  {
    title: $t('home-page.community-view.started-at-title'),
    value: poolData.value
      ? new Time(poolData.value.payoutStart.toNumber() * 1000).format(
          DEFAULT_TIME_FORMAT,
        )
      : '',
  },
  {
    title: $t('home-page.community-view.withdraw-at-title'),
    value: poolData.value
      ? new Time(
          (poolData.value.payoutStart.toNumber() +
            poolData.value.withdrawLockPeriod.toNumber()) *
            1000,
        ).format(DEFAULT_TIME_FORMAT)
      : '',
    note: $t('home-page.community-view.withdraw-at-note'),
  },
  {
    title: $t('home-page.community-view.claim-at-title'),
    value: poolData.value
      ? new Time(
          (poolData.value.payoutStart.toNumber() +
            poolData.value.claimLockPeriod.toNumber()) *
            1000,
        ).format(DEFAULT_TIME_FORMAT)
      : '',
    note: $t('home-page.community-view.claim-at-note'),
  },
])

const dashboardIndicators = computed<InfoDashboardType.Indicator[]>(() => [
  {
    iconName: ICON_NAMES.ethereum,
    title: $t('home-page.community-view.user-invested-title'),
    value: userData.value
      ? `${formatEther(userData.value.deposited)} stETH`
      : '',
  },
  {
    iconName: ICON_NAMES.arbitrum,
    title: $t('home-page.community-view.available-to-claim-title'),
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
.community-view__bar-buttons-wrp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(16);

  @include respond-to(medium) {
    flex-direction: column;
    gap: toRem(8);
  }
}

.community-view__bar-button {
  &:first-child {
    @include respond-to(medium) {
      width: 100%;
    }
  }
}

.community-view__dashboard-buttons-wrp {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(16);

  @include respond-to(medium) {
    grid-gap: toRem(12);
  }
}

.community-view .community-view__dashboard-button {
  width: 100%;
}

.community-view__dashboard-description {
  $color: #cccccc;

  margin-top: toRem(24);
  color: $color;

  @include body-5-regular;
}
</style>
