<template>
  <div class="referral-info-card">
    <p class="referral-info-card__title">
      {{ $t('referral-info-card.title', { tier: tierNumber }) }}
    </p>
    <p class="referral-info-card__deposited">
      {{ $t('referral-info-card.deposited-text') }}
    </p>
    <p class="referral-info-card__deposited-value">
      {{ depositedValueTest }}
    </p>
    <h5 class="referral-info-card__percent">
      {{ `${percent}%` }}
    </h5>
    <p class="referral-info-card__bonus">
      {{ $t('referral-info-card.bonus-text') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables'
import { computed } from 'vue'
import { useWeb3ProvidersStore } from '@/store'

const props = defineProps<{
  tierNumber: number
  fromDeposited: number
  toDeposited: number
  percent: number
  isLongCard?: boolean
}>()

const web3ProviderStore = useWeb3ProvidersStore()

const { t } = useI18n()

const depositedValueTest = computed(() => {
  if (!props.toDeposited) {
    return t('referral-info-card.to-deposited-text', {
      from: props.fromDeposited,
      symbol: web3ProviderStore.rewardsTokenSymbol,
    })
  }
  return props.fromDeposited
    ? t('referral-info-card.from-to-deposited-text', {
        from: props.fromDeposited,
        to: props.toDeposited,
        symbol: web3ProviderStore.rewardsTokenSymbol,
      })
    : t('referral-info-card.less-deposited-text', {
        to: props.toDeposited,
        symbol: web3ProviderStore.rewardsTokenSymbol,
      })
})
</script>

<style scoped lang="scss">
.referral-info-card {
  width: fit-content;
  min-width: toRem(295);
  padding: toRem(24);
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: var(--card-border-gradient);
  background: var(--card-background-gradient);
}

.referral-info-card__title {
  font-size: toRem(24);
  font-weight: 600;
  color: var(--primary-main);
}

.referral-info-card__deposited {
  margin-top: toRem(12);
  font-size: toRem(18);
  color: var(--text-tertiary-main);
}

.referral-info-card__deposited-value {
  margin-top: toRem(4);
  font-size: toRem(18);
  font-weight: 700;
}

.referral-info-card__percent {
  margin-top: toRem(32);
  font-weight: 700;
  font-size: toRem(54);
}

.referral-info-card__bonus {
  font-size: toRem(17);
  margin-bottom: toRem(24);
}
</style>
