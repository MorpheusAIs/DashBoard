<template>
  <app-button @click="connect" />
</template>

<script lang="ts" setup>
import { useWeb3ProvidersStore } from '@/store'
import AppButton from './AppButton.vue'

const web3ProvidersStore = useWeb3ProvidersStore()

const connect = () => {
  web3ProvidersStore.isConnectedProvider = true
}
</script>
