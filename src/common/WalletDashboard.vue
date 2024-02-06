<template>
  <select-field model-value="" class="wallet-dashboard">
    <template #head>
      <div
        v-tooltip="web3ProvidersStore.address"
        class="wallet-dashboard__head-wrp"
      >
        <div ref="jazziconWrpElement" class="wallet-dashboard__jazzicon-wrp" />
        <p class="wallet-dashboard__address">
          {{ abbrCenter(web3ProvidersStore.address) }}
        </p>
      </div>
    </template>
    <template #default>
      <button
        v-for="(option, idx) in options"
        :key="idx"
        class="wallet-dashboard__option"
        @click="option.onClick"
      >
        <span class="wallet-dashboard__option-text">{{ option.title }}</span>
      </button>
    </template>
  </select-field>
</template>

<script lang="ts" setup>
import { useContext } from '@/composables'
import { ETHEREUM_CHAINS } from '@/enums'
import { abbrCenter, bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { SelectField } from '@/fields'
import { useWeb3ProvidersStore } from '@/store'
import { useClipboard } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
import generateJazzicon from 'jazzicon'

const jazziconWrpElement = ref<HTMLDivElement | null>(null)

const { $config, $t } = useContext()
const { copy } = useClipboard()
const web3ProvidersStore = useWeb3ProvidersStore()

const setJazzicon = () => {
  if (!jazziconWrpElement.value) return
  jazziconWrpElement.value.innerHTML = ''
  jazziconWrpElement.value.append(
    generateJazzicon(28, parseInt(web3ProvidersStore.address.slice(2, 10), 16)),
  )
}

const copyAddressToClipboard = async () => {
  try {
    await copy(web3ProvidersStore.address)
    bus.emit(BUS_EVENTS.info, $t('wallet-dashboard.address-copied'))
  } catch (error) {
    ErrorHandler.process(error)
  }
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

const disconnect = async () => {
  try {
    await web3ProvidersStore.provider.disconnect()
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const options = [
  {
    title: $t('wallet-dashboard.add-token'),
    onClick: addToken,
  },
  {
    title: $t('wallet-dashboard.disconnect'),
    onClick: disconnect,
  },
]

watch(() => web3ProvidersStore.address, setJazzicon)

onMounted(setJazzicon)
</script>

<style lang="scss" scoped>
.wallet-dashboard {
  background: var(--background-secondary-main);
  height: toRem(48);
  width: toRem(200);

  :deep(.select-field__select-head-indicator) {
    right: toRem(10);
  }

  :deep(.select-field__select-drop-menu) {
    top: 120%;
    left: unset;
    right: 0;

    @include respond-to(medium) {
      left: 0;
      right: unset;
    }
  }
}

.wallet-dashboard__head-wrp {
  display: flex;
  align-items: center;
  padding: 0 toRem(6) 0 toRem(16);
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
