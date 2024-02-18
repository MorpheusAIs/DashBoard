<template>
  <basic-modal
    v-bind="props"
    class="invalid-network-modal"
    :class="{ 'invalid-network-modal--mainnet': web3ProvidersStore.isMainnet }"
    :title="$t('invalid-network-modal.title')"
    :subtitle="$t('invalid-network-modal.subtitle')"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <div class="invalid-network-modal__board">
      <div class="invalid-network-modal__network-wrp">
        <app-icon
          class="invalid-network-modal__network-icon"
          :name="$icons.ethereumAlt1"
        />
        <span class="invalid-network-modal__network-title">
          <!-- eslint-disable-next-line vue-i18n/no-raw-text -->
          {{ web3ProvidersStore.isMainnet ? 'Ethereum' : 'Ethereum Sepolia' }}
        </span>
      </div>

      <!-- eslint-disable-next-line vue-i18n/no-raw-text -->
      <span class="invalid-network-modal__board-plus">{{ '+' }}</span>

      <div class="invalid-network-modal__network-wrp">
        <app-icon
          class="invalid-network-modal__network-icon"
          :name="$icons.arbitrumAlt1"
        />
        <span class="invalid-network-modal__network-title">
          <!-- eslint-disable-next-line vue-i18n/no-raw-text -->
          {{ web3ProvidersStore.isMainnet ? 'Arbitrum' : 'Arbitrum Sepolia' }}
        </span>
      </div>
    </div>
    <app-button
      class="invalid-network-modal__btn"
      :text="$t('invalid-network-modal.switch-btn')"
      :disabled="web3ProvidersStore.provider.isChainSelecting"
      @click="switchNetwork"
    />
  </basic-modal>
</template>

<script lang="ts" setup>
import { ETHEREUM_CHAINS } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import AppButton from '../../AppButton.vue'
import AppIcon from '../../AppIcon.vue'
import BasicModal from '../BasicModal.vue'

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    isShown: boolean
    isCloseByClickOutside?: boolean
    hasCloseButton?: boolean
  }>(),
  {
    isCloseByClickOutside: false,
    hasCloseButton: false,
  },
)

const web3ProvidersStore = useWeb3ProvidersStore()

const switchNetwork = async () => {
  try {
    await web3ProvidersStore.provider.selectChain(
      web3ProvidersStore.isMainnet
        ? ETHEREUM_CHAINS.ethereum
        : ETHEREUM_CHAINS.sepolia,
    )
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<style lang="scss" scoped>
.invalid-network-modal__board {
  margin-top: toRem(40);
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  grid-gap: toRem(10);
  border: toRem(1) solid var(--border-primary-main);
  background: var(--background-secondary-main);
  padding: toRem(16);

  @include respond-to(medium) {
    margin-top: toRem(28);
    padding: toRem(14);

    .invalid-network-modal:not(.invalid-network-modal--mainnet) & {
      grid-template-columns: auto;
      justify-items: center;
      grid-gap: toRem(4);
    }
  }
}

.invalid-network-modal__network-wrp {
  display: flex;
  align-items: center;
  gap: toRem(8);

  &:first-of-type {
    justify-self: end;
  }

  @include body-3-medium;

  @include respond-to(medium) {
    .invalid-network-modal:not(.invalid-network-modal--mainnet) & {
      &:first-of-type {
        justify-self: unset;
      }
    }
  }
}

.invalid-network-modal__network-title {
  font: inherit;
}

.invalid-network-modal__network-icon {
  height: toRem(28);
  width: toRem(28);

  @include respond-to(medium) {
    height: toRem(24);
    width: toRem(24);
  }
}

.invalid-network-modal__board-plus {
  color: var(--primary-main);
}

.invalid-network-modal .invalid-network-modal__btn {
  margin: toRem(40) auto 0;
  min-width: toRem(200);

  @include respond-to(medium) {
    margin: toRem(36) auto 0;
    min-width: toRem(162);
  }
}
</style>
