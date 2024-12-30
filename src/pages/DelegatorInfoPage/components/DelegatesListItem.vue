<template>
  <div
    class="delegates-list-item"
    :class="{
      'delegates-list-item--secondary': isYou,
    }"
  >
    <div class="delegates-list-item__content">
      <div class="delegates-list-item__col">
        <span class="delegates-list-item__row-address" :title="user.address">
          {{ abbrCenter(user.address) }}

          <span v-if="isYou" class="delegates-list-item__row-you">
            {{ $t('delegates-list-item.you-text') }}
          </span>
        </span>
      </div>
      <div class="delegates-list-item__col">
        <span class="delegates-list-item__text">
          {{ staked }}
        </span>
      </div>
      <div class="delegates-list-item__col">
        <span class="delegates-list-item__text">
          {{ claimed }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SubnetProvider } from '@/types'
import { abbrCenter, trimStringNumber } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { BN } from '@distributedlab/tools'

const props = defineProps<{
  user: SubnetProvider
}>()

const web3ProvidersStore = useWeb3ProvidersStore()

const isYou = computed(
  () =>
    props.user.address.toLowerCase() ===
    web3ProvidersStore.address.toLowerCase(),
)
const staked = computed(() =>
  trimStringNumber(
    BN.fromRaw(props.user.staked).div(BN.fromRaw(10).pow(18)).toString(),
  ),
)
const claimed = computed(() =>
  trimStringNumber(
    BN.fromRaw(props.user.claimed).div(BN.fromRaw(10).pow(18)).toString(),
  ),
)
</script>

<style scoped lang="scss">
.delegates-list-item {
  width: 100%;
  display: flex;
  align-items: center;
  height: toRem(80);
  padding: toRem(16) toRem(32);
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: var(--card-border-gradient-reversed);
  background: var(--card-background-gradient);

  &:not([disabled]):hover,
  &:not([disabled]):focus,
  &:not([disabled]):active {
    border: toRem(1) solid;
    border-image-slice: 1;
    border-image-source: var(--card-border-gradient-reversed);
    background: var(--card-background-gradient);
  }

  &--secondary {
    border-image-source: var(--card-border-gradient-secondary);

    &:not([disabled]):hover,
    &:not([disabled]):focus,
    &:not([disabled]):active {
      border-image-source: var(--card-border-gradient-secondary);
    }
  }
}

.delegates-list-item__content {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(toRem(100), 1fr));
  gap: toRem(36);
  align-items: center;
}

.delegates-list-item__col {
  display: flex;
  gap: toRem(24);
  align-items: center;
  justify-content: flex-end;

  &:first-child {
    justify-content: flex-start;
  }
}

.delegates-list-item__row-address {
  font-size: toRem(18);
  font-weight: 600;
  transition: color 0.2s ease-in-out;

  .delegates-list-item__col--username & {
    font-size: toRem(14);
    font-weight: 400;
    color: var(--text-tertiary-main);
  }

  .delegates-list-item:hover &,
  .delegates-list-item:active &,
  .delegates-list-item:focus & {
    color: var(--primary-main);
  }
}

.delegates-list-item__row-you {
  font-weight: 200;
  color: var(--primary-main);
}

.delegates-list-item__text {
  transition: color 0.2s ease-in-out;

  .delegates-list-item:hover &,
  .delegates-list-item:active &,
  .delegates-list-item:focus & {
    color: var(--primary-main);
  }
}
</style>
