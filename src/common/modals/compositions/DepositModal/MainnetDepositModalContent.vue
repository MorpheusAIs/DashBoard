<template>
  <div class="mainnet-deposit-modal-content">
    <button
      v-if="currentStep !== STEPS.chooseAssetStep"
      class="mainnet-deposit-modal-content__back-btn"
      @click="goBack"
      aria-label="Back to asset selection"
    >
      <app-icon
        class="mainnet-deposit-modal-content__back-btn-icon"
        :name="$icons.arrowLeft"
      />
    </button>
    <p
      v-if="currentStep !== STEPS.chooseAssetStep"
      class="mainnet-deposit-modal-content__lbl"
    >
      <span
        :class="
          mergeClasses(
            'mainnet-deposit-modal-content__lbl',
            'mainnet-deposit-modal-content__lbl--highlighted',
          )
        "
      >
        {{ lblText.lbl }}
      </span>
      {{ lblText.text }}
    </p>
    <component
      :is="chosenComponent"
      :chosen-asset="chosenAsset"
      :pool-id="poolId"
      :min-stake="minStake"
      :default-date="defaultDate"
      @stake-tx-sent="emit('cancel')"
      @asset-chosen="chooseAsset"
      @cancel="emit('cancel')"
      @next-step="increaseStep"
      @swap-success="moveToDepositTab"
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
import { useI18n } from '@/composables'
import { mergeClasses } from '@/helpers'
import AppIcon from '@/common/AppIcon.vue'

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
  defaultDate?: string
}>()

const { t } = useI18n()

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

const lblText = computed(() =>
  currentStep.value === STEPS.deposit
    ? {
        lbl: t('mainnet-deposit-modal-content.deposit-lbl'),
        text: t('mainnet-deposit-modal-content.deposit-txt', {
          asset: chosenAsset.value,
        }),
      }
    : {
        lbl: t('mainnet-deposit-modal-content.swap-lbl'),
        text: t('mainnet-deposit-modal-content.swap-txt', {
          input: chosenAsset.value,
          output: SWAP_ASSETS_NAMES.STETH,
        }),
      },
)

const chooseAsset = (e: SWAP_ASSETS_NAMES) => {
  chosenAsset.value = e
}

const increaseStep = () => {
  currentStep.value =
    chosenAsset.value === SWAP_ASSETS_NAMES.STETH ? STEPS.deposit : STEPS.swap
}

const moveToDepositTab = () => {
  currentStep.value = STEPS.deposit
}

const goBack = () => {
  currentStep.value = STEPS.chooseAssetStep
}
</script>

<style scoped lang="scss">
.mainnet-deposit-modal-content__lbl {
  font-size: toRem(20);
  line-height: toRem(30);
  margin: toRem(32) 0 toRem(24);

  &--highlighted {
    color: var(--primary-main);
  }

  @include respond-to(medium) {
    text-align: center;
  }
}

.mainnet-deposit-modal-content__back-btn {
  position: absolute;
  top: toRem(36);
  left: toRem(48);

  @include respond-to(medium) {
    top: toRem(16);
    left: toRem(16);
  }
}

.mainnet-deposit-modal-content__back-btn-icon {
  height: toRem(24);
  width: toRem(24);
  color: var(--text-secondary-light);
  transition: var(--transition-duration-fast) var(--transition-timing-default);

  .mainnet-deposit-modal-content__back-btn:not([disabled]):hover &,
  .mainnet-deposit-modal-content__back-btn:not([disabled]):focus &,
  .mainnet-deposit-modal-content__back-btn:not([disabled]):active & {
    $color: #1ab479;

    color: $color;
  }
}
</style>
