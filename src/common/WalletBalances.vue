<template>
  <div
    ref="rootElement"
    class="wallet-balances"
    :class="{
      'wallet-balances--open': isDropMenuShown,
      'wallet-balances--loading': isInitializing,
    }"
  >
    <div v-tooltip="selectedBalance?.value" class="wallet-balances__head-wrp">
      <template v-if="selectedBalance">
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
      </template>
      <app-icon
        class="wallet-balances__head-indicator"
        :name="$icons.chevronDown"
      />
      <button
        class="wallet-balances__head-btn"
        @click="isDropMenuShown = !isDropMenuShown"
      />
    </div>
    <drop-menu v-model:is-shown="isDropMenuShown">
      <button
        v-for="(balance, idx) in balances"
        :key="idx"
        class="wallet-balances__balance"
        @click="onSelectBtnClick(idx)"
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
          class="wallet-balances__balance-network-icon"
          :name="balance.tokenIconName"
        />
      </button>
    </drop-menu>
  </div>
</template>

<script lang="ts" setup>
import { DropMenu } from '@/common'
import { ICON_NAMES } from '@/enums'
import { bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { formatEther } from '@/utils'
import { onClickOutside } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

type Balance = {
  logoIconName: ICON_NAMES
  value: string
  tokenIconName: ICON_NAMES
}
let _morUpdateIntervalId: NodeJS.Timeout

const rootElement = ref<HTMLDivElement | null>(null)
const isDropMenuShown = ref(false)
const isInitializing = ref(true)

const web3ProvidersStore = useWeb3ProvidersStore()

const balances = computed<Balance[]>(() => [
  {
    logoIconName: ICON_NAMES.steth,
    value: web3ProvidersStore.balances.depositToken
      ? `${formatEther(web3ProvidersStore.balances.depositToken)} ${
          web3ProvidersStore.depositTokenSymbol
        }`
      : '',
    tokenIconName: ICON_NAMES.ethereum,
  },
  {
    logoIconName: ICON_NAMES.morpheus,
    value: web3ProvidersStore.balances.rewardsToken
      ? `${formatEther(web3ProvidersStore.balances.rewardsToken)} ${
          web3ProvidersStore.rewardsTokenSymbol
        }`
      : '',
    tokenIconName: ICON_NAMES.arbitrum,
  },
])

const selectedBalanceIdx = ref(0)
const selectedBalance = computed<Balance | null>(
  () => balances.value[selectedBalanceIdx.value] || null,
)

const onSelectBtnClick = (balanceIdx: number) => {
  selectedBalanceIdx.value = balanceIdx
  isDropMenuShown.value = false
}

const init = async (): Promise<void> => {
  if (!web3ProvidersStore.provider.selectedAddress) {
    isInitializing.value = false
    return
  }

  isInitializing.value = true

  try {
    await web3ProvidersStore.updateBalances()
  } catch (error) {
    ErrorHandler.process(error)
  }

  isInitializing.value = false
}

const onChangeBalances = async () => {
  if (!web3ProvidersStore.provider.selectedAddress) return

  try {
    await web3ProvidersStore.updateBalances()
  } catch (error) {
    ErrorHandler.process(error)
  }
}

onClickOutside(rootElement, () => {
  isDropMenuShown.value = false
})

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
      web3ProvidersStore.balances.rewardsToken =
        await web3ProvidersStore.rewardsContract.providerBased.value.balanceOf(
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

watch(() => web3ProvidersStore.networkId, init)
</script>

<style lang="scss" scoped>
.wallet-balances {
  position: relative;
  height: toRem(48);
  background: var(--background-secondary-main);
  width: toRem(160);

  &--loading {
    &:before {
      $z-index: 2;

      z-index: $z-index;
    }

    @include skeleton;

    border-radius: 0;
  }

  :deep(.select-field__select-head-indicator) {
    right: toRem(10);
  }

  @include respond-to(medium) {
    width: toRem(220);
  }
}

.wallet-balances__head-wrp {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 toRem(34) 0 toRem(16);
  height: 100%;
  color: var(--text-secondary-light);
}

.wallet-balances__balance {
  $shadow-hover: 0 toRem(4) toRem(24) rgba(#ffffff, 0.25);

  display: flex;
  align-items: center;
  padding: toRem(12) toRem(16);
  color: var(--text-secondary-light);
  transition: var(--transition-duration-fast) var(--transition-timing-default);

  &:not([disabled]):hover {
    background: #515c57;
    box-shadow: $shadow-hover;
  }

  &:not([disabled]):focus,
  &:not([disabled]):active {
    background: #515c57;
    box-shadow: $shadow-hover, inset 0 toRem(4) toRem(4) rgba(#000000, 0.25);
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

.wallet-balances__head-indicator {
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: toRem(10);
  transform: translateY(-50%);
  width: toRem(24);
  height: toRem(24);
  transition: var(--field-transition-duration) var(--field-transition-timing);
  color: inherit;

  .wallet-balances--open & {
    transform: translateY(-50%) rotate(180deg);
  }
}

.wallet-balances__head-btn {
  position: absolute;
  inset: 0;
  width: 100%;
}

.wallet-balances__balance-network-icon {
  margin-left: toRem(6);
  height: toRem(20);
  width: toRem(20);
  color: inherit;
}
</style>
