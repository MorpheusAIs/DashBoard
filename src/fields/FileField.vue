<template>
  <div class="file-field" :class="inputClasses">
    <label v-if="label" :for="`file-field--${uid}`" class="file-field__label">
      {{ label }}
    </label>
    <div class="file-field__input-wrp relative">
      <div
        class="file-field__input flex flex-col items-center justify-center gap-3 py-5"
      >
        <template v-if="modelValue?.name">
          <span class="text-textSecondaryMain">{{ modelValue?.name }}</span>
        </template>
        <app-icon
          v-else
          :name="$icons.arrowUp"
          class="size-11 text-textSecondaryMain"
        />

        <template v-if="modelValue?.name">
          <button class="bg-primaryMain px-5 py-2 font-medium text-black">
            Change
          </button>
        </template>
        <template v-else>
          <div class="flex flex-col items-center">
            <span
              class="font-[18px] font-semibold leading-[26px] text-textSecondaryMain"
            >
              Drag & drop
            </span>
            <span class="font-[14px] leading-[26px] text-textSecondaryMain">
              or
            </span>
          </div>

          <button class="bg-primaryMain px-5 py-2 font-medium text-black">
            Upload
          </button>
        </template>
      </div>
      <input
        ref="inputEl"
        type="file"
        class="absolute left-0 top-0 size-full cursor-pointer opacity-0"
        spellcheck="false"
        :id="`file-field--${uid}`"
        v-bind="$attrs"
        v-on="listeners"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="isDisabled"
        :readonly="isReadonly"
      />
    </div>
    <transition
      name="file-field__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <div v-if="errorMessage || note" class="file-field__msg-wrp">
        <template v-if="errorMessage">
          <app-icon
            class="file-field__msg-icon"
            :name="$icons.exclamationCircle"
          />
          <span class="file-field__err-msg">
            {{ errorMessage }}
          </span>
        </template>
        <span v-else-if="note" class="file-field__note-msg">
          {{ note }}
        </span>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { AppButton, AppIcon } from '@/common'
import { v4 as uuidv4 } from 'uuid'
import { computed, ref, useAttrs } from 'vue'

const modelValue = defineModel<File>('modelValue')

const props = withDefaults(
  defineProps<{
    scheme?: 'primary'
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

const attrs = useAttrs()

const uid = uuidv4()

const inputEl = ref<HTMLInputElement>()

const isDisabled = computed(() =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const isReadonly = computed(() =>
  ['', 'readonly', true].includes(attrs.readonly as string | boolean),
)

const listeners = computed(() => ({
  input: (event: Event) => {
    const eventTarget = event.target as HTMLInputElement

    const files = eventTarget.files
    if (files && files.length > 0) {
      modelValue.value = files[0]
    }
  },
}))

const inputClasses = computed(() => [
  {
    'file-field--filled': !!modelValue.value,
    'file-field--disabled': isDisabled.value,
    'file-field--readonly': isReadonly.value,
    'file-field--error': props.errorMessage,
    'file-field--loading': props.isLoading,
  },
  `file-field--${props.scheme}`,
])

const setHeightCSSVar = (element: Element) => {
  ;(element as HTMLElement).style.setProperty(
    '--field-error-msg-height',
    `${element.scrollHeight}px`,
  )
}
</script>

<style lang="scss">
$z-index-side-nodes: 1;

.file-field {
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

.file-field__label {
  @include field-label;
}

.file-field__input-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
  color: var(--field-placeholder);

  .file-field--filled & {
    color: var(--field-text);
  }
}

.file-field__input {
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

  .file-field--error & {
    border-color: var(--field-border-error);
  }

  .file-field__input-wrp:hover &:not([disabled]) {
    border-color: var(--field-border-hover);
  }

  .file-field__input-wrp:focus-within &:not([disabled]) {
    box-sizing: border-box;
    border-color: var(--field-border-focus);
  }

  .file-field__input-wrp:hover &:not([disabled]):not(:focus) {
    .file-field--error & {
      border-color: var(--field-border-error);
    }
  }

  @include field-border;
}

.file-field__node-left-wrp {
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: var(--field-padding-left);
  transform: translateY(-50%);
  color: inherit;
  max-height: 100%;
  z-index: $z-index-side-nodes;
}

.file-field__node-right-wrp {
  position: absolute;
  top: 50%;
  right: var(--field-padding-right);
  transform: translateY(-50%);
  color: inherit;
  z-index: $z-index-side-nodes;
}

.file-field__password-icon {
  max-width: toRem(24);
  max-height: toRem(24);
}

.file-field__icon {
  width: toRem(18);
  height: toRem(18);
}

.file-field__msg-wrp {
  @include field-msg-wrp;
}

.file-field__msg-icon {
  @include field-msg-icon;
}

.file-field__err-msg,
.file-field__note-msg {
  @include field-error;
}

.file-field__note-msg {
  color: var(--text-tertiary-main);
}

.file-field__err-msg-transition-enter-active {
  animation: fade-down var(--field-transition-duration);
}

.file-field__err-msg-transition-leave-active {
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
