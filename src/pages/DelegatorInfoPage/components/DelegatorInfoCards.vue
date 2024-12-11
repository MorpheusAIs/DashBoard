<script setup lang="ts">
import DelegatorInfoCard from './DelegatorInfoCard.vue'
import { useI18n } from '@/composables'
import { computed, ref } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { DelegationUserCard } from '@/types'

const { t } = useI18n()
const numberOfDelegates = ref(0)
const web3ProvidersStore = useWeb3ProvidersStore()

const cards = computed<DelegationUserCard[]>(() => [
  {
    title: t('delegator-info-cards.number-of-delegates-text'),
    amount: numberOfDelegates.value,
  },
  {
    title: t('delegator-info-cards.total-staked-by-delegates', {
      asset: web3ProvidersStore.rewardsTokenSymbol,
    }),
    amount: numberOfDelegates.value,
    buttonText: t('delegator-info-cards.delegate-button'),
  },
  {
    title: t('delegator-info-cards.total-staked-by-provider', {
      asset: web3ProvidersStore.rewardsTokenSymbol,
    }),
    amount: numberOfDelegates.value,
  },
])
</script>

<template>
  <div class="delegator-info-cards">
    <delegator-info-card
      v-for="card in cards"
      class="delegator-info-cards__card"
      :key="card.title"
      :card="card"
    />
  </div>
</template>

<style scoped lang="scss">
.delegator-info-cards {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}

.delegator-info-cards__card {
  flex: 1;
}
</style>
