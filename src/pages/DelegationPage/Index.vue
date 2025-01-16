<template>
  <div class="delegation">
    <delegation-description />
    <delegation-providers />
  </div>
</template>

<script setup lang="ts">
import DelegationDescription from './components/DelegationDescription.vue'
import DelegationProviders from './components/DelegationProviders.vue'
import { useWeb3ProvidersStore } from '@/store'

const web3ProvidersStore = useWeb3ProvidersStore()

web3ProvidersStore.provider.selectChain(
  web3ProvidersStore.selectedNetworkByType.l2.chainId,
)
</script>

<style scoped lang="scss"></style>
