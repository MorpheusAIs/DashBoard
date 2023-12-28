<template>
  <div :class="selectFieldClasses">
    <div ref="selectElement" class="select-field__select-wrp">
      <div class="select-field__select-head-wrp">
        <button
          type="button"
          class="select-field__select-head"
          @click="toggleDropdown"
        >
          <template v-if="$slots.head && !!modelValue">
            <slot
              name="head"
              :select-field="{
                select,
                isOpen: isDropdownOpen,
                close: closeDropdown,
                open: openDropdown,
                toggle: toggleDropdown,
              }"
            />
          </template>
          <template v-else>
            <template v-if="modelValue">
              {{ modelValue }}
            </template>
            <template v-else-if="!label && placeholder">
              <span class="select-field__placeholder">
                {{ props.placeholder }}
              </span>
            </template>
          </template>
          <icon
            :class="[
              'select-field__select-head-indicator',
              {
                'select-field__select-head-indicator--open': isDropdownOpen,
              },
            ]"
            :name="$icons.arrowDown"
          />
        </button>
        <label
          v-if="label"
          class="select-field__label"
          :for="`select-field--${uid}`"
        >
          {{ label }}
        </label>
      </div>
      <transition name="select-field__select-dropdown">
        <div v-if="isDropdownOpen" class="select-field__select-dropdown">
          <template v-if="$slots.default">
            <slot
              :select-field="{
                select,
                isOpen: isDropdownOpen,
                close: closeDropdown,
                open: openDropdown,
                toggle: toggleDropdown,
              }"
            />
          </template>
          <template v-else-if="valueOptions?.length">
            <button
              :class="[
                'select-field__select-dropdown-item',
                {
                  'select-field__select-dropdown-item--active':
                    modelValue === option,
                },
              ]"
              type="button"
              v-for="(option, idx) in valueOptions"
              :key="`[${idx}] ${option}`"
              @click="select(option)"
            >
              {{ option }}
            </button>
          </template>
        </div>
      </transition>
    </div>
    <transition
      name="select-field__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <span v-if="errorMessage" class="select-field__err-msg">
        {{ errorMessage }}
      </span>
      <span v-else-if="note" class="select-field__note">
        {{ note }}
      </span>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'

import { onClickOutside } from '@vueuse/core'
import { computed, onMounted, ref, useAttrs, watch } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'

const props = withDefaults(
  defineProps<{
    scheme?: 'primary'
    modelValue: string | number
    valueOptions?: string[] | number[]
    label?: string
    placeholder?: string
    errorMessage?: string
    note?: string
  }>(),
  {
    scheme: 'primary',
    valueOptions: () => [],
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

const selectElement = ref<HTMLDivElement>()

const isDropdownOpen = ref(false)
const uid = uuidv4()

onBeforeRouteUpdate(() => {
  closeDropdown()
})

const isDisabled = computed(() =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const isReadonly = computed(() =>
  ['', 'readonly', true].includes(attrs.readonly as string | boolean),
)

const isLabelActive = computed(() => isDropdownOpen.value || !!props.modelValue)

const selectFieldClasses = computed(() => ({
  'select-field': true,
  'select-field--error': props.errorMessage,
  'select-field--open': isDropdownOpen.value,
  'select-field--disabled': isDisabled.value,
  'select-field--readonly': isReadonly.value,
  'select-field--label-active': isLabelActive.value,
  [`select-field--${props.scheme}`]: true,
}))

const setHeightCSSVar = (element: Element) => {
  ;(element as HTMLElement).style.setProperty(
    '--field-error-msg-height',
    `${element.scrollHeight}px`,
  )
}

const toggleDropdown = () => {
  isDropdownOpen.value ? closeDropdown() : openDropdown()
}

const openDropdown = () => {
  if (isDisabled.value || isReadonly.value) return

  isDropdownOpen.value = true
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const select = (value: string | number) => {
  if (isDisabled.value || isReadonly.value) return

  emit('update:modelValue', value)
  closeDropdown()
}

onMounted(() => {
  if (selectElement.value) {
    onClickOutside(selectElement, () => {
      closeDropdown()
    })
  }
})

watch(
  () => props.modelValue,
  () => {
    closeDropdown()
  },
)
</script>

<style lang="scss" scoped>
$z-local-index: 2;

.select-field {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;

  &--disabled,
  &--readonly {
    opacity: 0.5;
    pointer-events: none;
  }
}

.select-field__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  position: absolute;
  padding: toRem(4);
  top: 50%;
  left: var(--field-padding-left);
  transform: translateY(-50%);
  color: var(--field-label);
  font-size: toRem(16);
  font-weight: 400;
  line-height: 1.3;
  background: var(--field-bg-primary);

  @include field-label;

  transition-property: all;

  .select-field--error & {
    color: var(--field-error);
  }

  .select-field--label-active & {
    top: 0;
    font-size: toRem(12);
    line-height: 1.3;
    font-weight: 700;
  }

  .select-field--open & {
    color: var(--primary-main);
  }
}

.select-field__select-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
}

.select-field__select-head-wrp {
  position: relative;
  width: 100%;
  height: 100%;
}

.select-field__select-head {
  background: var(--field-bg-primary);
  padding: var(--field-padding);
  padding-right: calc(var(--field-padding-right) + #{toRem(24)});
  text-align: left;
  width: 100%;
  height: 100%;

  $field-text-height: calc(
    var(--field-text-font-size) * var(--field-text-line-height)
  );

  min-height: calc(
    $field-text-height + var(--field-padding-top) + var(--field-padding-bottom)
  );

  @include field-text;

  transition-property: all;

  & + .select-field__focus-indicator {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &:after {
      content: '';
      position: absolute;
      bottom: toRem(-2);
      left: 50%;
      transform: translateX(-50%);
      height: toRem(2);
      width: 0;
      background: var(--primary-main);
      transition: width calc(var(--field-transition-duration) + 0.3s);

      .select-field--error & {
        background: var(--field-error);
      }
    }
  }

  .select-field--primary & {
    @include field-border;
  }

  .select-field--error.select-field--primary & {
    box-shadow: inset 0 0 0 toRem(50) var(--field-bg-primary),
      0 0 0 toRem(1) var(--field-error);
    border-color: var(--field-error);
  }

  .select-field--open.select-field--primary & {
    box-shadow: inset 0 0 0 toRem(50) var(--field-bg-primary),
      0 0 0 toRem(2) var(--primary-main);
    border-color: var(--primary-main);
  }
}

.select-field__placeholder {
  font: inherit;
  opacity: 0.25;

  @include field-placeholder;
}

.select-field__select-head-indicator {
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: var(--field-padding-right);
  transform: translateY(-50%);
  width: toRem(18);
  height: toRem(18);
  color: var(--field-text);
  transition: var(--field-transition-duration) ease-in-out;

  &--open {
    transform: translateY(-50%) rotate(180deg);
  }
}

.select-field__select-dropdown {
  display: flex;
  flex-direction: column;
  position: absolute;
  overflow: hidden auto;
  top: 110%;
  right: 0;
  width: 100%;
  max-height: 500%;
  z-index: $z-local-index;
  background: var(--white);
  box-shadow: 0 toRem(1) toRem(2) rgba(var(--black-rgb), 0.3),
    0 toRem(2) toRem(6) toRem(2) rgba(var(--black-rgb), 0.15);
  border-radius: toRem(14);
}

.select-field__select-dropdown-enter-active {
  animation: dropdown var(--field-transition-duration);
}

.select-field__select-dropdown-leave-active {
  animation: dropdown var(--field-transition-duration) 0.1s reverse;
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: translateY(20%);
    max-height: 0;
  }

  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 500%;
  }
}

.select-field__select-dropdown-item {
  text-align: left;
  width: 100%;
  padding: toRem(16);

  &:hover {
    background: var(--background-secondary-main);
  }

  &--active {
    background: var(--background-primary-main);
  }
}

.select-field__err-msg,
.select-field__note {
  @include field-error;
}

.select-field__note {
  color: var(--text-primary-light);
}

.select-field__err-msg-transition-enter-active {
  animation: fade-down var(--field-transition-duration);
}

.select-field__err-msg-transition-leave-active {
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
