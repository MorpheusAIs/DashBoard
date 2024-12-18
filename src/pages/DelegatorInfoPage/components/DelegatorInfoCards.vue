<script setup lang="ts">
import DelegatorInfoCard from './DelegatorInfoCard.vue'
import { useI18n } from '@/composables'
import { computed, ref } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { DelegationUserCard } from '@/types'

const { t } = useI18n()
const numberOfDelegates = ref('0')
const web3ProvidersStore = useWeb3ProvidersStore()

const isRewardClaimable = computed(() => true)

const cards = computed<DelegationUserCard[]>(() => [
  ...(isRewardClaimable.value
    ? [
        {
          title: t('delegator-info-cards.reward', {
            asset: web3ProvidersStore.rewardsTokenSymbol,
          }),
          amount: numberOfDelegates.value,
          buttonText: t('delegator-info-cards.claim-button'),
        },
      ]
    : []),
  {
    title: t('delegator-info-cards.total-claimed', {
      asset: web3ProvidersStore.rewardsTokenSymbol,
    }),
    amount: numberOfDelegates.value,
  },
  {
    title: t('delegator-info-cards.total-staked', {
      asset: web3ProvidersStore.rewardsTokenSymbol,
    }),
    amount: numberOfDelegates.value,
  },
  {
    title: t('delegator-info-cards.subnet-fee'),
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
      @modal-button-click="console.log('modal button clicked')"
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
