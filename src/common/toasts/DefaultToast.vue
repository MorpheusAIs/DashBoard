<template>
  <div class="default-toast__body">
    <div class="default-toast__icon-wrp">
      <icon v-if="toastIcon" class="default-toast__icon" :name="toastIcon" />
    </div>
    <div class="default-toast__details">
      <h5 class="default-toast__title">
        {{ title }}
      </h5>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-html="message" class="default-toast__message" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'

import { computed } from 'vue'
import { ICON_NAMES } from '@/enums'

const props = withDefaults(
  defineProps<{
    title?: string
    message: string
    iconName?: ICON_NAMES
  }>(),
  {
    title: '',
    iconName: undefined,
  },
)

const toastIcon = computed(() => props.iconName || ICON_NAMES.checkCircle)
</script>

<style lang="scss">
$color-success: #00df80;
$color-error: #f04248;
$color-warning: #ffd21e;
$color-info: #ffffff;

.Vue-Toastification__container.top-right {
  top: toRem(100);
  padding: 0;

  @include respond-to(medium) {
    top: 0;
    right: 0;
    width: 100vw;
  }
}

.Vue-Toastification__toast.default-toast {
  background: #242c32;
  padding: toRem(12) toRem(16);
  border-radius: 0;
  box-shadow: 0 toRem(4) toRem(16) rgba(#a0a0a0, 0.25);

  @include respond-to(medium) {
    margin-bottom: toRem(8);
    width: 100%;
    max-width: unset;
  }
}

.default-toast__body {
  display: flex;
  align-items: center;
  gap: toRem(16);

  @include respond-to(medium) {
    gap: toRem(8);
  }
}

.default-toast__icon-wrp {
  flex-shrink: 0;
  position: relative;
  height: toRem(32);
  width: toRem(32);
  display: flex;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);

  &:before {
    $z-index: -1;

    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    height: toRem(212);
    width: toRem(212);
    z-index: $z-index;
    border-radius: 50%;
  }

  .Vue-Toastification__toast--success & {
    color: $color-success;

    &:before {
      background: radial-gradient(
        50% 50% at 50% 50%,
        rgba(0, 237, 81, 0.12) 0%,
        rgba(0, 237, 123, 0) 100%
      );
    }
  }

  .Vue-Toastification__toast--error & {
    color: $color-error;

    &:before {
      background: radial-gradient(
        50% 50% at 50% 50%,
        rgba(240, 66, 72, 0.12) 0%,
        rgba(240, 66, 72, 0) 100%
      );
    }
  }

  .Vue-Toastification__toast--warning & {
    color: $color-warning;

    &:before {
      background: radial-gradient(
        50% 50% at 50% 50%,
        rgba(255, 212, 38, 0.12) 0%,
        rgba(255, 212, 38, 0) 100%
      );
    }
  }

  .Vue-Toastification__toast--info & {
    color: $color-info;

    &:before {
      background: radial-gradient(
        50% 50% at 50% 50%,
        rgba(255, 255, 255, 0.12) 0%,
        rgba(255, 255, 255, 0) 100%
      );
    }
  }
}

.default-toast .default-toast__icon {
  margin: auto;
  height: toRem(24);
  width: toRem(24);
}

.default-toast__details {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.default-toast__title {
  $color: #ffffff;

  color: $color;

  @include body-4-semi-bold;
}

.default-toast__message {
  $color: #c8c5c5;

  color: $color;
  width: toRem(260);

  .link {
    --underline: transparent;

    position: relative;
    display: inline-block;

    &:after {
      content: '';
      position: absolute;
      bottom: toRem(0);
      height: toRem(1);
      width: 100%;
      display: block;
      background: var(--underline);
      transition: var(--transition-duration-fast)
        var(--transition-timing-default);
    }

    &:hover:after {
      background: var(--underline-hover);
    }

    &:focus:after {
      background: var(--underline-focus);
    }

    &:active:after {
      background: var(--underline-active);
    }

    .Vue-Toastification__toast--success & {
      color: $color-success;
      --underline-hover: #{$color-success};
      --underline-focus: #{$color-success};
      --underline-active: #{$color-success};
    }

    .Vue-Toastification__toast--error & {
      color: $color-error;
      --underline-hover: #{$color-error};
      --underline-focus: #{$color-error};
      --underline-active: #{$color-error};
    }

    .Vue-Toastification__toast--warning & {
      color: $color-warning;
      --underline-hover: #{$color-warning};
      --underline-focus: #{$color-warning};
      --underline-active: #{$color-warning};
    }

    .Vue-Toastification__toast--info & {
      color: $color-info;
      --underline-hover: #{$color-info};
      --underline-focus: #{$color-info};
      --underline-active: #{$color-info};
    }

    @include body-5-regular;
  }

  @include body-5-regular;

  @include respond-to(medium) {
    width: 100%;
  }
}

.Vue-Toastification__progress-bar {
  height: toRem(2);

  .Vue-Toastification__toast--success & {
    background: #01e17b;
    box-shadow: 0 0 toRem(4) #01e17b;
  }

  .Vue-Toastification__toast--error & {
    background: #f04349;
    box-shadow: 0 0 toRem(4) #f04349;
  }

  .Vue-Toastification__toast--warning & {
    background: #ffd21f;
    box-shadow: 0 0 toRem(4) #ffd21f;
  }

  .Vue-Toastification__toast--info & {
    background: #ffffff;
    box-shadow: 0 0 toRem(4) #ffffff;
  }
}
</style>
