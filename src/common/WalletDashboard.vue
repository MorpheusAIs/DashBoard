<template>
  <div
    ref="rootElement"
    class="wallet-dashboard"
    :class="{ 'wallet-dashboard--open': isDropMenuOpen }"
  >
    <div
      v-tooltip="web3ProvidersStore.address"
      class="wallet-dashboard__head-wrp"
    >
      <div ref="jazziconWrpElement" class="wallet-dashboard__jazzicon-wrp" />
      <p class="wallet-dashboard__head-address">
        {{ abbrCenter(web3ProvidersStore.address) }}
      </p>
      <app-icon
        class="wallet-dashboard__head-indicator"
        :name="$icons.chevronDown"
      />
      <button
        class="wallet-dashboard__open-btn"
        @click="isDropMenuOpen = !isDropMenuOpen"
      />
    </div>
    <drop-menu v-model:is-shown="isDropMenuOpen">
      <div class="wallet-dashboard__address-wrp">
        <p class="wallet-dashboard__address">
          {{ abbrCenter(web3ProvidersStore.address, 9) }}
        </p>
        <copy-button
          :content="web3ProvidersStore.address"
          :message="$t('wallet-dashboard.address-copied')"
        />
      </div>
      <button
        v-for="(option, idx) in options"
        :key="idx"
        class="wallet-dashboard__option"
        @click="option.onClick"
      >
        <span class="wallet-dashboard__option-text">{{ option.title }}</span>
      </button>
    </drop-menu>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from '@/composables'
import { abbrCenter, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { onClickOutside } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
import generateJazzicon from 'jazzicon'
import AppIcon from './AppIcon.vue'
import CopyButton from './CopyButton.vue'
import DropMenu from './DropMenu.vue'

const jazziconWrpElement = ref<HTMLDivElement | null>(null)
const isDropMenuOpen = ref(false)
const rootElement = ref<HTMLDivElement | null>(null)

const { t } = useI18n()
const web3ProvidersStore = useWeb3ProvidersStore()

const setJazzicon = () => {
  if (!jazziconWrpElement.value) return
  jazziconWrpElement.value.innerHTML = ''
  jazziconWrpElement.value.append(
    generateJazzicon(28, parseInt(web3ProvidersStore.address.slice(2, 10), 16)),
  )
}

const addToken = async () => {
  web3ProvidersStore.isAddingToken = true

  try {
    await web3ProvidersStore.provider.selectChain(
      web3ProvidersStore.rewardsContractDetails.targetChainId,
    )

    await web3ProvidersStore.provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: web3ProvidersStore.rewardsContractDetails.address,
          symbol: 'MOR',
          decimals: 18,
          image: window.location.origin.concat('/branding/mor-token-image.png'),
        },
      },
    })
  } catch (error) {
    ErrorHandler.process(error)
  }

  web3ProvidersStore.isAddingToken = false
}

const disconnect = async () => {
  try {
    await web3ProvidersStore.provider.disconnect()
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const options = [
  {
    title: t('wallet-dashboard.add-token'),
    onClick: addToken,
  },
  {
    title: t('wallet-dashboard.disconnect'),
    onClick: disconnect,
  },
]

watch(() => web3ProvidersStore.address, setJazzicon)

onMounted(() => {
  setJazzicon()
  if (rootElement.value)
    onClickOutside(rootElement, () => {
      isDropMenuOpen.value = false
    })
})
</script>

<style lang="scss" scoped>
.wallet-dashboard {
  position: relative;
  background: var(--background-secondary-main);
  height: toRem(48);
  width: toRem(92);

  @include respond-to(medium) {
    width: toRem(220);
  }
}

.wallet-dashboard__head-wrp {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 toRem(6) 0 toRem(16);
  height: 100%;
  color: var(--text-secondary-light);
}

.wallet-dashboard__head-address {
  display: none;

  @include respond-to(medium) {
    display: block;
    font-family: var(--app-font-family);
    font-size: toRem(18);
    font-weight: 400;
    line-height: toRem(26);
    letter-spacing: 0;
  }
}

.wallet-dashboard__head-indicator {
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: toRem(4);
  transform: translateY(-50%);
  width: toRem(24);
  height: toRem(24);
  transition: var(--field-transition-duration) var(--field-transition-timing);
  color: inherit;

  .wallet-dashboard--open & {
    transform: translateY(-50%) rotate(180deg);
  }
}

.wallet-dashboard__open-btn {
  position: absolute;
  inset: 0;
  width: 100%;
}

.wallet-dashboard__address {
  @include respond-to(medium) {
    font-family: var(--app-font-family);
    font-size: toRem(18);
    font-weight: 400;
    line-height: toRem(26);
    letter-spacing: 0;
  }
}

.wallet-dashboard__jazzicon-wrp {
  display: flex;
  margin-right: toRem(28);
}

.wallet-dashboard__address-wrp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(8);
  height: toRem(48);
  padding: 0 toRem(16);
}

.wallet-dashboard__option {
  $shadow-hover: 0 toRem(4) toRem(24) rgba(#ffffff, 0.25);

  display: flex;
  align-items: center;
  height: toRem(48);
  padding: 0 toRem(16);
  color: var(--text-secondary-light);
  transition: var(--transition-duration-fast) var(--transition-timing-default);
  border-bottom: toRem(1) solid transparent;

  &:not(:last-child) {
    $border-color: #48544f;

    border-color: $border-color;
  }

  &:not([disabled]):hover {
    $background-color: #515c57;

    background: $background-color;
    border-color: $background-color;
    box-shadow: $shadow-hover;
  }

  &:not([disabled]):focus,
  &:not([disabled]):active {
    $background-color: #515c57;

    background: $background-color;
    border-color: $background-color;
    box-shadow:
      $shadow-hover,
      inset 0 toRem(4) toRem(4) rgba(#000000, 0.25);
  }
}

.wallet-dashboard__option-text {
  color: inherit;

  @include respond-to(medium) {
    font-family: var(--app-font-family);
    font-size: toRem(18);
    font-weight: 400;
    line-height: toRem(26);
    letter-spacing: 0;
  }
}
</style>
