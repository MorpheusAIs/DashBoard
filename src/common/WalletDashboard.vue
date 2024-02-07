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
      <p class="wallet-dashboard__address">
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
        <p>{{ abbrCenter(web3ProvidersStore.address, 9) }}</p>
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
import { useContext } from '@/composables'
import { ETHEREUM_CHAINS } from '@/enums'
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

const { $config, $t } = useContext()
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
      $config.IS_MAINNET
        ? ETHEREUM_CHAINS.arbitrum
        : ETHEREUM_CHAINS.arbitrumSepolia,
    )

    await web3ProvidersStore.provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: $config.MOR_CONTRACT_ADDRESS,
          symbol: 'MOR',
          decimals: 18,
          image: window.location.origin.concat('/branding/mor-token-image.png'),
        },
      },
    })

    await web3ProvidersStore.provider.selectChain(
      $config.IS_MAINNET ? ETHEREUM_CHAINS.ethereum : ETHEREUM_CHAINS.sepolia,
    )
  } catch (error) {
    ErrorHandler.process(error)
  }

  web3ProvidersStore.isAddingToken = false
}

const options = [
  {
    title: $t('wallet-dashboard.add-token'),
    onClick: addToken,
  },
  {
    title: $t('wallet-dashboard.disconnect'),
    onClick: () => {
      web3ProvidersStore.hasConnectedProvider = false
    },
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
  width: toRem(200);

  :deep(.drop-menu) {
    left: unset;
    right: 0;

    @include respond-to(medium) {
      left: 0;
      right: unset;
    }
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

.wallet-dashboard__head-indicator {
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: toRem(10);
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
  margin-right: toRem(12);
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

  &:not([disabled]):hover,
  &:not([disabled]):focus,
  &:not([disabled]):active {
    background: var(--primary-main);
    border-color: var(--primary-main);
    color: var(--text-primary-dark);
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
