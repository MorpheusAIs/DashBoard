<template>
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
    <invalid-network-modal
      v-model:is-shown="isShownInvalidNetworkModal"
      is-close-by-click-outside
    />
  </div>
</template>

<script lang="ts" setup>
import { AppNavbar, AppNavbarMobile, InvalidNetworkModal } from '@/common'

import { ref, watch } from 'vue'
import { useNotifications } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import { config } from '@config'
import { bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { NotificationPayload } from '@/types'

const web3ProvidersStore = useWeb3ProvidersStore()

const isAppInitialized = ref(false)
const isShownInvalidNetworkModal = ref(false)

const { showToast } = useNotifications()

const init = async () => {
  try {
    document.title = config.APP_NAME

    initNotifications()
  } catch (error) {
    ErrorHandler.process(error)
  }
  isAppInitialized.value = true
}

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

init()

watch(
  () => web3ProvidersStore.isConnectedProvider,
  () => {
    isShownInvalidNetworkModal.value = true
  },
)
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
