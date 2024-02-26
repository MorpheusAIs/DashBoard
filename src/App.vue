<template>
  <transition name="fade">
    <div v-if="isAppInitialized" class="app__container">
      <app-navbar class="app__navbar" :class="['app__navbar--desktop']" />
      <app-navbar-mobile class="app__navbar" :class="['app__navbar--mobile']" />
      <div class="app__page-wrp">
        <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transition || 'fade'" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
      <invalid-network-modal v-model:is-shown="isShownInvalidNetworkModal" />
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { AppNavbar, AppNavbarMobile, InvalidNetworkModal } from '@/common'
import { useNotifications } from '@/composables'
import { NETWORKS } from '@/const'
import { bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { type NotificationPayload } from '@/types'
import { config } from '@config'
import { ref, watch } from 'vue'

const isAppInitialized = ref(false)
const isShownInvalidNetworkModal = ref(false)

const { showToast } = useNotifications()
const web3ProvidersStore = useWeb3ProvidersStore()

watch(
  [
    () => web3ProvidersStore.isValidChain,
    () => web3ProvidersStore.provider.isConnected,
    () => isAppInitialized.value,
  ],
  ([isValidChain, isConnected]) => {
    if (isConnected) isShownInvalidNetworkModal.value = !isValidChain
  },
)

watch(
  () => web3ProvidersStore.networkId,
  async () => {
    if (web3ProvidersStore.isConnected) {
      try {
        await web3ProvidersStore.provider.selectChain(
          NETWORKS[web3ProvidersStore.networkId].chainId,
        )
      } catch (error) {
        ErrorHandler.process(error)
      }
    }
  },
)

const initNotifications = () => {
  bus.on(BUS_EVENTS.success, payload =>
    showToast('success', payload as NotificationPayload),
  )
  bus.on(BUS_EVENTS.warning, payload =>
    showToast('warning', payload as NotificationPayload),
  )
  bus.on(BUS_EVENTS.error, payload =>
    showToast('error', payload as NotificationPayload),
  )
  bus.on(BUS_EVENTS.info, payload =>
    showToast('info', payload as NotificationPayload),
  )
}

const init = async () => {
  try {
    document.title = config.NAME

    initNotifications()
    await web3ProvidersStore.init()
  } catch (error) {
    ErrorHandler.process(error)
  }

  document.querySelector('#app')?.classList.add('app--initialized')
  isAppInitialized.value = true
}

init()
</script>

<style lang="scss" scoped>
.app__container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.app .app__navbar {
  &--desktop {
    @include respond-to(medium) {
      display: none;
    }
  }

  &--mobile {
    display: none;

    @include respond-to(medium) {
      display: flex;
    }
  }
}

.app__page-wrp {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: var(--app-navbar-height);
}
</style>
