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

enum ACTIONS {
  toApp = 'to-app',
  toInstall = 'to-install',
  connect = 'connect',
}

const WALLET_INSTALL_URL = 'https://metamask.io/download/'

const { $t } = useContext()
const { fullPath } = useRoute()

const web3ProvidersStore = useWeb3ProvidersStore()

const action = computed<ACTIONS>(() => {
  switch (true) {
    case !web3ProvidersStore.provider.selectedProvider && isMobile():
      return ACTIONS.toApp
    case !web3ProvidersStore.provider.selectedProvider:
      return ACTIONS.toInstall
    default:
      return ACTIONS.connect
  }
})

const text = computed<string>(() => {
  switch (action.value) {
    case ACTIONS.toApp:
      return $t('connect-wallet-button.to-app')
    case ACTIONS.toInstall:
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
    switch (action.value) {
      case ACTIONS.toApp:
        window.open(appUrl.value, '_top', 'noreferrer')
        return
      case ACTIONS.toInstall:
        window.open(WALLET_INSTALL_URL, '_blank', 'noreferrer')
        return
      case ACTIONS.connect:
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
