<template>
  <app-button
    class="delegation-providers-item"
    scheme="none"
    size="none"
    :class="{
      'delegation-providers-item--secondary': secondary,
      'delegation-providers-item--tertiary': tertiary,
    }"
    @mouseenter="showDelegateButton"
    @mouseleave="hideDelegateButton"
    @click="goToDelegatorPage"
  >
    <div class="delegation-providers-item__content">
      <div
        class="delegation-providers-item__col"
        :class="{ 'delegation-providers-item__col--username': user.name }"
      >
        <span v-if="user.name" class="delegation-providers-item__row-name">
          <span v-if="isYou" class="delegation-providers-item__row-you">{{
            $t('delegation-providers-item.you-text')
          }}</span>

          {{ user.name }}
        </span>
        <span class="delegation-providers-item__row-address">
          {{ abbrCenter(user.id) }}

          <span
            v-if="isYou && !user.name"
            class="delegation-providers-item__row-you"
          >
            {{ $t('delegation-providers-item.you-text') }}
          </span>
        </span>
      </div>
      <div class="delegation-providers-item__col">
        <span class="delegation-providers-item__text">
          {{ fee }}
        </span>
      </div>
      <div class="delegation-providers-item__col">
        <span class="delegation-providers-item__text">
          {{ totalStaked }}
        </span>
      </div>
      <div class="delegation-providers-item__col">
        <span class="delegation-providers-item__text">
          {{ totalClaimed }}
        </span>
      </div>
      <div class="delegation-providers-item__col">
        <app-button
          v-if="isDelegateButtonShown && !isYou"
          class="delegation-providers-item__stake-button"
          size="none"
          color="secondary"
          :text="$t('delegation-providers-item.stake-button')"
          @click.stop="delegate"
        />
      </div>
    </div>
    <delegate-tokens-modal
      v-model:is-shown="isDelegateModalShown"
      :delegate-address="user.id"
    />
  </app-button>
</template>

<script setup lang="ts">
import DelegateTokensModal from '@/pages/DelegationPage/components/DelegateTokensModal.vue'

import { computed, ref } from 'vue'
import { SubnetItem } from '@/types'
import { AppButton } from '@/common'
import { abbrCenter, trimStringNumber } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { ROUTE_NAMES } from '@/enums'
import { useRouter } from 'vue-router'
import { BN } from '@distributedlab/tools'

const props = defineProps<{
  user: SubnetItem
  secondary?: boolean
  tertiary?: boolean
}>()

const router = useRouter()
const web3ProvidersStore = useWeb3ProvidersStore()
const isDelegateButtonShown = ref(false)
const isDelegateModalShown = ref(false)

const isYou = computed(
  () =>
    props.user.owner.toLowerCase() === web3ProvidersStore.address.toLowerCase(),
)
const fee = computed(
  () =>
    trimStringNumber(
      BN.fromRaw(props.user.fee).div(BN.fromRaw(10).pow(23)).toString(),
    ) + '%',
)
const totalStaked = computed(() =>
  trimStringNumber(
    BN.fromRaw(props.user.totalStaked).div(BN.fromRaw(10).pow(18)).toString(),
  ),
)
const totalClaimed = computed(() =>
  trimStringNumber(
    BN.fromRaw(props.user.totalClaimed).div(BN.fromRaw(10).pow(18)).toString(),
  ),
)

const showDelegateButton = () => {
  isDelegateButtonShown.value = true
}

const hideDelegateButton = () => {
  isDelegateButtonShown.value = false
}

const goToDelegatorPage = () => {
  router.push({
    name: ROUTE_NAMES.appDelegatorInfo,
    query: { subnetAddress: props.user.id },
  })
}

const delegate = () => {
  isDelegateModalShown.value = true
}
</script>

<style scoped lang="scss">
.delegation-providers-item {
  width: 100%;
  min-height: toRem(80);
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

  &--tertiary {
    border-image-source: var(--card-border-gradient-secondary-reversed);

    &:not([disabled]):hover,
    &:not([disabled]):focus,
    &:not([disabled]):active {
      border-image-source: var(--card-border-gradient-secondary-reversed);
    }
  }
}

.delegation-providers-item__content {
  flex: 1;
  display: grid;
  grid-template-columns:
    minmax(toRem(100), 1fr) repeat(3, minmax(toRem(80), 1fr))
    toRem(80);
  gap: toRem(36);
}

.delegation-providers-item__col {
  display: flex;
  gap: toRem(24);
  align-items: center;

  &--username {
    flex-direction: column;
    gap: toRem(4);
    align-items: flex-start;
  }
}

.delegation-providers-item__stake-button {
  padding: toRem(8) toRem(16);
  font-size: toRem(16);
  font-weight: 500;
}

.delegation-providers-item__row-name {
  font-weight: 600;
  transition: color 0.2s ease-in-out;
  text-align: left;
  display: flex;
  flex-direction: column;

  .delegation-providers-item:hover &,
  .delegation-providers-item:active &,
  .delegation-providers-item:focus & {
    color: var(--primary-main);
  }
}

.delegation-providers-item__row-address {
  font-size: toRem(18);
  font-weight: 600;
  transition: color 0.2s ease-in-out;

  .delegation-providers-item__col--username & {
    font-size: toRem(14);
    font-weight: 400;
    color: var(--text-tertiary-main);
  }

  .delegation-providers-item:hover &,
  .delegation-providers-item:active &,
  .delegation-providers-item:focus & {
    color: var(--primary-main);
  }
}

.delegation-providers-item__row-you {
  font-weight: 200;
  color: var(--primary-main);
}

.delegation-providers-item__text {
  transition: color 0.2s ease-in-out;

  .delegation-providers-item:hover &,
  .delegation-providers-item:active &,
  .delegation-providers-item:focus & {
    color: var(--primary-main);
  }
}
</style>
