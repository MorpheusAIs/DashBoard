<template>
  <div class="choose-asset-step">
    <h3 class="choose-asset-step__title">
      {{ $t('choose-asset-step.title') }}
    </h3>
    <!-- Direct Deposit Section -->
    <div class="choose-asset-step__section">
      <h4 class="choose-asset-step__section-title">
        {{ $t('choose-asset-step.direct-deposit') || 'Direct Deposit' }}
      </h4>
      <p class="choose-asset-step__section-description">
        {{
          $t('choose-asset-step.direct-deposit-description') ||
          'This token can be deposited directly without swapping.'
        }}
      </p>
      <div
        class="choose-asset-step__radio-buttons choose-asset-step__radio-buttons--direct"
      >
        <radio-button
          v-model="chosenRadioButton"
          :option="{
            value: SWAP_ASSETS_NAMES.STETH,
            label: SWAP_ASSETS_NAMES.STETH,
          }"
          :is-chosen="SWAP_ASSETS_NAMES.STETH === chosenRadioButton"
        />
      </div>
    </div>
    <!-- Swap First Section -->
    <div class="choose-asset-step__section">
      <h4 class="choose-asset-step__section-title">
        {{ $t('choose-asset-step.swap-first') || 'Swap First' }}
      </h4>
      <p class="choose-asset-step__section-description">
        {{
          $t('choose-asset-step.swap-first-description') ||
          'These tokens need to be swapped to stETH before depositing.'
        }}
      </p>
      <div class="choose-asset-step__radio-buttons">
        <radio-button
          v-for="button in swapRadioButtonOptions"
          v-model="chosenRadioButton"
          :key="button.label"
          :option="button"
          :is-chosen="button.value === chosenRadioButton"
        />
      </div>
    </div>
    <div class="choose-asset-step__buttons">
      <app-button
        class="choose-asset-step__button"
        color="secondary"
        :text="$t('choose-asset-step.cancel-btn')"
        @click="emit('cancel')"
      />
      <app-button
        class="choose-asset-step__button"
        :text="$t('choose-asset-step.next-btn')"
        :disabled="!chosenRadioButton"
        @click="emit('next-step')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppButton, RadioButton } from '@/common'
import { computed, ref, watch } from 'vue'
import { SWAP_ASSETS } from '@/const'
import { SWAP_ASSETS_NAMES } from '@/enums'

const emit = defineEmits<{
  (event: 'cancel'): void
  (event: 'next-step'): void
  (event: 'asset-chosen', value: SWAP_ASSETS_NAMES): void
}>()

const chosenRadioButton = ref<SWAP_ASSETS_NAMES | ''>('')

const swapRadioButtonOptions = computed(() =>
  SWAP_ASSETS.filter(({ symbol }) => symbol !== SWAP_ASSETS_NAMES.STETH).map(
    ({ symbol }) => ({ value: symbol, label: symbol }),
  ),
)

watch(chosenRadioButton, () => {
  if (!chosenRadioButton.value) return

  emit('asset-chosen', chosenRadioButton.value)
})
</script>

<style scoped lang="scss">
.choose-asset-step__title {
  text-align: center;
  font-size: toRem(20);
  font-weight: 400;
  margin: toRem(32) 0 toRem(16);
}

.choose-asset-step__section {
  margin-bottom: toRem(10);
  padding: toRem(12);
  border-radius: toRem(8);
  background-color: var(--surface-light);
}

.choose-asset-step__section-title {
  font-size: toRem(18);
  font-weight: 500;
  margin-bottom: toRem(8);
  color: var(--primary-main);
}

.choose-asset-step__section-description {
  font-size: toRem(14);
  color: var(--text-secondary);
  margin-bottom: toRem(16);
}

.choose-asset-step__radio-buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(toRem(200), 1fr));
  gap: toRem(16);

  &--direct {
    grid-template-columns: minmax(toRem(200), 1fr);
  }

  @include respond-to(medium) {
    grid-template-columns: repeat(1, 1fr);
  }
}

.choose-asset-step__buttons {
  display: flex;
  justify-content: center;
  gap: toRem(16);
  margin-top: toRem(40);
}

.choose-asset-step__button {
  width: toRem(200);
}
</style>
