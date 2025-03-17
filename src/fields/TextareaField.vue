<template>
  <div class="textarea" :class="inputClasses">
    <label v-if="label" :for="`textarea--${uid}`" class="textarea__label">
      {{ label }}
    </label>
    <div class="textarea__input-wrp">
      <div
        v-if="$slots.nodeLeft"
        ref="nodeLeftWrp"
        class="textarea__node-left-wrp"
      >
        <slot name="nodeLeft" />
      </div>
      <textarea
        ref="inputEl"
        class="textarea__input"
        spellcheck="false"
        :id="`textarea--${uid}`"
        v-bind="$attrs"
        v-on="listeners"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="isDisabled"
        :readonly="isReadonly"
        :rows="5"
      />
      <slot name="default" />
      <div
        v-if="$slots.nodeRight"
        ref="nodeRightWrp"
        class="textarea__node-right-wrp"
      >
        <slot name="nodeRight" />
      </div>
    </div>
    <transition
      name="textarea__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <div v-if="errorMessage || note" class="textarea__msg-wrp">
        <template v-if="errorMessage">
          <app-icon
            class="textarea__msg-icon"
            :name="$icons.exclamationCircle"
          />
          <span class="textarea__err-msg">
            {{ errorMessage }}
          </span>
        </template>
        <span v-else-if="note" class="textarea__note-msg">
          {{ note }}
        </span>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { AppIcon } from '@/common'
import { v4 as uuidv4 } from 'uuid'
import { computed, nextTick, onMounted, ref, useAttrs, useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    scheme?: 'primary'
    modelValue: string | number
    label?: string
    placeholder?: string
    type?: 'text' | 'number' | 'password'
    errorMessage?: string
    note?: string
    isLoading?: boolean
  }>(),
  {
    scheme: 'primary',
    type: 'text',
    label: '',
    placeholder: '',
    errorMessage: '',
    note: '',
    isLoading: false,
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

const isDisabled = computed(() =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const isReadonly = computed(() =>
  ['', 'readonly', true].includes(attrs.readonly as string | boolean),
)

const listeners = computed(() => ({
  input: (event: Event) => {
    const eventTarget = event.target as HTMLInputElement

    if (props.modelValue === eventTarget.value) return

    emit('update:modelValue', eventTarget.value)
  },
}))

const inputClasses = computed(() => [
  {
    'textarea--filled': props.modelValue,
    'textarea--node-left': slots.nodeLeft,
    'textarea--node-right': slots.nodeRight || props.errorMessage,
    'textarea--disabled': isDisabled.value,
    'textarea--readonly': isReadonly.value,
    'textarea--error': props.errorMessage,
    'textarea--loading': props.isLoading,
  },
  `textarea--${props.scheme}`,
])

onMounted(() => {
  if (!inputEl.value) return

  if (slots?.nodeLeft && nodeLeftWrp.value) {
    nextTick(() => {
      inputEl.value?.style.setProperty(
        'padding-left',
        `calc(${
          nodeLeftWrp.value?.offsetWidth || 0
        }px + var(--field-padding-left) * 2)`,
      )
    })
  }

  if (slots?.nodeRight && nodeRightWrp.value) {
    nextTick(() => {
      inputEl.value?.style.setProperty(
        'padding-right',
        `calc(${
          nodeRightWrp.value?.offsetWidth || 0
        }px + var(--field-padding-right) * 2)`,
      )
    })
  }
})

const setHeightCSSVar = (element: Element) => {
  ;(element as HTMLElement).style.setProperty(
    '--field-error-msg-height',
    `${element.scrollHeight}px`,
  )
}
</script>

<style lang="scss" scoped>
$z-index-side-nodes: 1;

.textarea {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;

  &--loading {
    &:before {
      $z-index: 2;

      z-index: $z-index;
    }

    @include skeleton;

    border-radius: 0;
  }
}

.textarea__label {
  @include field-label;
}

.textarea__input-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
  color: var(--field-placeholder);

  .textarea--filled & {
    color: var(--field-text);
  }
}

.textarea__input {
  padding: var(--field-padding);
  background: var(--field-bg-primary);
  box-shadow: inset 0 0 0 toRem(50) var(--field-bg-primary);
  transition: var(--field-transition-duration) var(--field-transition-timing);
  transition-property: color, box-shadow, border-color, background-color;
  resize: none;

  &:disabled {
    cursor: not-allowed;
    border-color: var(--field-border-disabled);
    background: var(--field-bg-primary-disabled);
  }

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

  .textarea--node-left & {
    padding-left: calc(var(--field-padding-left) * 3);
  }

  .textarea--node-right & {
    padding-right: calc(var(--field-padding-right) * 3);
  }

  .textarea--error & {
    border-color: var(--field-border-error);
  }

  .textarea__input-wrp:hover &:not([disabled]) {
    border-color: var(--field-border-hover);
  }

  .textarea__input-wrp:focus-within &:not([disabled]) {
    box-sizing: border-box;
    border-color: var(--field-border-focus);
  }

  .textarea__input-wrp:hover &:not([disabled]):not(:focus) {
    .textarea--error & {
      border-color: var(--field-border-error);
    }
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

  @include field-border;

  @include field-text;
}

.textarea__node-left-wrp {
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: var(--field-padding-left);
  transform: translateY(-50%);
  color: inherit;
  max-height: 100%;
  z-index: $z-index-side-nodes;
}

.textarea__node-right-wrp {
  position: absolute;
  top: 50%;
  right: var(--field-padding-right);
  transform: translateY(-50%);
  color: inherit;
  z-index: $z-index-side-nodes;
}

.textarea__password-icon {
  max-width: toRem(24);
  max-height: toRem(24);
}

.textarea__icon {
  width: toRem(18);
  height: toRem(18);
}

.textarea__msg-wrp {
  @include field-msg-wrp;
}

.textarea__msg-icon {
  @include field-msg-icon;
}

.textarea__err-msg,
.textarea__note-msg {
  @include field-error;
}

.textarea__note-msg {
  color: var(--text-tertiary-main);
}

.textarea__err-msg-transition-enter-active {
  animation: fade-down var(--field-transition-duration);
}

.textarea__err-msg-transition-leave-active {
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
