<template>
  <div v-tooltip="web3ProvidersStore.address" class="wallet-dashboard">
    <div ref="jazziconWrpElement" class="wallet-dashboard__jazzicon-wrp" />
    <p class="wallet-dashboard__address">
      {{ abbrCenter(web3ProvidersStore.address) }}
    </p>
    <button class="wallet-dashboard__copy-btn" @click="onCopyBtnClick" />
  </div>
</template>

<script lang="ts" setup>
import { useContext } from '@/composables'
import { abbrCenter, bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { useClipboard } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
import generateJazzicon from 'jazzicon'

const jazziconWrpElement = ref<HTMLDivElement | null>(null)

const { $t } = useContext()
const { copy } = useClipboard()
const web3ProvidersStore = useWeb3ProvidersStore()

const setJazzicon = () => {
  if (!jazziconWrpElement.value) return
  jazziconWrpElement.value.innerHTML = ''
  jazziconWrpElement.value.append(
    generateJazzicon(28, parseInt(web3ProvidersStore.address.slice(2, 10), 16)),
  )
}

const onCopyBtnClick = async () => {
  try {
    await copy(web3ProvidersStore.address)
    bus.emit(BUS_EVENTS.info, $t('wallet-dashboard.address-copied'))
  } catch (error) {
    ErrorHandler.process(error)
  }
}

watch(() => web3ProvidersStore.address, setJazzicon)

onMounted(setJazzicon)
</script>

<style lang="scss" scoped>
.wallet-dashboard {
  position: relative;
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

.wallet-dashboard__copy-btn {
  position: absolute;
  inset: 0;
}
</style>
