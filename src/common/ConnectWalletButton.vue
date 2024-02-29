<template>
  <app-button
    :text="text"
    :disabled="
      web3ProvidersStore.isConnected || web3ProvidersStore.provider.isConnecting
    "
    @click="onClick"
  />
</template>

<script lang="ts" setup>
import { useI18n } from '@/composables'
import { isMobile, ErrorHandler } from '@/helpers'
import { useRoute } from '@/router'
import { useWeb3ProvidersStore } from '@/store'
import { config } from '@config'
import { computed } from 'vue'
import AppButton from './AppButton.vue'

enum ACTIONS {
  toApp = 'to-app',
  toInstall = 'to-install',
  connect = 'connect',
}

const { t } = useI18n()
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

const text = computed<string>(
  () =>
    ({
      [ACTIONS.toApp]: t('connect-wallet-button.to-app'),
      [ACTIONS.toInstall]: t('connect-wallet-button.to-install'),
      [ACTIONS.connect]: t('connect-wallet-button.connect'),
    }[action.value]),
)

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
        window.open(config.WALLET_INSTALL_URL, '_blank', 'noreferrer')
        return
      case ACTIONS.connect:
        if (!web3ProvidersStore.provider.isConnected)
          await web3ProvidersStore.provider.connect()
        web3ProvidersStore.hasConnectedProvider = true
        return
      default:
        throw new Error('unknown case')
    }
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>
