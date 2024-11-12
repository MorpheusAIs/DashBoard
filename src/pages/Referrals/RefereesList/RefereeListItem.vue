<template>
  <div class="referee-list-item">
    <p class="referee-list-item__text">
      {{ number }}
    </p>
    <p class="referee-list-item__text">
      {{ concatedAddress }}
    </p>
    <p class="referee-list-item__text referee-list-item__text--bold">
      {{ deposited }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { abbrCenter } from '@/helpers'

const props = defineProps<{
  number: string
  address: string
  depositedAmount: string
}>()

const web3ProvidersStore = useWeb3ProvidersStore()

const deposited = computed(
  () => `${props.depositedAmount} ${web3ProvidersStore.depositTokenSymbol}`,
)
const concatedAddress = computed(() => abbrCenter(props.address))
</script>

<style scoped lang="scss">
.referee-list-item {
  display: grid;
  grid-template-columns: toRem(48) minmax(max-content, 1fr) toRem(150);
  gap: toRem(32);
  padding: toRem(24) toRem(48);
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: var(--card-border-gradient);
  background: var(--card-background-gradient);
}

.referee-list-item__text {
  font-size: toRem(17);

  &--bold {
    font-weight: 600;
  }

  &:last-child {
    margin-left: auto;
  }
}
</style>
