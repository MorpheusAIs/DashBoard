<template>
  <div class="choose-asset-step">
    <h3 class="choose-asset-step__title">
      {{ $t('choose-asset-step.title') }}
    </h3>
    <div class="choose-asset-step__radio-buttons">
      <radio-button
        v-for="button in radioButtonOptions"
        v-model="chosenRadioButton"
        :key="button.label"
        :option="button"
        :is-chosen="button.value === chosenRadioButton"
      />
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

const radioButtonOptions = computed(() =>
  SWAP_ASSETS.map(({ symbol }) => ({ value: symbol, label: symbol })),
)

watch(chosenRadioButton, () => emit('asset-chosen', chosenRadioButton.value))
</script>

<style scoped lang="scss">
.choose-asset-step__title {
  text-align: center;
  font-size: toRem(20);
  font-weight: 400;
  margin: toRem(32) 0;
}

.choose-asset-step__radio-buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(toRem(200), 1fr));
  gap: toRem(16);

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
