<template>
  <select-field
    v-model="selectedBalance"
    class="wallet-balances"
    :is-loading="isBalancesUpdating"
  >
    <template v-if="selectedBalance" #head>
      <div
        v-tooltip="selectedBalance.value"
        class="wallet-balances__selected-balance"
      >
        <icon
          class="wallet-balances__balance-logo"
          :class="[
            `wallet-balances__balance-logo--${selectedBalance.logoIconName}`,
          ]"
          :name="selectedBalance.logoIconName"
        />
        <span class="wallet-balances__balance-value">
          {{ selectedBalance.value }}
        </span>
      </div>
    </template>
    <template #default="{ selectField }">
      <button
        v-for="(balance, idx) in balances"
        :key="idx"
        class="wallet-balances__balance"
        @click="selectField.select(balance)"
      >
        <icon
          class="wallet-balances__balance-logo"
          :class="[`wallet-balances__balance-logo--${balance.logoIconName}`]"
          :name="balance.logoIconName"
        />
        <span class="wallet-balances__balance-value">
          {{ balance.value }}
        </span>
        <icon
          class="wallet-balances__balance-token-icon"
          :name="balance.tokenIconName"
        />
      </button>
    </template>
  </select-field>
</template>

<script lang="ts" setup>
import { useContract } from '@/composables'
import { ETHEREUM_RPC_URLS, ICON_NAMES } from '@/enums'
import { SelectField } from '@/fields'
import { bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { formatEther } from '@/utils'
import { config } from '@config'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Icon from './Icon.vue'

type Balance = {
  logoIconName: ICON_NAMES
  value: string
  tokenIconName: ICON_NAMES
}

const { contractWithProvider: stEth } = useContract(
  'ERC20__factory',
  config.STETH_CONTRACT_ADDRESS,
  !config.IS_TESTNET ? ETHEREUM_RPC_URLS.ethereum : ETHEREUM_RPC_URLS.sepolia,
)

const { contractWithProvider: mor } = useContract(
  'ERC20__factory',
  config.MOR_CONTRACT_ADDRESS,
  !config.IS_TESTNET
    ? ETHEREUM_RPC_URLS.arbitrum
    : ETHEREUM_RPC_URLS.arbitrumSepolia,
)

const web3ProvidersStore = useWeb3ProvidersStore()

const balances = computed<Balance[]>(() => [
  {
    logoIconName: ICON_NAMES.steth,
    value: web3ProvidersStore.balances.stEth
      ? `${formatEther(web3ProvidersStore.balances.stEth)} stETH`
      : '',
    tokenIconName: ICON_NAMES.ethereum,
  },
  {
    logoIconName: ICON_NAMES.morpheus,
    value: web3ProvidersStore.balances.mor
      ? `${formatEther(web3ProvidersStore.balances.mor)} MOR`
      : '',
    tokenIconName: ICON_NAMES.arbitrum,
  },
])

const isBalancesUpdating = ref(false)
const updateBalances = async (): Promise<void> => {
  isBalancesUpdating.value = true

  try {
    if (!web3ProvidersStore.provider.selectedAddress)
      throw new Error('user address unavailable')

    const address = web3ProvidersStore.provider.selectedAddress

    const [stEthValue, morValue] = await Promise.all([
      stEth.value.balanceOf(address),
      mor.value.balanceOf(address),
    ])

    web3ProvidersStore.balances.stEth = stEthValue
    web3ProvidersStore.balances.mor = morValue
  } finally {
    isBalancesUpdating.value = false
  }
}

const selectedBalance = ref<Balance>(balances.value[0])

const init = async (): Promise<void> => {
  try {
    await updateBalances()
    selectedBalance.value = balances.value[0]
  } catch (error) {
    ErrorHandler.process(error)
  }
}

onMounted(() => {
  init()
  bus.on(BUS_EVENTS.changedUserBalance, init)
  bus.on(BUS_EVENTS.changedPoolUserData, init)
})

onBeforeUnmount(() => {
  bus.on(BUS_EVENTS.changedUserBalance, init)
  bus.off(BUS_EVENTS.changedPoolUserData, init)
})

watch(() => web3ProvidersStore.provider.selectedAddress, init)
</script>

<style lang="scss" scoped>
.wallet-balances {
  position: relative;
  height: toRem(48);
  background: var(--background-secondary-main);
  width: toRem(160);

  :deep(.select-field__select-head-indicator) {
    right: toRem(10);
  }

  :deep(.select-field__select-drop-menu) {
    top: 120%;

    @include respond-to(small) {
      left: unset;
      right: 0;
    }
  }
}

.wallet-balances__selected-balance {
  display: flex;
  align-items: center;
  padding: toRem(12) toRem(6) toRem(12) toRem(16);
  color: var(--text-secondary-light);
}

.wallet-balances__balance {
  display: flex;
  align-items: center;
  padding: toRem(12) toRem(16);
  color: var(--text-secondary-light);
  transition: var(--transition-duration-fast) var(--transition-timing-default);

  &:not([disabled]):hover,
  &:not([disabled]):focus,
  &:not([disabled]):active {
    background: var(--primary-main);
    color: var(--text-primary-dark);
  }
}

.wallet-balances__balance-logo {
  margin-right: toRem(12);
  height: toRem(26);
  width: toRem(20);

  &--steth {
    $color: #00a3ff;

    color: $color;
  }

  &--morpheus {
    $color: #ffffff;

    color: $color;
  }
}

.wallet-balances__balance-value {
  color: inherit;

  @include text-ellipsis;

  @include respond-to(medium) {
    font-family: var(--app-font-family);
    font-size: toRem(18);
    font-weight: 400;
    line-height: toRem(26);
    letter-spacing: 0;
  }
}

.wallet-balances .wallet-balances__balance-token-icon {
  margin-left: toRem(6);
  height: toRem(20);
  width: toRem(20);
  color: inherit;
}
</style>
