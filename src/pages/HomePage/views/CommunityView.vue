<template>
  <div class="community-view">
    <info-bar
      status="public"
      :title="$t('home-page.community-view.info-bar.title')"
      :subtitle="$t('home-page.community-view.info-bar.subtitle')"
      :description="$t('home-page.community-view.info-bar.description')"
      :indicators="barIndicators"
      :is-loading="isInitializing"
    >
      <div class="community-view__bar-buttons-wrp">
        <app-button
          class="community-view__bar-button"
          :text="$t('home-page.community-view.deposit-btn')"
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
        />
      </div>
      <deposit-modal v-model:is-shown="isDepositModalShown" />
    </info-bar>
    <info-dashboard :indicators="mockDashboardIndicators">
      <div class="community-view__dashboard-buttons-wrp">
        <app-button
          class="community-view__dashboard-button"
          color="secondary"
          :text="$t('home-page.community-view.withdraw-btn')"
          @click="isWithdrawModalShown = true"
        />
        <app-button
          class="community-view__dashboard-button"
          :text="$t('home-page.community-view.claim-btn')"
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
import type {
  BigNumber,
  Erc1967ProxyType,
  InfoBarType,
  InfoDashboardType,
} from '@/types'
import { formatEther, Time } from '@/utils'
import { config } from '@config'
import { computed, onMounted, ref } from 'vue'

const POOL_ID = 0

const { $t } = useContext()
const { contractWithProvider: erc1967Proxy } = useContract(
  'ERC1967Proxy__factory',
  config.ERC1967_PROXY_CONTRACT_ADDRESS,
  !config.IS_TESTNET ? ETHEREUM_RPC_URLS.ethereum : ETHEREUM_RPC_URLS.sepolia,
)

const poolData = ref<Erc1967ProxyType.PoolData | null>(null)
const dailyReward = ref<BigNumber | null>(null)

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

const mockDashboardIndicators: InfoDashboardType.Indicator[] = [
  {
    iconName: ICON_NAMES.ethereum,
    title: $t('home-page.community-view.user-invested-title'),
    value: '13 stETH',
  },
  {
    iconName: ICON_NAMES.arbitrum,
    title: $t('home-page.community-view.available-to-claim-title'),
    value: '20 MOR',
  },
]

const isInitializing = ref(false)
const init = async () => {
  isInitializing.value = true

  try {
    const poolDataResponses = await Promise.all([
      erc1967Proxy.value.poolsData(POOL_ID),
      erc1967Proxy.value.pools(POOL_ID),
    ])

    poolData.value = {
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

    const currentTimestamp = new Time().timestamp
    const decreaseIntervalTimestamp = poolData.value.decreaseInterval.toNumber()

    const startTimestamp =
      currentTimestamp - (currentTimestamp % decreaseIntervalTimestamp)
    const endTimestamp = startTimestamp + decreaseIntervalTimestamp

    dailyReward.value = await erc1967Proxy.value.getPeriodReward(
      POOL_ID,
      startTimestamp,
      endTimestamp,
    )
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
