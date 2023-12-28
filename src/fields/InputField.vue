<template>
  <div class="input-field" :class="inputClasses">
    <div class="input-field__input-wrp">
      <div
        v-if="$slots.nodeLeft"
        ref="nodeLeftWrp"
        class="input-field__node-left-wrp"
      >
        <slot name="nodeLeft" />
      </div>
      <input
        ref="inputEl"
        class="input-field__input"
        :id="`input-field--${uid}`"
        v-bind="$attrs"
        v-on="listeners"
        :value="modelValue"
        :placeholder="!label ? placeholder : ' '"
        :tabindex="isDisabled || isReadonly ? -1 : ($attrs.tabindex as number)"
        :type="inputType"
        :min="min"
        :max="max"
        :disabled="isDisabled || isReadonly"
      />
      <label
        v-if="label"
        :for="`input-field--${uid}`"
        class="input-field__label"
      >
        {{ label }}
      </label>
      <div
        v-if="$slots.nodeRight || isPasswordType || props.errorMessage"
        ref="nodeRightWrp"
        class="input-field__node-right-wrp"
      >
        <slot v-if="$slots.nodeRight" name="nodeRight" />
        <button
          v-else-if="isPasswordType"
          type="button"
          @click="isPasswordShown = !isPasswordShown"
        >
          <icon
            class="input-field__password-icon"
            :name="isPasswordShown ? ICON_NAMES.eye : ICON_NAMES.eyeOff"
          />
        </button>
        <icon
          v-else-if="props.errorMessage"
          class="input-field__error-icon"
          :name="ICON_NAMES.exclamationCircle"
        />
      </div>
    </div>
    <transition
      name="input-field__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <span v-if="errorMessage" class="input-field__err-msg">
        {{ errorMessage }}
      </span>
      <span v-else-if="note" class="input-field__note-msg">
        {{ note }}
      </span>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { BN, DECIMALS } from '@distributedlab/tools'
import { computed, onMounted, ref, useAttrs, useSlots } from 'vue'

import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'
import { v4 as uuidv4 } from 'uuid'

const props = withDefaults(
  defineProps<{
    scheme?: 'primary'
    modelValue: string | number
    label?: string
    placeholder?: string
    type?: 'text' | 'number' | 'password'
    errorMessage?: string
    note?: string
  }>(),
  {
    scheme: 'primary',
    type: 'text',
    label: '',
    placeholder: ' ',
    errorMessage: '',
    note: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
}>()

const attrs = useAttrs()

const slots = useSlots()

const uid = uuidv4()

const inputEl = ref<HTMLInputElement>()
const nodeLeftWrp = ref<HTMLDivElement>()
const nodeRightWrp = ref<HTMLDivElement>()

const isPasswordShown = ref(false)

const isNumberType = computed(() => props.type === 'number')
const isPasswordType = computed(() => props.type === 'password')

const min = computed((): string =>
  !isNaN(Number(attrs?.min)) && attrs?.min !== '' ? (attrs.min as string) : '',
)
const max = computed((): string =>
  !isNaN(Number(attrs?.max)) && attrs?.max !== '' ? (attrs.max as string) : '',
)

const isDisabled = computed(() =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const isReadonly = computed(() =>
  ['', 'readonly', true].includes(attrs.readonly as string | boolean),
)

const listeners = computed(() => ({
  input: (event: Event) => {
    const eventTarget = event.target as HTMLInputElement

    if (isNumberType.value) {
      eventTarget.value = normalizeRange(normalizeNumber(eventTarget.value))
    }
    if (props.modelValue === eventTarget.value) return

    emit('update:modelValue', eventTarget.value)
  },
}))

const inputClasses = computed(() =>
  [
    ...(slots.nodeLeft ? ['input-field--node-left'] : []),
    ...(slots.nodeRight || isPasswordType.value || props.errorMessage
      ? ['input-field--node-right']
      : []),
    ...(isDisabled.value ? ['input-field--disabled'] : []),
    ...(isReadonly.value ? ['input-field--readonly'] : []),
    ...(props.errorMessage ? ['input-field--error'] : []),
    `input-field--${props.scheme}`,
  ].join(' '),
)

const inputType = computed(() => {
  if (isPasswordType.value) {
    return isPasswordShown.value ? 'text' : 'password'
  }
  return 'text'
})

onMounted(() => {
  if (!inputEl.value) return

  if (slots?.nodeLeft && nodeLeftWrp.value) {
    inputEl.value?.style.setProperty(
      'padding-left',
      `calc(${
        nodeLeftWrp.value?.offsetWidth || 0
      }px + var(--field-padding-left) * 2)`,
    )
  }

  if (slots?.nodeRight && nodeRightWrp.value) {
    inputEl.value?.style.setProperty(
      'padding-right',
      `calc(${
        nodeRightWrp.value?.offsetWidth || 0
      }px + var(--field-padding-right) * 2)`,
    )
  }
})

const normalizeNumber = (value: string) => {
  return isNaN(Number(value)) ? props.modelValue : value
}

const normalizeRange = (value: string | number): string => {
  let result = value

  if (
    String(min.value) &&
    BN.fromRaw(value, DECIMALS.WEI).lt(BN.fromRaw(min.value, DECIMALS.WEI))
  ) {
    result = min.value
  } else if (
    String(max.value) &&
    BN.fromRaw(value, DECIMALS.WEI).gt(BN.fromRaw(max.value, DECIMALS.WEI))
  ) {
    result = max.value
  }

  return result as string
}

const setHeightCSSVar = (element: Element) => {
  ;(element as HTMLElement).style.setProperty(
    '--field-error-msg-height',
    `${element.scrollHeight}px`,
  )
}
</script>

<style lang="scss" scoped>
$z-index-side-nodes: 1;

.input-field {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;

  &--disabled,
  &--readonly {
    opacity: 0.5;
  }
}

.input-field__label {
  pointer-events: none;
  position: absolute;
  padding: toRem(4);
  top: 0;
  left: var(--field-padding-left);
  font-size: toRem(12);
  line-height: 1.3;
  font-weight: 700;
  background: var(--field-bg-primary);
  transform: translateY(-50%);

  @include field-label;

  .input-field__input:not(:placeholder-shown) ~ & {
    top: 0;
    color: var(--field-text);
    border-color: var(--field-border-hover);
  }

  .input-field__input:not(:focus):placeholder-shown ~ & {
    top: 50%;

    @include field-label;

    .input-field--node-left & {
      left: calc(var(--field-padding-left) * 3);
    }
  }

  .input-field--error .input-field__input:not(:focus):placeholder-shown ~ & {
    color: var(--field-error);
  }

  /* stylelint-disable-next-line */
  .input-field__input:not([disabled]):focus ~ & {
    color: var(--field-label-focus);
    font-weight: 700;
  }

  .input-field__input:not(:focus):placeholder-shown:-webkit-autofill ~ & {
    top: 50%;
    color: var(--field-label);
    font-size: toRem(16);
    font-weight: 400;
    line-height: 1.3;

    .input-field--node-left & {
      left: calc(var(--field-padding-left) * 3);
    }
  }
}

.input-field__input-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
}

.input-field__input {
  padding: var(--field-padding);
  background: var(--field-bg-primary);
  box-shadow: inset 0 0 0 toRem(50) var(--field-bg-primary);
  border: none;

  @include field-text;

  .input-field--primary & {
    @include field-border;
  }

  transition-property: all;

  &::-webkit-input-placeholder {
    @include field-placeholder;
  }

  &::-moz-placeholder {
    @include field-placeholder;
  }

  &:-moz-placeholder {
    @include field-placeholder;
  }

  &:-ms-input-placeholder {
    @include field-placeholder;
  }

  &::placeholder {
    @include field-placeholder;
  }

  // Hide number arrows
  &[type='number'] {
    -moz-appearance: textfield;

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .input-field--node-left & {
    padding-left: calc(var(--field-padding-left) * 3);
  }

  .input-field--node-right & {
    padding-right: calc(var(--field-padding-right) * 3);
  }

  .input-field--error.input-field--primary & {
    border-color: var(--field-error);
    box-shadow: inset 0 0 0 toRem(50) var(--field-bg-primary),
      0 0 0 toRem(1) var(--field-error);
  }

  &:not([disabled]):focus {
    .input-field--primary & {
      box-sizing: border-box;
      box-shadow: inset 0 0 0 toRem(50) var(--field-bg-primary),
        0 0 0 toRem(1) var(--field-border-focus);
      border-color: var(--field-border-focus);
    }
  }

  &:not([disabled]):not(:focus):hover {
    .input-field--primary & {
      border-color: var(--field-border-hover);
    }
  }
}

.input-field__node-left-wrp {
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: var(--field-padding-left);
  transform: translateY(-50%);
  color: inherit;
  max-height: 100%;
  z-index: $z-index-side-nodes;
}

.input-field__node-right-wrp {
  position: absolute;
  top: 50%;
  right: var(--field-padding-right);
  transform: translateY(-50%);
  color: inherit;
  z-index: $z-index-side-nodes;
}

.input-field__password-icon {
  max-width: toRem(24);
  max-height: toRem(24);
}

.input-field__error-icon {
  max-width: toRem(24);
  max-height: toRem(24);
  color: var(--field-error);
}

.input-field__icon {
  width: toRem(18);
  height: toRem(18);
}

.input-field__err-msg,
.input-field__note-msg {
  @include field-error;
}

.input-field__note-msg {
  color: var(--text-primary-light);
}

.input-field__err-msg-transition-enter-active {
  animation: fade-down var(--field-transition-duration);
}

.input-field__err-msg-transition-leave-active {
  animation: fade-down var(--field-transition-duration) reverse;
}

@keyframes fade-down {
  from {
    height: 0;
  }

  to {
    height: var(--field-error-msg-height);
  }
}
</style>
