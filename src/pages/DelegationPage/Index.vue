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
import { useExceptionContractsProvider } from '@/composables'
import { watch } from 'vue'

const web3ProvidersStore = useWeb3ProvidersStore()

const DelegationPageProvider = useExceptionContractsProvider('DelegationPage')

watch(DelegationPageProvider.value.network, () => {
  if (DelegationPageProvider.value.network === undefined) {
    return
  }

  web3ProvidersStore.provider.selectChain(
    String(DelegationPageProvider.value.network.chainId),
  )
})
</script>

<style scoped lang="scss"></style>
