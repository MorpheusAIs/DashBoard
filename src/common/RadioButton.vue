<template>
  <app-button
    color="none"
    size="none"
    :class="radioClasses"
    :text="option.label"
    @click="emitSelection"
  >
    <template #nodeLeft>
      <div class="radio-button__circle" />
    </template>
  </app-button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { AppButton } from '@/common'

const props = defineProps<{
  modelValue: string
  option: { label: string; value: string }
  isChosen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const radioClasses = computed(() =>
  [
    'radio-button',
    ...(props.isChosen ? ['radio-button--active'] : []),
    ...(props.modelValue ? ['radio-button--chosen'] : []),
  ].join(' '),
)

const emitSelection = () => {
  emit('update:modelValue', props.option.value)
}
</script>

<style scoped lang="scss">
.radio-button {
  width: 100%;
  background: transparent;
  border: toRem(1) solid #7a7a7a;
  padding: toRem(20);
  gap: toRem(10);
  justify-content: flex-start;
  font-size: toRem(18);
  transition: opacity 0.2s ease-in-out;
  opacity: 1;

  &--chosen {
    opacity: 0.4;
  }

  &--active {
    opacity: 1;
  }

  &:not([disabled]):hover,
  &:not([disabled]):focus,
  &:not([disabled]):active {
    opacity: 0.6;
    border: toRem(1) solid #7a7a7a;
  }
}

.radio-button__circle {
  position: relative;
  width: toRem(16);
  height: toRem(16);
  border-radius: 50%;
  border: toRem(1) solid #7a7a7a;
  transition: border 0.2s ease-in-out;

  .radio-button--active & {
    border: toRem(2) solid var(--primary-main);

    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: toRem(8);
      height: toRem(8);
      border-radius: 50%;
      background: var(--primary-main);
    }
  }
}
</style>
