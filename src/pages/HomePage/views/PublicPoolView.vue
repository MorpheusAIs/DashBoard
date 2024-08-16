<template>
  <!--  TODO: SIMPLIFY WHOLE COMPONENT-->
  <div class="public-pool-view">
    <info-bar
      status="public"
      :title="dashboardTitle"
      :subtitle="$t(`home-page.public-pool-view.info-bar.subtitle--${poolId}`)"
      :description="
        $t(`home-page.public-pool-view.info-bar.description--${poolId}`)
      "
      :indicators="barIndicators"
      :is-loading="isInitializing"
    >
      <template v-if="!poolId" #description>
        <zero-pool-description
          :withdraw-after="withdrawAfterTime"
          :claim-after="claimAfterTime"
        />
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
                :text="
                  $t('home-page.public-pool-view.deposit-btn', {
                    token: web3ProvidersStore.depositTokenSymbol,
                  })
                "
                :is-loading="isInitializing"
                :disabled="isDepositDisabled"
                @click="isDepositModalShown = true"
              />
              <app-button
                v-if="!web3ProvidersStore.dashboardInfo.name"
                class="public-pool-view__bar-button"
                scheme="link"
                color="none"
                target="_blank"
                rel="noopener noreferrer"
                :text="$t('home-page.public-pool-view.external-link')"
                :icon-right="$icons.externalLink"
                :is-loading="isInitializing"
                :href="$config.HOW_GET_STETH_URL"
              />
            </div>
            <deposit-modal
              v-if="!isDepositDisabled && poolData?.minimalStake"
              v-model:is-shown="isDepositModalShown"
              :pool-id="poolId"
              :min-stake="poolData.minimalStake"
              :claim-lock-end="userPoolData?.claimLockEnd?.toString() ?? ''"
            />
          </div>
        </transition>
      </template>
    </info-bar>
    <info-dashboard
      :pool-id="poolId"
      :pool-data="poolData"
      :indicators="dashboardIndicators"
      :is-loading="isInitializing || isUserDataUpdating"
    >
      <div class="public-pool-view__dashboard-buttons-wrp">
        <app-button
          class="public-pool-view__dashboard-button"
          color="secondary"
          :text="
            $t('home-page.public-pool-view.withdraw-btn', {
              token: web3ProvidersStore.depositTokenSymbol,
            })
          "
          :is-loading="isInitializing || isUserDataUpdating"
          :disabled="isWithdrawDisabled"
          @click="isWithdrawModalShown = true"
        />
        <app-button
          class="public-pool-view__dashboard-button"
          :text="
            $t('home-page.public-pool-view.claim-btn', {
              token: web3ProvidersStore.rewardsTokenSymbol,
            })
          "
          :is-loading="isInitializing || isUserDataUpdating"
          :disabled="isClaimDisabled"
          @click="isClaimModalShown = true"
        />
      </div>
      <app-button
        v-if="isChangeLockEnabled"
        :class="[
          'public-pool-view__dashboard-button',
          'public-pool-view__change-lock-button',
        ]"
        :text="$t('home-page.public-pool-view.change-lock-btn')"
        :is-loading="isInitializing || isUserDataUpdating"
        :disabled="userPoolData?.deposited?.isZero()"
        @click="isChangeLockModalShown = true"
      />
      <p class="public-pool-view__dashboard-description">
        {{ $t(`home-page.public-pool-view.dashboard-description--${poolId}`) }}
      </p>
      <p
        v-if="
          poolData?.withdrawLockPeriod && !poolData?.withdrawLockPeriod.isZero()
        "
        class="public-pool-view__dashboard-note"
      >
        {{
          $t(`home-page.public-pool-view.dashboard-note--${poolId}`, {
            time: lockPeriod,
            token: web3ProvidersStore.depositTokenSymbol,
          })
        }}
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
      <change-lock-modal
        v-if="isChangeLockEnabled"
        v-model:is-shown="isChangeLockModalShown"
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
  ChangeLockModal,
} from '@/common'
import { useI18n, usePool } from '@/composables'
import { DEFAULT_TIME_FORMAT } from '@/const'
import { ICON_NAMES, ROUTE_NAMES } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import type { InfoBarType, InfoDashboardType } from '@/types'
import { formatEther, Time } from '@/utils'
import { computed, ref, watch } from 'vue'
import { ZeroPoolDescription } from '../components'
import { humanizeTime } from '@/helpers'
import { useRoute } from 'vue-router'
import { ErrorHandler } from '@/helpers'

const route = useRoute()
const props = defineProps<{ poolId: number }>()

const isClaimModalShown = ref(false)
const isChangeLockModalShown = ref(false)
const isDepositModalShown = ref(false)
const isWithdrawModalShown = ref(false)

const poolId = ref(props.poolId)

const { t } = useI18n()

const {
  currentUserReward,
  dailyReward,
  poolData,
  userPoolData,

  isClaimDisabled,
  isDepositDisabled,
  isWithdrawDisabled,
  rewardsMultiplier,

  isInitializing,
  isUserDataUpdating,
} = usePool(poolId)

const web3ProvidersStore = useWeb3ProvidersStore()

const isChangeLockEnabled = computed(
  () => route.name !== ROUTE_NAMES.appDashboardCapital,
)

const claimLockTime = computed(() => {
  if (userPoolData.value?.claimLockEnd) {
    const lockEnd = new Time(userPoolData.value?.claimLockEnd.toNumber())
    return new Time().isAfter(lockEnd)
      ? '-'
      : lockEnd.format(DEFAULT_TIME_FORMAT)
  }
  if (poolData.value) {
    const lockTime = new Time(
      userPoolData.value && !userPoolData.value.lastStake.isZero()
        ? userPoolData.value.lastStake
            .add(poolData.value.withdrawLockPeriodAfterStake)
            .toNumber()
        : poolData.value.payoutStart
            .add(poolData.value.withdrawLockPeriod)
            .toNumber(),
    )
    return new Time().isAfter(lockTime)
      ? '-'
      : lockTime.format(DEFAULT_TIME_FORMAT)
  }
  return ''
})

const withdrawAtTime = computed(() => {
  if (poolData.value) {
    const withdrawTime = new Time(
      userPoolData.value && !userPoolData.value.lastStake.isZero()
        ? userPoolData.value.lastStake
            .add(poolData.value.withdrawLockPeriodAfterStake)
            .toNumber()
        : poolData.value.payoutStart
            .add(poolData.value.withdrawLockPeriod)
            .toNumber(),
    )
    return new Time().isAfter(withdrawTime)
      ? '-'
      : withdrawTime.format(DEFAULT_TIME_FORMAT)
  }
  return '-'
})

const lockPeriod = computed(() =>
  humanizeTime(poolData.value?.withdrawLockPeriod?.toNumber() ?? 0),
)

const barIndicators = computed<InfoBarType.Indicator[]>(() => [
  {
    title: t('home-page.public-pool-view.total-deposits-title'),
    value: poolData.value
      ? `${formatEther(poolData.value.totalDeposited)} ${
          web3ProvidersStore.depositTokenSymbol
        }`
      : '',
  },
  {
    title: t('home-page.public-pool-view.daily-reward-title'),
    value: dailyReward.value
      ? `${formatEther(dailyReward.value)} ${
          web3ProvidersStore.rewardsTokenSymbol
        }`
      : '',
  },
  {
    title: t('home-page.public-pool-view.started-at-title'),
    value: poolData.value
      ? new Time(poolData.value.payoutStart.toNumber()).format(
          DEFAULT_TIME_FORMAT,
        )
      : '',
  },
  {
    title: t('home-page.public-pool-view.withdraw-at-title'),
    value: withdrawAtTime.value,
    note: t('home-page.public-pool-view.withdraw-at-note'),
  },
  {
    title: t('home-page.public-pool-view.claim-at-title'),
    value: claimLockTime.value.toString(),
    note: t('home-page.public-pool-view.claim-at-note'),
  },
])

const withdrawAfterTime = computed(() => {
  if (poolData.value) {
    return new Time(
      userPoolData.value && !userPoolData.value.lastStake.isZero()
        ? userPoolData.value.lastStake
            .add(poolData.value.withdrawLockPeriodAfterStake)
            .toNumber()
        : poolData.value.payoutStart
            .add(poolData.value.withdrawLockPeriod)
            .toNumber(),
    )
  }
  return ''
})

const claimAfterTime = computed(() => {
  if (poolData.value) {
    return new Time(
      poolData.value.payoutStart.add(poolData.value.claimLockPeriod).toNumber(),
    )
  }
  return ''
})

const dashboardIndicators = computed<InfoDashboardType.Indicator[]>(() => [
  {
    iconName: ICON_NAMES.ethereum,
    title: t('home-page.public-pool-view.user-deposit-title'),
    value: userPoolData.value
      ? `${formatEther(userPoolData.value.deposited)} ${
          web3ProvidersStore.depositTokenSymbol
        }`
      : '',
  },
  {
    iconName: ICON_NAMES.arbitrum,
    title: t('home-page.public-pool-view.available-to-claim-title'),
    value: currentUserReward.value
      ? `${formatEther(currentUserReward.value)} ${
          web3ProvidersStore.rewardsTokenSymbol
        }`
      : '',
  },
  ...(isChangeLockEnabled.value
    ? [
        {
          title: t('home-page.public-pool-view.multiplier-title'),
          value: `x${rewardsMultiplier.value}`,
        },
      ]
    : []),
])

const dashboardTitle = computed(
  () =>
    web3ProvidersStore.dashboardInfo.name ||
    t(`home-page.public-pool-view.info-bar.title--${poolId.value}`),
)

const findPublicPoolId = async (poolId = 0): Promise<number> => {
  const pool =
    await web3ProvidersStore.erc1967ProxyContract.providerBased.value.pools(
      poolId,
    )
  return pool.isPublic ? poolId : findPublicPoolId(poolId + 1)
}

const setPublicPoolId = async () => {
  try {
    poolId.value = await findPublicPoolId()
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
    poolId.value = props.poolId
  }
}

watch(
  () => props.poolId,
  async () => {
    if (route.name === ROUTE_NAMES.appDashboardCapital) {
      await setPublicPoolId()
      return
    }
    poolId.value = props.poolId
  },
  { immediate: true },
)
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

.public-pool-view__change-lock-button {
  margin-top: toRem(16);
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

.public-pool-view__dashboard-note {
  $color: #cccccc;

  margin-top: toRem(24);
  color: $color;
  width: 100%;

  @include body-italic;
}
</style>
