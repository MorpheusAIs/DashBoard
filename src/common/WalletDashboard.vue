<template>
  <div class="wallet-dashboard">
    <div ref="jazziconWrpElement" class="wallet-dashboard__jazzicon-wrp" />
    <p class="wallet-dashboard__address">
      {{ abbrCenter(web3ProvidersStore.address) }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { abbrCenter } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { onMounted, ref, watch } from 'vue'
import generateJazzicon from 'jazzicon'

const web3ProvidersStore = useWeb3ProvidersStore()

const jazziconWrpElement = ref<HTMLDivElement | null>(null)

const setJazzicon = () => {
  if (!jazziconWrpElement.value) return
  jazziconWrpElement.value.innerHTML = ''
  jazziconWrpElement.value.append(
    generateJazzicon(28, parseInt(web3ProvidersStore.address.slice(2, 10), 16)),
  )
}

watch(() => web3ProvidersStore.address, setJazzicon)

onMounted(setJazzicon)
</script>

<style lang="scss" scoped>
.wallet-dashboard {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(12);
  background: var(--background-secondary-main);
  padding: toRem(10) 0;
  width: toRem(170);

  @include respond-to(medium) {
    width: toRem(160);
  }
}

.wallet-dashboard__address {
  @include respond-to(medium) {
    font-family: var(--app-font-family);
    font-size: toRem(18);
    font-weight: 400;
    line-height: toRem(26);
    letter-spacing: 0;
  }
}

.wallet-dashboard__jazzicon-wrp {
  display: flex;
}
</style>
