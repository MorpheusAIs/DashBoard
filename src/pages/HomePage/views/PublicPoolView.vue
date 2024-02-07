<template>
  <div class="public-pool-view">
    <info-bar
      status="public"
      :title="$t(`home-page.public-pool-view.info-bar.title--${poolId}`)"
      :subtitle="$t(`home-page.public-pool-view.info-bar.subtitle--${poolId}`)"
      :description="
        $t(`home-page.public-pool-view.info-bar.description--${poolId}`)
      "
      :indicators="barIndicators"
      :is-loading="isInitializing"
    >
      <template v-if="poolId === 0" #description>
        <zero-pool-description />
      </template>
      <template #default>
        <transition name="fade">
          <div
            v-if="web3ProvidersStore.isConnected"
            class="public-pool-view__bar-slot-wrp"
          >
            <div class="public-pool-view__bar-buttons-wrp">
              <app-button
                class="public-pool-view__bar-button"
                :text="$t('home-page.public-pool-view.deposit-btn')"
                :is-loading="isInitializing"
                :disabled="isDepositDisabled"
                @click="isDepositModalShown = true"
              />
              <app-button
                class="public-pool-view__bar-button"
                scheme="link"
                color="none"
                href="https://help.lido.fi/en/articles/5232811-how-do-i-get-steth"
                target="_blank"
                rel="noopener noreferrer"
                :text="$t('home-page.public-pool-view.external-link')"
                :icon-right="$icons.externalLink"
                :is-loading="isInitializing"
              />
            </div>
            <deposit-modal
              v-if="!isDepositDisabled && poolData?.minimalStake"
              v-model:is-shown="isDepositModalShown"
              :pool-id="poolId"
              :min-stake="poolData.minimalStake"
            />
          </div>
        </transition>
      </template>
    </info-bar>
    <info-dashboard
      :progress="dashboardProgress"
      :indicators="dashboardIndicators"
      :is-loading="isInitializing || isUserDataUpdating"
    >
      <div class="public-pool-view__dashboard-buttons-wrp">
        <app-button
          class="public-pool-view__dashboard-button"
          color="secondary"
          :text="$t('home-page.public-pool-view.withdraw-btn')"
          :is-loading="isInitializing || isUserDataUpdating"
          :disabled="isWithdrawDisabled"
          @click="isWithdrawModalShown = true"
        />
        <app-button
          class="public-pool-view__dashboard-button"
          :text="$t('home-page.public-pool-view.claim-btn')"
          :is-loading="isInitializing || isUserDataUpdating"
          :disabled="isClaimDisabled"
          @click="isClaimModalShown = true"
        />
      </div>
      <p class="public-pool-view__dashboard-description">
        {{ $t(`home-page.public-pool-view.dashboard-description--${poolId}`) }}
      </p>
      <withdraw-modal
        v-if="!isWithdrawDisabled && userPoolData"
        v-model:is-shown="isWithdrawModalShown"
        :pool-id="poolId"
        :available-amount="userPoolData.deposited"
      />
      <claim-modal
        v-if="!isClaimDisabled && currentUserReward"
        v-model:is-shown="isClaimModalShown"
        :amount="formatEther(currentUserReward)"
        :pool-id="poolId"
      />
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
import { useContext, usePool } from '@/composables'
import { DEFAULT_TIME_FORMAT } from '@/const'
import { ICON_NAMES } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import type { InfoBarType, InfoDashboardType, ProgressBarType } from '@/types'
import { BigNumber, formatEther, Time } from '@/utils'
import { computed, ref } from 'vue'
import { ZeroPoolDescription } from '../components'

const props = defineProps<{ poolId: number }>()

const isClaimModalShown = ref(false)
const isDepositModalShown = ref(false)
const isWithdrawModalShown = ref(false)

const poolId = computed(() => props.poolId)

const { $t } = useContext()

const {
  currentUserReward,
  dailyReward,
  poolData,
  userPoolData,

  isClaimDisabled,
  isDepositDisabled,
  isWithdrawDisabled,

  isInitializing,
  isUserDataUpdating,
} = usePool(poolId.value)

const web3ProvidersStore = useWeb3ProvidersStore()

const barIndicators = computed<InfoBarType.Indicator[]>(() => [
  {
    title: $t('home-page.public-pool-view.total-deposits-title'),
    value: poolData.value
      ? `${formatEther(poolData.value.totalDeposited)} stETH`
      : '',
  },
  {
    title: $t('home-page.public-pool-view.daily-reward-title'),
    value: dailyReward.value ? `${formatEther(dailyReward.value)} MOR` : '',
  },
  {
    title: $t('home-page.public-pool-view.started-at-title'),
    value: poolData.value
      ? new Time(poolData.value.payoutStart.toNumber() * 1000).format(
          DEFAULT_TIME_FORMAT,
        )
      : '',
  },
  {
    title: $t('home-page.public-pool-view.withdraw-at-title'),
    value: poolData.value
      ? new Time(
          userPoolData.value && !userPoolData.value.lastStake.isZero()
            ? userPoolData.value.lastStake
                .add(poolData.value.withdrawLockPeriodAfterStake)
                .mul(1000)
                .toNumber()
            : poolData.value.payoutStart
                .add(poolData.value.withdrawLockPeriod)
                .mul(1000)
                .toNumber(),
        ).format(DEFAULT_TIME_FORMAT)
      : '',
    note: $t('home-page.public-pool-view.withdraw-at-note'),
  },
  {
    title: $t('home-page.public-pool-view.claim-at-title'),
    value: poolData.value
      ? new Time(
          (poolData.value.payoutStart.toNumber() +
            poolData.value.claimLockPeriod.toNumber()) *
            1000,
        ).format(DEFAULT_TIME_FORMAT)
      : '',
    note: $t('home-page.public-pool-view.claim-at-note'),
  },
])

const dashboardIndicators = computed<InfoDashboardType.Indicator[]>(() => [
  {
    iconName: ICON_NAMES.ethereum,
    title: $t('home-page.public-pool-view.user-deposit-title'),
    value: userPoolData.value
      ? `${formatEther(userPoolData.value.deposited)} stETH`
      : '',
  },
  {
    iconName: ICON_NAMES.arbitrum,
    title: $t('home-page.public-pool-view.available-to-claim-title'),
    value: currentUserReward.value
      ? `${formatEther(currentUserReward.value)} MOR`
      : '',
  },
])

const dashboardProgress = computed<ProgressBarType.Progress>(() => ({
  value: userPoolData.value?.deposited || BigNumber.from('0'),
  total: poolData.value?.totalDeposited || BigNumber.from('1'),
}))
</script>

<style lang="scss" scoped>
.public-pool-view__bar-slot-wrp {
  margin-top: toRem(16);
  border-top: toRem(2) solid #494949;
  padding-top: toRem(30);

  @include respond-to(medium) {
    padding-top: toRem(32);
  }
}

.public-pool-view__bar-buttons-wrp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(16);

  @include respond-to(medium) {
    flex-direction: column;
    gap: toRem(8);
  }
}

.public-pool-view__bar-button {
  &:first-child {
    @include respond-to(medium) {
      width: 100%;
    }
  }
}

.public-pool-view__dashboard-buttons-wrp {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(16);

  @include respond-to(medium) {
    grid-gap: toRem(12);
  }
}

.public-pool-view .public-pool-view__dashboard-button {
  width: 100%;
}

.public-pool-view__dashboard-description {
  $color: #cccccc;

  margin-top: toRem(24);
  color: $color;

  @include body-5-regular;
}
</style>
