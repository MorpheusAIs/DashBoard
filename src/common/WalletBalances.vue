<template>
  <select-field
    v-model="selectedIdx"
    class="wallet-balances"
    :is-loading="isInitializing"
  >
    <template v-if="selectedBalance" #head>
      <div
        v-tooltip="selectedBalance.value"
        class="wallet-balances__selected-balance"
      >
        <app-icon
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
        @click="selectField.select(idx)"
      >
        <app-icon
          class="wallet-balances__balance-logo"
          :class="[`wallet-balances__balance-logo--${balance.logoIconName}`]"
          :name="balance.logoIconName"
        />
        <span class="wallet-balances__balance-value">
          {{ balance.value }}
        </span>
        <app-icon
          class="wallet-balances__balance-token-icon"
          :name="balance.tokenIconName"
        />
      </button>
    </template>
  </select-field>
</template>

<script lang="ts" setup>
import { ICON_NAMES } from '@/enums'
import { SelectField } from '@/fields'
import { bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { formatEther } from '@/utils'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

type Balance = {
  logoIconName: ICON_NAMES
  value: string
  tokenIconName: ICON_NAMES
}

let _morUpdateIntervalId: Parameters<typeof clearInterval>[0]

const isInitializing = ref(true)
const selectedIdx = ref(0)

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

const selectedBalance = computed<Balance | null>(
  () => balances.value[selectedIdx.value] || null,
)

const updateBalances = async (): Promise<void> => {
  if (!web3ProvidersStore.provider.selectedAddress)
    throw new Error('user address unavailable')

  const address = web3ProvidersStore.provider.selectedAddress

  const [stEthValue, morValue] = await Promise.all([
    web3ProvidersStore.stEthContract.providerBased.value.balanceOf(address),
    web3ProvidersStore.morContract.providerBased.value.balanceOf(address),
  ])

  web3ProvidersStore.balances.stEth = stEthValue
  web3ProvidersStore.balances.mor = morValue
}

const init = async (): Promise<void> => {
  if (!web3ProvidersStore.provider.selectedAddress) {
    isInitializing.value = false
    return
  }

  isInitializing.value = true

  try {
    await updateBalances()
  } catch (error) {
    ErrorHandler.process(error)
  }

  isInitializing.value = false
}

const onChangeBalances = async () => {
  if (!web3ProvidersStore.provider.selectedAddress) return

  try {
    await updateBalances()
  } catch (error) {
    ErrorHandler.process(error)
  }
}

onMounted(() => {
  init()
  bus.on(BUS_EVENTS.changedUserBalance, onChangeBalances)
  bus.on(BUS_EVENTS.changedPoolData, onChangeBalances)
  bus.on(BUS_EVENTS.changedCurrentUserReward, onChangeBalances)
  _morUpdateIntervalId = setInterval(async () => {
    if (
      !web3ProvidersStore.isConnected ||
      !web3ProvidersStore.provider.selectedAddress
    )
      return
    const address = web3ProvidersStore.provider.selectedAddress

    try {
      web3ProvidersStore.balances.mor =
        await web3ProvidersStore.morContract.providerBased.value.balanceOf(
          address,
        )
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, 5 * 60 * 1000)
})

onBeforeUnmount(() => {
  bus.off(BUS_EVENTS.changedUserBalance, onChangeBalances)
  bus.off(BUS_EVENTS.changedPoolData, onChangeBalances)
  bus.off(BUS_EVENTS.changedCurrentUserReward, onChangeBalances)
  clearInterval(_morUpdateIntervalId)
})

watch(() => web3ProvidersStore.provider.selectedAddress, onChangeBalances)
watch(() => web3ProvidersStore.networkId, init)
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

  @include respond-to(medium) {
    width: toRem(220);
  }
}

.wallet-balances__selected-balance {
  display: flex;
  align-items: center;
  padding: 0 toRem(6) 0 toRem(16);
  color: var(--text-secondary-light);
  height: 100%;
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

  @include respond-to(medium) {
    height: toRem(28);
    width: toRem(28);
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
