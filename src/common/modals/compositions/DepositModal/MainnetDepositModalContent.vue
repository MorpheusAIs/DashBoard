<template>
  <div class="mainnet-deposit-modal-content">
    <component
      :is="chosenComponent"
      :chosen-asset="chosenAsset"
      @asset-chosen="chooseAsset"
      @cancel="emit('cancel')"
      @next-step="increaseStep"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ChooseAssetStep from './ChooseAssetStep.vue'
import SwapStep from './SwapStep.vue'
import { SWAP_ASSETS_NAMES } from '@/enums'
import { DepositForm } from '@/forms'
import { BigNumber } from '@/utils'

enum STEPS {
  chooseAssetStep,
  deposit,
  swap,
}

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

defineProps<{
  poolId: number
  minStake: BigNumber
}>()

const currentStep = ref(STEPS.chooseAssetStep)
const chosenAsset = ref<SWAP_ASSETS_NAMES | ''>('')

const chosenComponent = computed(() => {
  switch (currentStep.value) {
    case STEPS.chooseAssetStep:
      return ChooseAssetStep
    case STEPS.deposit:
      return DepositForm
    default:
      return SwapStep
  }
})

const chooseAsset = (e: SWAP_ASSETS_NAMES) => {
  chosenAsset.value = e
}

const increaseStep = () => {
  currentStep.value =
    chosenAsset.value === SWAP_ASSETS_NAMES.STETH ? STEPS.deposit : STEPS.swap
}
</script>

<style scoped lang="scss"></style>
