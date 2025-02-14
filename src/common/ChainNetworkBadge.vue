<template>
  <div class="flex items-center gap-2">
    <img
      class="size-5"
      :src="chainDetails?.iconUrls?.[0]"
      :alt="chainDetails?.chainName"
    />

    <span class="font-bold text-textSecondaryMain typography-body3">
      {{ chainDetails?.chainName }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { config, EthereumChains, getEthereumChainsName } from '@config'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    chain?: EthereumChains
  }>(),
  {
    chain: EthereumChains.Ethereum,
  },
)

const chainDetails = computed(() => {
  if (!props.chain) return undefined

  return config.chainsMap[getEthereumChainsName(props.chain)]
})
</script>

<style scoped lang="scss"></style>
