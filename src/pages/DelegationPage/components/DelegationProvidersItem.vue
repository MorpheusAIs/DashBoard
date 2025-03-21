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
    <div
      class="delegation-providers-item__content"
      :class="{
        'delegation-providers-item__content--with-btn': isDelegateButtonShown,
      }"
    >
      <div
        class="delegation-providers-item__col"
        :class="{
          'delegation-providers-item__col--with-img': localImage,
        }"
      >
        <template v-if="localImage">
          <img
            class="delegation-providers-item__col delegation-providers-item__img"
            :src="localImage"
            alt="Subnet logo"
            width="48"
            height="48"
          />
        </template>
        <div class="delegation-providers-item__col-name">
          <span class="delegation-providers-item__row-name">
            <span v-if="isYou" class="delegation-providers-item__row-you">
              {{ $t('delegation-providers-item.you-text') }}
            </span>
            {{ user.name }}
          </span>

          <span class="delegation-providers-item__row-address">
            {{ abbrCenter(user.id) }}
          </span>
        </div>
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
    </div>
    <div
      class="delegation-providers-item__stake-button-wrp"
      :class="{
        'delegation-providers-item__stake-button-wrp--hidden':
          !isDelegateButtonShown,
      }"
    >
      <app-button
        class="delegation-providers-item__stake-button"
        size="none"
        color="secondary"
        :text="$t('delegation-providers-item.stake-button')"
        @click.stop="delegate"
      />
    </div>
    <delegate-tokens-modal
      v-model:is-shown="isDelegateModalShown"
      :delegate-address="user.id"
      :deregistration-date="user.deregistrationOpensAt"
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
import predefinedSubnetsMeta from '@/assets/predefined-subnets-meta.json'

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

const localImage = computed(() => {
  const predefinedSubnet = predefinedSubnetsMeta.find(
    subnet => subnet.name.toLowerCase() === props.user.name.toLowerCase(),
  )
  return predefinedSubnet?.localImage
})

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
  min-width: fit-content;
  width: 100%;
  min-height: toRem(80);
  padding: toRem(16) toRem(32);
  position: relative;
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
  grid-template-columns: minmax(toRem(180), 1fr) repeat(
      3,
      minmax(toRem(70), 1fr)
    );
  gap: toRem(16);
  transition: 0.1s;
}

.delegation-providers-item__col {
  @include text-ellipsis;

  display: flex;
  gap: toRem(24);
  align-items: center;

  &--with-img {
    gap: toRem(8);
  }
}

.delegation-providers-item__col-name {
  display: flex;
  flex-direction: column;
  gap: toRem(4);
  align-items: flex-start;
}

.delegation-providers-item__img {
  max-width: toRem(48);
  max-height: toRem(48);
  min-width: toRem(48);
  min-height: toRem(48);
  width: 100%;
  height: 100%;
}

.delegation-providers-item__stake-button-wrp {
  position: absolute;
  right: toRem(32);
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s ease-in-out,
    visibility 0.2s ease-in-out;
  z-index: 1;

  &--hidden {
    opacity: 0;
    visibility: hidden;
  }

  .delegation-providers-item:hover & {
    opacity: 1;
    visibility: visible;
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
  font-size: toRem(14);
  font-weight: 400;
  color: var(--text-tertiary-main);
  transition: color 0.2s ease-in-out;

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
