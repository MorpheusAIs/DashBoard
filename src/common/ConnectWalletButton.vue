<template>
  <app-button
    :text="text"
    :disabled="
      web3ProvidersStore.provider.isConnected ||
      web3ProvidersStore.provider.isConnecting
    "
    @click="onClick"
  />
</template>

<script lang="ts" setup>
import { useContext } from '@/composables'
import { isMobile, ErrorHandler } from '@/helpers'
import { useRoute } from '@/router'
import { useWeb3ProvidersStore } from '@/store'
import { computed } from 'vue'
import AppButton from './AppButton.vue'

enum CLICK_ACTIONS {
  toApp = 'to-app',
  toInstall = 'to-install',
  connect = 'connect',
}

const WALLET_INSTALL_URL = 'https://metamask.io/download/'

const { $t } = useContext()
const { fullPath } = useRoute()

const web3ProvidersStore = useWeb3ProvidersStore()

const clickAction = computed<CLICK_ACTIONS>(() => {
  switch (true) {
    case !web3ProvidersStore.provider.selectedProvider && isMobile():
      return CLICK_ACTIONS.toApp
    case !web3ProvidersStore.provider.selectedProvider:
      return CLICK_ACTIONS.toInstall
    default:
      return CLICK_ACTIONS.connect
  }
})

const text = computed<string>(() => {
  switch (clickAction.value) {
    case CLICK_ACTIONS.toApp:
      return $t('connect-wallet-button.to-app')
    case CLICK_ACTIONS.toInstall:
      return $t('connect-wallet-button.to-install')
    default:
      return $t('connect-wallet-button.default')
  }
})

const appUrl = computed<string>(
  () => `https://metamask.app.link/dapp/${window.location.host}${fullPath}`,
)

const onClick = async () => {
  try {
    switch (clickAction.value) {
      case CLICK_ACTIONS.toApp:
        window.open(appUrl.value, '_top', 'noreferrer')
        return
      case CLICK_ACTIONS.toInstall:
        window.open(WALLET_INSTALL_URL, '_blank', 'noreferrer')
        return
      case CLICK_ACTIONS.connect:
        await web3ProvidersStore.provider.connect()
        return
      default:
        throw new Error('unknown case')
    }
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>
