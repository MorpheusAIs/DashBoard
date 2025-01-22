<template>
  <div
    ref="rootElement"
    class="network-switch"
    :class="{ 'network-switch--open': isDropMenuShown }"
  >
    <div v-tooltip="networkTitle" class="network-switch__head-wrp">
      <span class="network-switch__network-title">
        {{ networkTitle }}
      </span>
      <app-icon
        class="network-switch__head-indicator"
        :name="$icons.chevronDown"
      />
      <button
        class="network-switch__head-btn"
        @click="isDropMenuShown = !isDropMenuShown"
      />
    </div>
    <drop-menu v-model:is-shown="isDropMenuShown" class="dropdown-menu">
      <button
        v-for="(el, idx) in mainnetItems"
        :key="idx"
        :class="
          cn(
            'network-switch__item',
            String(web3ProvidersStore.provider.chainId) ===
              String(el.chainId) && 'brightness-200',
          )
        "
        @click="el.onClick"
      >
        {{ el.title }}
      </button>

      <div class="h-2" />

      <button
        v-for="(el, idx) in testnetItems"
        :key="idx"
        :class="
          cn(
            'network-switch__item',
            String(web3ProvidersStore.provider.chainId) ===
              String(el.chainId) && 'brightness-200',
          )
        "
        @click="el.onClick"
      >
        {{ el.title }}
      </button>
    </drop-menu>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import { Route } from '@/types'
import { onClickOutside } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import DropMenu from './DropMenu.vue'
import { config, getEthereumChainsName, NetworkTypes } from '@config'
import { useRouter } from 'vue-router'
import { cn } from '@/theme/utils'

type Link = {
  chainId: string
  title: string
  onClick: () => void
}

const rootElement = ref<HTMLDivElement | null>(null)
const isDropMenuShown = ref(false)

const { t } = useI18n()
const web3ProvidersStore = useWeb3ProvidersStore()
const router = useRouter()

const safeSelectNetwork = (chainId: string) => {
  if (String(web3ProvidersStore.provider.chainId) === chainId) return

  web3ProvidersStore.provider.selectChain(chainId)
}

const mainnetItems = computed<Link[]>(() => {
  const route = { query: { network: NetworkTypes.Mainnet } } as Route

  const forCurrentRouteChainsLimitedByMainnet =
    web3ProvidersStore.getForCurrentRouteChainsLimitedByNetworkType(
      NetworkTypes.Mainnet,
    )

  if (forCurrentRouteChainsLimitedByMainnet.length === 1) {
    return [
      {
        chainId: forCurrentRouteChainsLimitedByMainnet[0],
        title: t('network-switch.mainnet'),
        onClick: () => {
          if (web3ProvidersStore.networkType !== NetworkTypes.Mainnet) {
            router.push(route)
          }

          safeSelectNetwork(forCurrentRouteChainsLimitedByMainnet[0])
        },
      },
    ]
  }

  return forCurrentRouteChainsLimitedByMainnet.map(el => {
    const chainName = config.chainsMap[getEthereumChainsName(el)].chainName

    return {
      chainId: el,
      title: chainName,
      onClick: () => {
        if (web3ProvidersStore.networkType !== NetworkTypes.Mainnet) {
          router.push(route)
        }

        safeSelectNetwork(el)
      },
    }
  })
})

const testnetItems = computed<Link[]>(() => {
  const route = { query: { network: NetworkTypes.Testnet } } as Route

  const forCurrentRouteChainsLimitedByTestnet =
    web3ProvidersStore.getForCurrentRouteChainsLimitedByNetworkType(
      NetworkTypes.Testnet,
    )

  if (forCurrentRouteChainsLimitedByTestnet.length === 1) {
    return [
      {
        chainId: forCurrentRouteChainsLimitedByTestnet[0],
        title: t('network-switch.testnet'),
        onClick: () => {
          if (web3ProvidersStore.networkType !== NetworkTypes.Testnet) {
            router.push(route)
          }

          safeSelectNetwork(forCurrentRouteChainsLimitedByTestnet[0])
        },
      },
    ]
  }

  return forCurrentRouteChainsLimitedByTestnet.map(el => {
    const chainName = config.chainsMap[getEthereumChainsName(el)].chainName

    return {
      chainId: el,
      title: chainName,
      onClick: () => {
        if (web3ProvidersStore.networkType !== NetworkTypes.Testnet) {
          router.push(route)
        }

        safeSelectNetwork(el)
      },
    }
  })
})

const networkTitle = computed<string>(
  () =>
    ({
      [NetworkTypes.Mainnet]: t('network-switch.mainnet'),
      [NetworkTypes.Testnet]: t('network-switch.testnet'),
    })[web3ProvidersStore.networkType],
)

onMounted(() => {
  onClickOutside(rootElement, () => {
    isDropMenuShown.value = false
  })
})
</script>

<style lang="scss">
.dropdown-menu {
  background: none;
}

.network-switch {
  position: relative;
  background: var(--background-secondary-main);
  height: toRem(48);
  max-width: toRem(140);
  width: 100%;

  :deep(.select-field__select-head-indicator) {
    right: toRem(10);
  }

  @include respond-to(medium) {
    max-width: toRem(220);
  }
}

.network-switch__head-wrp {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 toRem(34) 0 toRem(16);
  height: 100%;
  color: var(--text-secondary-light);
}

.network-switch__head-indicator {
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: toRem(10);
  transform: translateY(-50%);
  width: toRem(24);
  height: toRem(24);
  transition: var(--field-transition-duration) var(--field-transition-timing);
  color: inherit;

  .network-switch--open & {
    transform: translateY(-50%) rotate(180deg);
  }
}

.network-switch__head-btn {
  position: absolute;
  inset: 0;
  width: 100%;
}

.network-switch__network-title {
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

.network-switch__item {
  $shadow-hover: 0 toRem(4) toRem(24) rgba(#ffffff, 0.25);
  background: var(--field-bg-primary);

  padding: toRem(12) toRem(16);
  color: var(--text-secondary-light);
  transition: var(--transition-duration-fast) var(--transition-timing-default);
  text-align: left;

  &:not([disabled]):hover {
    background: #515c57;
    box-shadow: $shadow-hover;
  }

  &:not([disabled]):focus,
  &:not([disabled]):active {
    background: #515c57;
    box-shadow:
      $shadow-hover,
      inset 0 toRem(4) toRem(4) rgba(#000000, 0.25);
  }

  @include text-ellipsis;

  @include respond-to(medium) {
    font-family: var(--app-font-family);
    font-size: toRem(18);
    font-weight: 400;
    line-height: toRem(26);
    letter-spacing: 0;
  }
}
</style>
