<template>
  <app-button
    :text="$t('connect-wallet-button.connect')"
    :disabled="web3ProvidersStore.isConnected"
    @click="onClick"
  />
</template>

<script lang="ts" setup>
import { ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import AppButton from './AppButton.vue'

const web3ProvidersStore = useWeb3ProvidersStore()

const onClick = async () => {
  if (!web3ProvidersStore.provider.isConnected) {
    try {
      await web3ProvidersStore.provider.connect()
    } catch (error) {
      ErrorHandler.process(error)
    }
  }
}
</script>
