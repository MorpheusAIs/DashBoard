<template>
  <label
    class="checkbox-field"
    :class="{
      'checkbox-field--disabled': disabled,
      'checkbox-field--checked': modelValue,
    }"
  >
    <input
      v-bind="$attrs"
      class="checkbox-field__input"
      type="checkbox"
      :checked="modelValue"
      :name="($attrs.name as string) || label"
      :value="value"
      :disabled="disabled"
      @change="onChange"
    />

    <span class="checkbox-field__frame-wrp" aria-hidden="true">
      <app-icon class="checkbox-field__frame-icon" :name="$icons.check" />
    </span>

    <span class="checkbox-field__label">
      {{ label }}
    </span>
  </label>
</template>

<script lang="ts" setup>
import { AppIcon } from '@/common'

const emit = defineEmits<{
  (event: 'update:model-value', value: boolean): void
}>()

withDefaults(
  defineProps<{
    modelValue: boolean
    label?: string
    value?: string | number
    disabled?: boolean
  }>(),
  {
    label: '',
    value: '',
    disabled: false,
  },
)

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement

  emit('update:model-value', target.checked)
}
</script>

<style lang="scss" scoped>
$border-color: #cccccc;
$border-color-disabled: #434343;
$border-color-checked-disabled: #cccccc;
$background-color-checked-disabled: #cccccc;
$outline-color: #434343;

.checkbox-field {
  cursor: pointer;
  display: grid;
  align-items: center;
  grid-template-columns: max-content 1fr;
  grid-gap: toRem(12);
  max-width: max-content;

  &--disabled {
    cursor: not-allowed;
  }

  @include respond-to(medium) {
    grid-gap: toRem(6);
  }
}

.checkbox-field__input {
  position: absolute;
  width: toRem(1);
  height: toRem(1);
  margin: toRem(1);
  border: 0;
  padding: 0;
  white-space: nowrap;
  clip-path: inset(100%);
  clip: rect(0 0 0 0);
  overflow: hidden;
}

.checkbox-field__frame-wrp {
  width: toRem(24);
  height: toRem(24);
  transition: var(--field-transition-duration) var(--field-transition-timing);
  transition-property: border-color, background-color, outline-color;
  outline: transparent solid toRem(2);
  border: toRem(2) solid $border-color;

  .checkbox-field--checked & {
    border-color: var(--primary-main);
    background: var(--primary-main);
  }

  .checkbox-field--disabled & {
    border-color: $border-color-disabled;
  }

  .checkbox-field--disabled.checkbox-field--checked & {
    border-color: $border-color-checked-disabled;
    background-color: $background-color-checked-disabled;
  }

  .checkbox-field:not(.checkbox-field--disabled):hover & {
    border-color: var(--primary-main);
  }

  .checkbox-field:not(.checkbox-field--disabled):focus-within & {
    outline-color: $outline-color;
  }

  @include respond-to(medium) {
    height: toRem(20);
    width: toRem(20);
  }
}

.checkbox-field__frame-icon {
  height: 100%;
  width: 100%;
  color: var(--black);
  transition: var(--field-transition-duration) var(--field-transition-timing);
  transition-property: color, opacity;
  opacity: 0;

  .checkbox-field--checked & {
    opacity: 1;
  }

  .checkbox-field--disabled & {
    color: var(--text-secondary-light);
  }
}

.checkbox-field__label {
  font-family: var(--field-text-font-family);
  font-size: var(--field-text-font-size);
  font-weight: var(--field-text-font-weight);
  line-height: var(--field-text-line-height);
  letter-spacing: var(--field-text-letter-spacing);
  color: var(--field-text);
  user-select: none;

  .checkbox-field--disabled & {
    color: var(--field-text-readonly);
  }
}
</style>
