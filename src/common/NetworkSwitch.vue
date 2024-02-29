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
    <drop-menu v-model:is-shown="isDropMenuShown">
      <router-link
        v-for="(link, idx) in links"
        :key="idx"
        :to="link.route"
        class="network-switch__link"
      >
        {{ link.title }}
      </router-link>
    </drop-menu>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from '@/composables'
import { NETWORK_IDS, ROUTE_NAMES } from '@/enums'
import { useRouter } from '@/router'
import { useWeb3ProvidersStore } from '@/store'
import { Route } from '@/types'
import { onClickOutside } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import DropMenu from './DropMenu.vue'

type Link = {
  title: string
  route: Route
}

const MAINNET_ROUTES_MAP: Partial<Record<ROUTE_NAMES, ROUTE_NAMES>> = {
  [ROUTE_NAMES.appTestnetCapital]: ROUTE_NAMES.appMainnetCapital,
}

const TESTNET_ROUTES_MAP: Partial<Record<ROUTE_NAMES, ROUTE_NAMES>> = {
  [ROUTE_NAMES.appMainnetCapital]: ROUTE_NAMES.appTestnetCapital,
}

const rootElement = ref<HTMLDivElement | null>(null)
const isDropMenuShown = ref(false)

const { t } = useI18n()
const { currentRoute } = useRouter()
const web3ProvidersStore = useWeb3ProvidersStore()

const links = computed<Link[]>(() => [
  {
    title: t('network-switch.mainnet'),
    route: {
      name:
        MAINNET_ROUTES_MAP[currentRoute.value.name as ROUTE_NAMES] ||
        ROUTE_NAMES.appMainnet,
    },
  },
  {
    title: t('network-switch.testnet'),
    route: {
      name:
        TESTNET_ROUTES_MAP[currentRoute.value.name as ROUTE_NAMES] ||
        ROUTE_NAMES.appTestnet,
    },
  },
])

const networkTitle = computed<string>(
  () =>
    ({
      [NETWORK_IDS.mainnet]: t('network-switch.mainnet'),
      [NETWORK_IDS.testnet]: t('network-switch.testnet'),
    }[web3ProvidersStore.networkId]),
)

onMounted(() => {
  onClickOutside(rootElement, () => {
    isDropMenuShown.value = false
  })
})
</script>

<style lang="scss" scoped>
.network-switch {
  position: relative;
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

.network-switch__link {
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
