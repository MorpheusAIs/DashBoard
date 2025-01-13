<template>
  <div :class="selectFieldClasses">
    <div ref="selectElement" class="select-field__select-wrp">
      <label v-if="label" class="select-field__label" :for="uid">
        {{ label }}
      </label>
      <div class="select-field__select-head-wrp">
        <button
          type="button"
          class="select-field__select-head"
          :id="uid"
          :disabled="isDisabled || isReadonly"
          @blur="emit('blur')"
          @click="toggleDropMenu"
        >
          <template v-if="$slots.head">
            <slot
              name="head"
              :select-field="{
                select,
                isOpen: isDropMenuOpen,
                close: closeDropMenu,
                open: openDropMenu,
                toggle: toggleDropMenu,
              }"
            />
          </template>
          <template v-else>
            <template v-if="modelValue?.title">
              {{ modelValue.title }}
            </template>
            <template v-else-if="placeholder">
              <span class="select-field__placeholder">
                {{ placeholder }}
              </span>
            </template>
          </template>
          <app-icon
            class="select-field__select-head-indicator"
            :name="$icons.chevronDown"
          />
        </button>
        <drop-menu
          v-model:is-shown="isDropMenuOpen"
          class="select-field__select-drop-menu"
        >
          <template v-if="$slots.default">
            <slot
              :select-field="{
                select,
                isOpen: isDropMenuOpen,
                close: closeDropMenu,
                open: openDropMenu,
                toggle: toggleDropMenu,
              }"
            />
          </template>
          <template v-else-if="valueOptions?.length">
            <button
              v-for="(option, idx) in valueOptions"
              :key="idx"
              :disabled="isDisabled || isReadonly"
              class="select-field__select-drop-menu-item"
              @click="select(option)"
            >
              {{ option.title }}
            </button>
          </template>
        </drop-menu>
      </div>
    </div>
    <transition
      name="select-field__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <div v-if="errorMessage || note" class="select-field__msg-wrp">
        <app-icon
          class="select-field__msg-icon"
          :name="$icons.exclamationCircle"
        />
        <span v-if="errorMessage" class="select-field__err-msg">
          {{ errorMessage }}
        </span>
        <span v-else-if="note" class="select-field__note">
          {{ note }}
        </span>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { AppIcon, DropMenu } from '@/common'
import { FieldOption } from '@/types'
import { onClickOutside } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { computed, onMounted, ref, useAttrs, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue: FieldOption | any
    valueOptions?: FieldOption[]
    label?: string
    placeholder?: string
    errorMessage?: string
    note?: string
    scheme?: 'primary' | 'secondary' | 'text'
    modification?: 'dropdown' | 'dropup'
    uid?: string
    isLoading?: boolean
  }>(),
  {
    valueOptions: () => [],
    type: 'text',
    label: '',
    placeholder: ' ',
    errorMessage: '',
    note: '',
    scheme: 'primary',
    modification: 'dropdown',
    uid: `select-field--${uuidv4()}`,
    isLoading: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void
  (e: 'blur'): void
}>()

const attrs = useAttrs()

const selectElement = ref<HTMLDivElement | null>(null)

const isDropMenuOpen = ref(false)

const isDisabled = computed(() =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const isReadonly = computed(() =>
  ['', 'readonly', true].includes(attrs.readonly as string | boolean),
)

const selectFieldClasses = computed(() => ({
  'select-field': true,
  'select-field--error': props.errorMessage,
  'select-field--filled': props.modelValue,
  'select-field--loading': props.isLoading,
  'select-field--open': isDropMenuOpen.value,
  'select-field--disabled': isDisabled.value,
  'select-field--readonly': isReadonly.value,
  [`select-field--${props.scheme}`]: true,
  [`select-field--${props.modification}`]: true,
}))

const setHeightCSSVar = (element: Element) => {
  ;(element as HTMLElement).style.setProperty(
    '--field-error-msg-height',
    `${element.scrollHeight}px`,
  )
}

const toggleDropMenu = () => {
  isDropMenuOpen.value ? closeDropMenu() : openDropMenu()
}

const openDropMenu = () => {
  if (isDisabled.value || isReadonly.value) return

  isDropMenuOpen.value = true
}

const closeDropMenu = () => {
  isDropMenuOpen.value = false
}

const select = (value: typeof props.modelValue) => {
  if (isDisabled.value || isReadonly.value) return

  emit('update:modelValue', value)
  closeDropMenu()
}

onMounted(() => {
  if (selectElement.value) {
    onClickOutside(selectElement, () => {
      closeDropMenu()
    })
  }
})

watch(
  () => props.modelValue,
  () => {
    closeDropMenu()
  },
)
</script>

<style lang="scss" scoped>
$z-local-index: 2;

.select-field {
  display: flex;
  flex-direction: column;
  position: relative;

  &--loading {
    &:before {
      $z-index: 1;

      z-index: $z-index;
    }

    @include skeleton;

    border-radius: 0;
  }
}

.select-field__label {
  @include field-label;
}

.select-field__select-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.select-field__select-head-wrp {
  position: relative;
  height: max-content;
  width: 100%;
}

.select-field__select-head {
  text-align: left;
  height: 100%;
  width: 100%;
  transition: var(--field-transition-duration) var(--field-transition-timing);

  &:disabled {
    cursor: not-allowed;
    color: var(--field-text-readonly);
  }

  .select-field--primary & {
    background: var(--field-bg-primary);
    padding: var(--field-padding-top)
      calc(var(--field-padding-right) * 2 + toRem(24))
      var(--field-padding-bottom) var(--field-padding-right);

    &[disabled] {
      border-color: var(--field-border-disabled);
    }

    @include field-text;

    @include field-border;
  }

  .select-field--text & {
    padding: 0 toRem(28) 0 0;
    color: var(--field-text);

    @include body-1-semi-bold;
  }

  .select-field--secondary & {
    color: var(--field-text);
    padding: 0 toRem(28) 0 0;
    font-family: var(--app-font-family);
    font-size: toRem(16);
  }

  .select-field--error & {
    border-color: var(--field-border-error);
  }

  .select-field--open &,
  &:not([disabled]):focus {
    border-color: var(--field-border-focus);
  }

  .select-field:not(.select-field--error) & {
    &:not([disabled]):not(:focus):hover {
      border-color: var(--field-border-hover);
    }
  }
}

.select-field__placeholder {
  font: inherit;
}

.select-field__select-head-indicator {
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: toRem(24);
  height: toRem(24);
  transition: var(--field-transition-duration) var(--field-transition-timing);
  color: inherit;

  .select-field--primary & {
    right: toRem(20);
  }

  .select-field--dropup:not(.select-field--open) &,
  .select-field--dropdown.select-field--open & {
    transform: translateY(-50%) rotate(180deg);
  }
}

.select-field__select-drop-menu {
  .select-field--primary & {
    @include field-border;
  }
}

.select-field__select-drop-menu-item {
  $shadow-hover: 0 toRem(4) toRem(24) rgba(#ffffff, 0.25);

  text-align: right;
  width: 100%;
  padding: toRem(8) toRem(16);
  color: var(--field-text);
  background: var(--background-secondary-main);
  transition: var(--field-transition-duration) var(--field-transition-timing);

  .select-field--primary & {
    @include field-text;
  }

  .select-field--text & {
    @include body-1-regular;
  }

  &:not([disabled]):hover {
    background: #515c57;
    box-shadow: $shadow-hover;
  }

  &:not([disabled]):focus,
  &:not([disabled]):active {
    background: #515c57;
    box-shadow:
      $shadow-hover,
      inset 0 toRem(4) toRem(4) rgba(#000000, 0.25);
  }
}

.select-field__msg-wrp {
  @include field-msg-wrp;
}

.select-field__msg-icon {
  @include field-msg-icon;
}

.select-field__err-msg,
.select-field__note {
  @include field-error;
}

.select-field__note {
  color: var(--text-primary-light);
}

.select-field__err-msg-transition-enter-active {
  animation: fade-down var(--field-transition-duration)
    var(--field-transition-timing);
}

.select-field__err-msg-transition-leave-active {
  animation: fade-down var(--field-transition-duration)
    var(--field-transition-timing) reverse;
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
