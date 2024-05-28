<template>
  <div class="group-info-card">
    <h5 class="group-info-card__name">
      {{ group.name }}
    </h5>
    <ul class="group-info-card__indicators">
      <li v-for="(indicator, idx) in indicators" :key="idx">
        <h5 class="group-info-card__indicator-title">
          {{ indicator.title }}
        </h5>
        <p class="group-info-card__indicator-value">
          {{ indicator.value }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from '@/composables'
import { type BigNumberish } from '@/types'
import { computed } from 'vue'
import { type EthereumConfigGroup } from '../../../types'

type Indicator = {
  title: string
  value: BigNumberish
}

const props = defineProps<{
  group: EthereumConfigGroup
}>()

const { t } = useI18n()

const indicators = computed<Indicator[]>(() => [
  {
    title: t(
      'contract-creation-form.ethereum-step.group-info-card.payout-start-title',
    ),
    value: props.group.payoutStartAt,
  },
  {
    title: t(
      'contract-creation-form.ethereum-step.group-info-card.decrease-interval-title',
    ),
    value: props.group.decreaseInterval,
  },
  {
    title: t(
      'contract-creation-form.ethereum-step.group-info-card.withdraw-lock-period-title',
    ),
    value: props.group.withdrawLockPeriod,
  },
  {
    title: t(
      'contract-creation-form.ethereum-step.group-info-card.claim-lock-period-title',
    ),
    value: props.group.claimLockPeriod,
  },
  {
    title: t(
      'contract-creation-form.ethereum-step.group-info-card.withdraw-lock-period-after-stake-title',
    ),
    value: props.group.withdrawLockPeriodAfterStake,
  },
  {
    title: t(
      'contract-creation-form.ethereum-step.group-info-card.initial-reward-title',
    ),
    value: props.group.initialReward,
  },
  {
    title: t(
      'contract-creation-form.ethereum-step.group-info-card.reward-decrease-title',
    ),
    value: props.group.rewardDecrease,
  },
  {
    title: t(
      'contract-creation-form.ethereum-step.group-info-card.minimal-stake-title',
    ),
    value: props.group.minimalStake,
  },
])
</script>

<style lang="scss" scoped>
.group-info-card {
  padding: toRem(16);
  background: var(--background-secondary-main);
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    95.36deg,
    rgba(255, 255, 255, 0.48) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
}

.group-info-card__name {
  color: var(--primary-main);

  @include body-2-semi-bold;
}

.group-info-card__indicators {
  margin: toRem(20) toRem(36) 0 0;
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-gap: toRem(20);
  justify-content: space-between;
}

.group-info-card__indicator-title {
  color: var(--text-secondary-main);
}

.group-info-card__indicator-value {
  @include body-2-semi-bold;
}
</style>
