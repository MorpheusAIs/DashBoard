<template>
  <app-button
    :disabled="
      web3ProvidersStore.provider.isConnected ||
      web3ProvidersStore.provider.isConnecting
    "
    @click="connect"
  />
</template>

<script lang="ts" setup>
import { ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import AppButton from './AppButton.vue'

const web3ProvidersStore = useWeb3ProvidersStore()

const connect = async () => {
  try {
    await web3ProvidersStore.provider.connect()
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>
