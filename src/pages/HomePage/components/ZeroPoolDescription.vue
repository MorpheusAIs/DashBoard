<template>
  <div class="zero-pool-description">
    <ul class="zero-pool-description__list-items">
      <li
        v-for="(item, idx) in listItems"
        :key="idx"
        class="zero-pool-description__list-item"
      >
        {{ item }}
      </li>
    </ul>
    <p
      v-if="!web3ProvidersStore.dashboardInfo.distributionAddress"
      class="zero-pool-description__details"
    >
      {{ $t('zero-pool-description.details') }}
      <app-button
        class="zero-pool-description__details-link"
        scheme="link"
        target="_blank"
        rel="noopener noreferrer"
        text="GitHub"
        :href="$config.GITHUB_URL"
      />
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { AppButton } from '@/common'
import { useI18n } from '@/composables'
import { computed, defineProps } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { duration, Time } from '@distributedlab/tools'
import { ROUTE_NAMES } from '@/enums'
import { useRoute } from 'vue-router'
import { ErrorHandler, humanizeAsDays } from '@/helpers'

const props = defineProps<{
  withdrawAfter: '' | Time
  claimAfter: '' | Time
}>()

const { t } = useI18n()
const route = useRoute()
const web3ProvidersStore = useWeb3ProvidersStore()

const poolsLimits = ref({
  claimLockPeriodAfterStake: 0,
  claimLockPeriodAfterClaim: 0,
})

const isGlobalDashboard = computed(
  () => route.name !== ROUTE_NAMES.appDashboardCapital,
)

const listItems = computed<string[]>(() => [
  t('zero-pool-description.list.text-1', {
    deposit: web3ProvidersStore.depositTokenSymbol,
    reward: web3ProvidersStore.rewardsTokenSymbol,
  }),
  t('zero-pool-description.list.text-2', {
    deposit: web3ProvidersStore.depositTokenSymbol,
    time: props.withdrawAfter
      ? duration(props.withdrawAfter.timestamp, 'seconds').asDays
      : '',
  }),
  t('zero-pool-description.list.text-3', {
    reward: web3ProvidersStore.rewardsTokenSymbol,
  }),
  ...(isGlobalDashboard.value
    ? [
        t('zero-pool-description.list.text-4', {
          time: humanizeAsDays(poolsLimits.value.claimLockPeriodAfterStake),
          deposit: web3ProvidersStore.depositTokenSymbol,
          reward: web3ProvidersStore.rewardsTokenSymbol,
        }),
        t('zero-pool-description.list.text-5', {
          time: humanizeAsDays(poolsLimits.value.claimLockPeriodAfterClaim),
          reward: web3ProvidersStore.rewardsTokenSymbol,
        }),
      ]
    : []),
])

const loadPoolsLimits = async () => {
  try {
    const { claimLockPeriodAfterClaim, claimLockPeriodAfterStake } =
      // eslint-disable-next-line max-len
      await web3ProvidersStore.erc1967ProxyContract.providerBased.value.poolsLimits(
        0,
      )
    poolsLimits.value = {
      claimLockPeriodAfterClaim: claimLockPeriodAfterClaim.toNumber(),
      claimLockPeriodAfterStake: claimLockPeriodAfterStake.toNumber(),
    }
  } catch (e) {
    ErrorHandler.processWithoutFeedback()
  }
}

watch(
  () => web3ProvidersStore.address,
  () => {
    if (!isGlobalDashboard.value) return
    loadPoolsLimits()
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.zero-pool-description__list-items {
  display: flex;
  flex-direction: column;
  gap: toRem(4);
}

.zero-pool-description__list-item {
  display: flex;
  gap: toRem(8);

  &:before {
    content: '';
    margin-top: 0.5rem;
    transform: translateY(50%);
    height: toRem(6);
    width: toRem(6);
    background: var(--text-secondary-light);
    border-radius: 50%;
  }
}

.zero-pool-description__details {
  margin: toRem(16) 0 0 toRem(16);
}

.zero-pool-description .zero-pool-description__details-link {
  display: inline-block;
  overflow: unset;

  @include body-3-regular;
}
</style>
