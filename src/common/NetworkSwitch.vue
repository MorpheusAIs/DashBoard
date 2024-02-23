<template>
  <select-field
    class="network-switch"
    :model-value="network"
    @update:model-value="onNetworkUpdate"
  >
    <template v-if="network" #head>
      <div v-tooltip="network.title" class="network-switch__head-wrp">
        <span class="network-switch__network">
          {{ network.title }}
        </span>
      </div>
    </template>
    <template #default="{ selectField }">
      <button
        v-for="(networkOption, idx) in networkOptions"
        :key="idx"
        class="network-switch__network-option"
        @click="selectField.select(networkOption)"
      >
        <span class="network-switch__network-option-text">
          {{ networkOption.title }}
        </span>
      </button>
    </template>
  </select-field>
</template>

<script lang="ts" setup>
import { useContext } from '@/composables'
import { NETWORK_IDS } from '@/enums'
import { SelectField } from '@/fields'
import { ErrorHandler } from '@/helpers'
import { useRouter } from '@/router'
import { useWeb3ProvidersStore } from '@/store'
import { type FieldOption } from '@/types'
import { computed } from 'vue'

const { $networks, $routes, $t } = useContext()
const { currentRoute, push: pushRoute } = useRouter()
const web3ProvidersStore = useWeb3ProvidersStore()

const networkOptions = computed<FieldOption<NETWORK_IDS>[]>(() => [
  {
    title: $t('network-switch.mainnet'),
    value: NETWORK_IDS.mainnet,
  },
  {
    title: $t('network-switch.testnet'),
    value: NETWORK_IDS.testnet,
  },
])

const network = computed<FieldOption<NETWORK_IDS> | null>(
  () =>
    networkOptions.value.find(
      option => option.value === web3ProvidersStore.networkId,
    ) || null,
)

const onNetworkUpdate = async (networkOption: FieldOption<NETWORK_IDS>) => {
  try {
    switch (networkOption.value) {
      case NETWORK_IDS.mainnet: {
        switch (currentRoute.value.name) {
          case $routes.appTestnetCapital:
            await pushRoute({ name: $routes.appMainnetCapital })
            break
          default:
            await pushRoute({ name: $routes.appMainnet })
        }

        break
      }

      case NETWORK_IDS.testnet: {
        switch (currentRoute.value.name) {
          case $routes.appMainnetCapital:
            await pushRoute({ name: $routes.appTestnetCapital })
            break
          default:
            await pushRoute({ name: $routes.appTestnet })
        }
      }
    }

    if (web3ProvidersStore.isConnected) {
      await web3ProvidersStore.provider.selectChain(
        $networks[web3ProvidersStore.networkId].chainId,
      )
    }
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<style lang="scss" scoped>
.network-switch {
  background: var(--background-secondary-main);
  height: toRem(48);
  width: toRem(220);

  :deep(.select-field__select-head-indicator) {
    right: toRem(10);
  }

  @include respond-to(xmedium) {
    width: toRem(116);
  }

  @include respond-to(medium) {
    width: toRem(220);
  }
}

.network-switch__head-wrp {
  display: flex;
  align-items: center;
  height: 100%;
}

.network-switch__network {
  padding: 0 toRem(6) 0 toRem(16);
  color: var(--text-secondary-light);

  @include text-ellipsis;

  @include respond-to(medium) {
    font-family: var(--app-font-family);
    font-size: toRem(18);
    font-weight: 400;
    line-height: toRem(26);
    letter-spacing: 0;
  }
}

.network-switch__network-option {
  padding: toRem(12) toRem(16);
  color: var(--text-secondary-light);
  transition: var(--transition-duration-fast) var(--transition-timing-default);
  text-align: left;

  &:not([disabled]):hover,
  &:not([disabled]):focus,
  &:not([disabled]):active {
    background: var(--primary-main);
    color: var(--text-primary-dark);
  }
}

.network-switch__network-option-text {
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
</style>
