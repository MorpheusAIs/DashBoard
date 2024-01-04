<template>
  <template v-if="route">
    <router-link
      class="app-button"
      :class="buttonClasses"
      v-bind="$attrs"
      :to="route"
    >
      <icon v-if="iconLeft" class="app-button__icon-left" :name="iconLeft" />
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconRight" class="app-button__icon-right" :name="iconRight" />
    </router-link>
  </template>
  <template v-else-if="href">
    <a class="app-button" :class="buttonClasses" v-bind="$attrs" :href="href">
      <icon v-if="iconLeft" class="app-button__icon-left" :name="iconLeft" />
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconRight" class="app-button__icon-right" :name="iconRight" />
    </a>
  </template>
  <template v-else>
    <button
      class="app-button"
      :class="buttonClasses"
      v-bind="$attrs"
      :disabled="isDisabled"
      :type="buttonType"
    >
      <icon v-if="iconLeft" class="app-button__icon-left" :name="iconLeft" />
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <span v-if="text" class="app-button__text">
          {{ text }}
        </span>
      </template>
      <icon v-if="iconRight" class="app-button__icon-right" :name="iconRight" />
    </button>
  </template>
</template>

<script lang="ts" setup>
import { computed, useAttrs, useSlots } from 'vue'
import type { LocationAsRelativeRaw } from 'vue-router'

import { Icon } from '@/common'
import type { ICON_NAMES } from '@/enums'

type ButtonType = 'button' | 'submit' | 'reset'

const props = withDefaults(
  defineProps<{
    text?: string
    scheme?: 'filled' | 'flat' | 'link' | 'none'
    modification?: 'border-circle' | 'border-rounded' | 'border-square'
    color?:
      | 'primary'
      | 'secondary'
      | 'success'
      | 'error'
      | 'warning'
      | 'info'
      | 'none'
    size?: 'large' | 'medium' | 'small' | 'x-small' | 'none'
    route?: LocationAsRelativeRaw
    href?: string
    iconLeft?: ICON_NAMES
    iconRight?: ICON_NAMES
  }>(),
  {
    text: '',
    scheme: 'filled',
    modification: 'border-square',
    color: 'primary',
    size: 'medium',
    route: undefined,
    href: '',
    iconLeft: undefined,
    iconRight: undefined,
  },
)

const attrs = useAttrs()
const slots = useSlots()

const isDisabled = computed((): boolean =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const buttonClasses = computed(() =>
  [
    'app-button',
    `app-button--scheme-${props.scheme}`,
    `app-button--${props.modification}`,
    `app-button--${props.color}`,
    `app-button--${props.size}`,
    ...(isDisabled.value ? ['app-button--disabled'] : []),
    ...((props.iconLeft || props.iconRight) && !props.text && !slots.default
      ? ['app-button--icon-only']
      : []),
  ].join(' '),
)

const buttonType = computed<ButtonType>(
  () => (attrs.type as ButtonType) || 'button',
)
</script>

<style lang="scss" scoped>
$button-transition: var(--transition-duration-fast)
  var(--transition-timing-default);

.app-button {
  --button-icon-size: 1.2em;

  outline: 0;
  font-family: var(--app-font-family);
  margin: 0;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  display: flex;
  align-items: center;
  width: min-content;
  justify-content: center;
  transition: $button-transition;
  transition-property: background-color, color, border-color, box-shadow;
  text-decoration: none;
  background: var(--app-button-bg);
  color: var(--app-button-text);
  border: var(--app-button-border);

  &:disabled,
  &--disabled {
    cursor: not-allowed;
    background: var(--app-button-bg-disabled);
    color: var(--app-button-text-disabled);
    border: var(--app-button-border-disabled);
  }

  &:not([disabled]):hover {
    text-decoration: none;
    background: var(--app-button-bg-hover);
    color: var(--app-button-text-hover);
    border: var(--app-button-border-hover);
  }

  &:not([disabled]):focus {
    text-decoration: none;
    background: var(--app-button-bg-focused);
    color: var(--app-button-text-focused);
    border: var(--app-button-border-focused);
  }

  &:not([disabled]):active {
    text-decoration: none;
    background: var(--app-button-bg-active);
    color: var(--app-button-text-active);
    border: var(--app-button-border-active);
  }

  &--scheme-filled {
    --app-button-filled-border: 0;
    --app-button-filled-border-hover: 0;
    --app-button-filled-border-active: 0;
    --app-button-filled-border-focused: 0;

    --app-button-bg: var(--app-button-filled-bg);
    --app-button-bg-hover: var(--app-button-filled-bg-hover);
    --app-button-bg-focused: var(--app-button-filled-bg-focused);
    --app-button-bg-active: var(--app-button-filled-bg-active);
    --app-button-bg-disabled: var(--app-button-filled-bg-disabled);

    --app-button-text: var(--app-button-filled-text);
    --app-button-text-hover: var(--app-button-filled-text-hover);
    --app-button-text-focused: var(--app-button-filled-text-focused);
    --app-button-text-active: var(--app-button-filled-text-active);
    --app-button-text-disabled: var(--app-button-filled-text-disabled);

    --app-button-border: var(--app-button-filled-border);
    --app-button-border-hover: var(--app-button-filled-border-hover);
    --app-button-border-focused: var(--app-button-filled-border-focused);
    --app-button-border-active: var(--app-button-filled-border-active);
    --app-button-border-disabled: var(--app-button-filled-border-disabled);
  }

  &--scheme-flat {
    --app-button-flat-bg: none;
    --app-button-flat-bg-hover: none;
    --app-button-flat-bg-focused: none;
    --app-button-flat-bg-active: none;

    --app-button-bg: var(--app-button-flat-bg);
    --app-button-bg-hover: var(--app-button-flat-bg-hover);
    --app-button-bg-focused: var(--app-button-flat-bg-focused);
    --app-button-bg-active: var(--app-button-flat-bg-active);

    --app-button-text: var(--app-button-flat-text);
    --app-button-text-hover: var(--app-button-flat-text-hover);
    --app-button-text-focused: var(--app-button-flat-text-focused);
    --app-button-text-active: var(--app-button-flat-text-active);

    --app-button-border: var(--app-button-flat-border);
    --app-button-border-hover: var(--app-button-flat-border-hover);
    --app-button-border-focused: var(--app-button-flat-border-focused);
    --app-button-border-active: var(--app-button-flat-border-active);
  }

  &--scheme-link {
    --app-button-bg: none;
    --app-button-bg-hover: none;
    --app-button-bg-focused: none;
    --app-button-bg-active: none;

    --app-button-border: none;
    --app-button-border-hover: none;
    --app-button-border-focused: none;
    --app-button-border-active: none;

    --app-button-text: var(--app-button-link-text);
    --app-button-text-hover: var(--app-button-link-text-hover);
    --app-button-text-focused: var(--app-button-link-text-focused);
    --app-button-text-active: var(--app-button-link-text-active);
    --app-button-text-disabled: var(--app-button-link-text-disabled);
  }

  &--scheme-none {
    --app-button-none-bg: transparent;
    --app-button-none-bg-hover: transparent;
    --app-button-none-bg-focused: transparent;
    --app-button-none-bg-active: transparent;

    --app-button-none-text: var(--text-primary-main);
    --app-button-none-text-hover: var(--text-primary-main);
    --app-button-none-text-focused: var(--text-primary-main);
    --app-button-none-text-active: var(--text-primary-main);

    --app-button-bg: var(--app-button-none-bg);
    --app-button-bg-hover: var(--app-button-none-bg-hover);
    --app-button-bg-focused: var(--app-button-none-bg-focused);
    --app-button-bg-active: var(--app-button-none-bg-active);

    --app-button-text: var(--app-button-none-text);
    --app-button-text-hover: var(--app-button-none-text-hover);
    --app-button-text-focused: var(--app-button-none-text-focused);
    --app-button-text-active: var(--app-button-none-text-active);
  }

  &--primary {
    $bg: linear-gradient(90deg, var(--primary-main), var(--primary-dark))
      border-box;

    --app-button-filled-bg: #{$bg};
    --app-button-filled-bg-hover: #{$bg};
    --app-button-filled-bg-focused: #{$bg};
    --app-button-filled-bg-active: #{$bg};
    --app-button-filled-bg-disabled: var(--disable-primary-dark);

    --app-button-filled-text: var(--text-primary-dark);
    --app-button-filled-text-hover: var(--text-primary-dark);
    --app-button-filled-text-focused: var(--text-primary-dark);
    --app-button-filled-text-active: var(--text-primary-dark);
    --app-button-filled-text-disabled: var(--disable-primary-main);

    --app-button-filled-border: #{toRem(2)} solid transparent;
    --app-button-filled-border-hover: #{toRem(2)} solid var(--primary-main);
    --app-button-filled-border-focused: #{toRem(2)} solid var(--primary-main);
    --app-button-filled-border-active: #{toRem(2)} solid var(--primary-main);
    --app-button-filled-border-disabled: #{toRem(2)} solid transparent;

    --app-button-flat-text: var(--primary-main);
    --app-button-flat-text-hover: var(--primary-main);
    --app-button-flat-text-focused: var(--primary-main);
    --app-button-flat-text-active: var(--primary-main);

    --app-button-flat-border: #{toRem(1)} solid var(--secondary-light);
    --app-button-flat-border-hover: var(--app-button-flat-border);
    --app-button-flat-border-focused: var(--app-button-flat-border);
    --app-button-flat-border-active: var(--app-button-flat-border);

    --app-button-link-text: var(--primary-main);
    --app-button-link-text-hover: var(--primary-main);
    --app-button-link-text-focused: var(--primary-main);
    --app-button-link-text-active: var(--primary-main);
    --app-button-link-text-disabled: var(--disable-secondary-main);

    --app-button-link-underline: transparent;
    --app-button-link-underline-hover: var(--primary-main);
    --app-button-link-underline-focus: var(--primary-main);
    --app-button-link-underline-active: var(--primary-main);

    &.app-button--scheme-filled {
      $box-shadow-hover: 0 toRem(4) toRem(24) rgba(#ffffff, 0.25);

      &:not([disabled]):hover {
        box-shadow: $box-shadow-hover;
      }

      &:not([disabled]):focus,
      &:not([disabled]):active {
        box-shadow: $box-shadow-hover,
          inset 0 toRem(4) toRem(4) rgba(#000000, 0.25);
      }
    }
  }

  &--secondary {
    --app-button-filled-bg: var(--background-secondary-main);
    --app-button-filled-bg-hover: var(--background-secondary-main);
    --app-button-filled-bg-focused: var(--background-secondary-main);
    --app-button-filled-bg-active: var(--background-secondary-main);
    --app-button-filled-bg-disabled: var(--disable-secondary-dark);

    --app-button-filled-text: var(--text-secondary-light);
    --app-button-filled-text-hover: var(--text-secondary-light);
    --app-button-filled-text-focused: var(--text-secondary-light);
    --app-button-filled-text-active: var(--text-secondary-light);
    --app-button-filled-text-disabled: var(--disable-secondary-main);

    --app-button-filled-border: #{toRem(1)} solid transparent;
    --app-button-filled-border-hover: #{toRem(1)} solid var(--primary-main);
    --app-button-filled-border-focused: #{toRem(1)} solid var(--primary-main);
    --app-button-filled-border-active: #{toRem(1)} solid var(--primary-main);
    --app-button-filled-border-disabled: #{toRem(1)} solid transparent;

    --app-button-flat-text: rgba(255, 255, 255, 0.8);
    --app-button-flat-text-hover: var(--primary-main);
    --app-button-flat-text-focused: var(--primary-main);
    --app-button-flat-text-active: var(--primary-main);

    --app-button-flat-border: #{toRem(1)} solid #494949;
    --app-button-flat-border-hover: #{toRem(1)} solid var(--primary-main);
    --app-button-flat-border-focused: var(--app-button-flat-border-hover);
    --app-button-flat-border-active: var(--app-button-flat-border-hover);

    &.app-button--scheme-filled {
      &:not([disabled]):focus,
      &:not([disabled]):active {
        box-shadow: inset 0 toRem(7) toRem(18) rgba(#000000, 0.25);
      }
    }
  }

  &--success {
    --app-button-filled-bg: var(--success-main);
    --app-button-filled-bg-hover: var(--success-main);
    --app-button-filled-bg-focused: var(--success-main);
    --app-button-filled-bg-active: var(--success-dark);

    --app-button-filled-text: var(--text-primary-light);
    --app-button-filled-text-hover: var(--text-primary-light);
    --app-button-filled-text-focused: var(--text-primary-light);
    --app-button-filled-text-active: var(--text-primary-light);

    --app-button-flat-text: var(--success-main);
    --app-button-flat-text-hover: var(--success-main);
    --app-button-flat-text-focused: var(--success-main);
    --app-button-flat-text-active: var(--success-dark);

    --app-button-flat-border: #{toRem(1)} solid var(--success-main);
    --app-button-flat-border-hover: var(--app-button-flat-border);
    --app-button-flat-border-focused: var(--app-button-flat-border);
    --app-button-flat-border-active: #{toRem(1)} solid var(--success-dark);

    --app-button-none-text: var(--success-main);
    --app-button-none-text-hover: var(--success-main);
    --app-button-none-text-focused: var(--success-main);
    --app-button-none-text-active: var(--success-dark);
  }

  &--error {
    --app-button-filled-bg: var(--error-main);
    --app-button-filled-bg-hover: var(--error-main);
    --app-button-filled-bg-focused: var(--error-main);
    --app-button-filled-bg-active: var(--error-dark);

    --app-button-filled-text: var(--text-primary-light);
    --app-button-filled-text-hover: var(--text-primary-light);
    --app-button-filled-text-focused: var(--text-primary-light);
    --app-button-filled-text-active: var(--text-primary-light);

    --app-button-flat-text: var(--error-main);
    --app-button-flat-text-hover: var(--error-main);
    --app-button-flat-text-focused: var(--error-main);
    --app-button-flat-text-active: var(--error-dark);

    --app-button-flat-border: #{toRem(1)} solid var(--error-main);
    --app-button-flat-border-hover: var(--app-button-flat-border);
    --app-button-flat-border-focused: var(--app-button-flat-border);
    --app-button-flat-border-active: #{toRem(1)} solid var(--error-dark);

    --app-button-none-text: var(--error-main);
    --app-button-none-text-hover: var(--error-main);
    --app-button-none-text-focused: var(--error-main);
    --app-button-none-text-active: var(--error-dark);
  }

  &--warning {
    --app-button-filled-bg: var(--warning-main);
    --app-button-filled-bg-hover: var(--warning-main);
    --app-button-filled-bg-focused: var(--warning-main);
    --app-button-filled-bg-active: var(--warning-dark);

    --app-button-filled-text: var(--text-primary-light);
    --app-button-filled-text-hover: var(--text-primary-light);
    --app-button-filled-text-focused: var(--text-primary-light);
    --app-button-filled-text-active: var(--text-primary-light);

    --app-button-flat-text: var(--warning-main);
    --app-button-flat-text-hover: var(--warning-main);
    --app-button-flat-text-focused: var(--warning-main);
    --app-button-flat-text-active: var(--warning-dark);

    --app-button-flat-border: #{toRem(1)} solid var(--warning-main);
    --app-button-flat-border-hover: var(--app-button-flat-border);
    --app-button-flat-border-focused: var(--app-button-flat-border);
    --app-button-flat-border-active: #{toRem(1)} solid var(--warning-dark);

    --app-button-none-text: var(--warning-main);
    --app-button-none-text-hover: var(--warning-main);
    --app-button-none-text-focused: var(--warning-main);
    --app-button-none-text-active: var(--warning-dark);
  }

  &--info {
    --app-button-filled-bg: var(--info-main);
    --app-button-filled-bg-hover: var(--info-main);
    --app-button-filled-bg-focused: var(--info-main);
    --app-button-filled-bg-active: var(--info-dark);

    --app-button-filled-text: var(--text-primary-light);
    --app-button-filled-text-hover: var(--text-primary-light);
    --app-button-filled-text-focused: var(--text-primary-light);
    --app-button-filled-text-active: var(--text-primary-light);

    --app-button-flat-text: var(--info-main);
    --app-button-flat-text-hover: var(--info-main);
    --app-button-flat-text-focused: var(--info-main);
    --app-button-flat-text-active: var(--info-dark);

    --app-button-flat-border: #{toRem(1)} solid var(--info-main);
    --app-button-flat-border-hover: var(--app-button-flat-border);
    --app-button-flat-border-focused: var(--app-button-flat-border);
    --app-button-flat-border-active: #{toRem(1)} solid var(--info-dark);

    --app-button-none-text: var(--info-main);
    --app-button-none-text-hover: var(--info-main);
    --app-button-none-text-focused: var(--info-main);
    --app-button-none-text-active: var(--info-dark);
  }

  &--none {
    --app-button-link-text: var(--text-secondary-light);
    --app-button-link-text-hover: var(--primary-main);
    --app-button-link-text-focused: var(--primary-main);
    --app-button-link-text-active: var(--primary-main);
    --app-button-link-text-disabled: var(--disable-secondary-main);
    --app-button-icon: var(--primary-main);

    --app-button-link-underline: transparent;
    --app-button-link-underline-hover: var(--primary-main);
    --app-button-link-underline-focus: var(--primary-main);
    --app-button-link-underline-active: var(--primary-main);
  }

  &--border-circle {
    border-radius: toRem(100);
  }

  &--border-rounded {
    border-radius: toRem(14);
  }

  &--large {
    --button-icon-size: #{toRem(18)};

    padding: toRem(18) toRem(36);
    gap: toRem(8);
    font-size: toRem(14);
    line-height: 1.45;
    font-weight: 500;
    height: toRem(56);

    &.app-button--icon-only {
      --button-icon-size: #{toRem(20)};

      padding: toRem(18);
      width: calc(var(--button-icon-size) + #{toRem(18)});
      height: calc(var(--button-icon-size) + #{toRem(18)});
    }
  }

  &--medium {
    --button-icon-size: #{toRem(24)};

    gap: toRem(8);
    height: toRem(48);

    &:not(.app-button--scheme-link) {
      padding: toRem(10) toRem(26);
      min-width: toRem(170);

      @include body-4-medium;
    }

    &.app-button--icon-only {
      --button-icon-size: #{toRem(20)};

      padding: toRem(12);
      width: calc(var(--button-icon-size) + #{toRem(12)});
      height: calc(var(--button-icon-size) + #{toRem(12)});
    }

    @include body-4-regular;
  }

  &--small {
    --button-icon-size: #{toRem(14)};

    padding: toRem(8) toRem(16);
    font-size: toRem(12);
    line-height: 1.45;
    font-weight: 500;
    gap: toRem(8);
    height: toRem(32);

    &.app-button--icon-only {
      --button-icon-size: #{toRem(20)};

      padding: toRem(8);
      width: calc(var(--button-icon-size) + #{toRem(8)});
      height: calc(var(--button-icon-size) + #{toRem(8)});
    }
  }
}

.app-button .app-button__icon-left,
.app-button .app-button__icon-right {
  color: var(--app-button-icon);
  height: var(--button-icon-size);
  width: var(--button-icon-size);
}

.app-button__text {
  color: inherit;
  font: inherit;
  pointer-events: none;
  word-break: break-all;
  min-width: 0;

  .app-button--scheme-link & {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      bottom: toRem(0);
      height: toRem(1);
      width: 100%;
      display: block;
      background: var(--app-button-link-underline);
      transition: $button-transition;
    }
  }

  .app-button--scheme-link:not([disabled]):hover &:after {
    background: var(--app-button-link-underline-hover);
  }

  .app-button--scheme-link:not([disabled]):focus &:after {
    background: var(--app-button-link-underline-focus);
  }

  .app-button--scheme-link:not([disabled]):active &:after {
    background: var(--app-button-link-underline-active);
  }

  @include text-ellipsis;
}
</style>
