<template>
  <div class="coders-view">
    <info-bar
      status="private"
      :title="$t('home-page.coders-view.info-bar.title')"
      :subtitle="$t('home-page.coders-view.info-bar.subtitle')"
      :description="$t('home-page.coders-view.info-bar.description')"
      :indicators="barIndicators"
      :is-loading="isInitializing"
    />
    <info-dashboard :indicators="mockDashboardIndicators">
      <app-button
        class="coders-view__dashboard-btn"
        :text="$t('home-page.coders-view.claim-btn')"
        @click="isClaimModalShown = true"
      />
      <claim-modal v-model:is-shown="isClaimModalShown" amount="12 647.574" />
    </info-dashboard>
  </div>
</template>

<script lang="ts" setup>
import { AppButton, ClaimModal, InfoBar, InfoDashboard } from '@/common'
import { useContext, useContract } from '@/composables'
import { DEFAULT_TIME_FORMAT } from '@/const'
import { ETHEREUM_RPC_URLS, ICON_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'
import type {
  BigNumber,
  Erc1967ProxyType,
  InfoBarType,
  InfoDashboardType,
} from '@/types'
import { formatEther, Time } from '@/utils'
import { config } from '@config'
import { computed, onMounted, ref } from 'vue'

const POOL_ID = 1

const { $t } = useContext()

const { contractWithProvider: erc1967Proxy } = useContract(
  'ERC1967Proxy__factory',
  config.ERC1967_PROXY_CONTRACT_ADDRESS,
  !config.IS_TESTNET ? ETHEREUM_RPC_URLS.ethereum : ETHEREUM_RPC_URLS.sepolia,
)

const poolData = ref<Erc1967ProxyType.PoolData | null>(null)
const dailyReward = ref<BigNumber | null>(null)

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

const mockDashboardIndicators: InfoDashboardType.Indicator[] = [
  {
    iconName: ICON_NAMES.arbitrum,
    title: $t('home-page.coders-view.total-earning-title'),
    value: '20 MOR',
  },
  {
    iconName: ICON_NAMES.arbitrum,
    title: $t('home-page.coders-view.available-to-claim-title'),
    value: '12 MOR',
  },
]

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

const isInitializing = ref(false)
const init = async () => {
  isInitializing.value = true

  try {
    poolData.value = await fetchPoolData()
    dailyReward.value = await fetchDailyReward()
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
