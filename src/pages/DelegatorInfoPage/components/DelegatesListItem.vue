<template>
  <div class="delegates-list-item">
    <div class="delegates-list-item__content">
      <div class="delegates-list-item__col">
        <span class="delegates-list-item__row-address" :title="user.address">
          {{ abbrCenter(user.address) }}
          <copy-button :content="user.address" :message="'copied'" />
          <span v-if="isYou" class="delegates-list-item__user-address">
            {{ $t('builders-item.user-address-lbl') }}
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
      <div class="delegates-list-item__col">
        <span class="delegates-list-item__text">
          {{ trimStringNumber(fee.toString()) }}
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
import { CopyButton } from '@/common'
import { formatDecimal } from '@/utils/formatters'

const props = defineProps<{
  user: SubnetProvider
  fee: string
}>()

const web3ProvidersStore = useWeb3ProvidersStore()

const isYou = computed(
  () =>
    props.user.address.toLowerCase() ===
    web3ProvidersStore.address.toLowerCase(),
)

const fee = computed(() => {
  const claimed = BN.fromRaw(props.user.claimed).div(BN.fromRaw(10).pow(18))
  const feeAmount = BN.fromRaw(props.fee)
    .div(BN.fromRaw(10).pow(25))
    .mul(claimed)
  return formatDecimal(feeAmount.toString())
})

const staked = computed(() => {
  const stakedAmount = BN.fromRaw(props.user.staked).div(BN.fromRaw(10).pow(18))
  return formatDecimal(stakedAmount.toString())
})

const claimed = computed(() => {
  const claimedAmount = BN.fromRaw(props.user.claimed).div(
    BN.fromRaw(10).pow(18),
  )
  const feeAmount = BN.fromRaw(props.fee)
    .div(BN.fromRaw(10).pow(25))
    .mul(claimedAmount)
  return formatDecimal(claimedAmount.sub(feeAmount).toString())
})
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

  &:hover {
    border: toRem(1) solid;
    border-image-slice: 1;
    border-image-source: var(--card-border-gradient-secondary);
    background: var(--card-background-gradient);
  }
}

.delegates-list-item :deep(.copy-button) {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.delegates-list-item:hover :deep(.copy-button) {
  opacity: 1;
}

.delegates-list-item__content {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(toRem(100), 1fr));
  gap: toRem(36);
  align-items: center;
}

.delegates-list-item__col {
  display: flex;
  gap: toRem(24);
  align-items: center;
  justify-content: flex-end;
  position: relative;

  &:first-child {
    justify-content: flex-start;
  }
}

.delegates-list-item__row-address {
  font-size: toRem(16);
  font-weight: 600;
  transition: color 0.2s ease-in-out;
  position: relative;
  display: flex;
  align-items: center;
  gap: toRem(8);

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

.delegates-list-item__user-address {
  font-size: toRem(14);
  color: var(--primary-main);
  position: absolute;
  left: calc(100% + 0.25rem);
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
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
