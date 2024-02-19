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
import { SelectField } from '@/fields'
import { ErrorHandler } from '@/helpers'
import { useRouter } from '@/router'
import { useWeb3ProvidersStore } from '@/store'
import { type FieldOption } from '@/types'
import { computed } from 'vue'

enum Networks {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

const { $routes, $t } = useContext()
const { currentRoute, push: pushRoute } = useRouter()
const web3ProvidersStore = useWeb3ProvidersStore()

const networkOptions = computed<FieldOption<Networks>[]>(() => [
  {
    title: $t('network-switch.mainnet'),
    value: Networks.mainnet,
  },
  {
    title: $t('network-switch.testnet'),
    value: Networks.testnet,
  },
])

const network = computed<FieldOption<Networks>>(() =>
  web3ProvidersStore.isMainnet
    ? networkOptions.value[0]
    : networkOptions.value[1],
)

const onNetworkUpdate = async (networkOption: FieldOption<Networks>) => {
  try {
    if (networkOption.value === Networks.mainnet) {
      switch (currentRoute.value.name) {
        case $routes.appTestnetCapital:
          await pushRoute({ name: $routes.appMainnetCapital })
          return
        default:
          await pushRoute({ name: $routes.appMainnet })
          return
      }
    }

    switch (currentRoute.value.name) {
      case $routes.appMainnetCapital:
        await pushRoute({ name: $routes.appTestnetCapital })
        break
      default:
        await pushRoute({ name: $routes.appTestnet })
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
