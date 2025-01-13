<template>
  <div
    :class="
      cn(
        `app-gradient-border-card`,
        `app-gradient-border-card--${gradientDirection}`,
      )
    "
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/theme/utils'

withDefaults(
  defineProps<{
    gradientDirection?: 'left' | 'right'
  }>(),
  {
    gradientDirection: 'right',
  },
)
</script>

<style scoped lang="scss">
.app-gradient-border-card {
  width: 100%;
  background: linear-gradient(
    95.36deg,
    rgba(57, 99, 58, 0.04) 0%,
    rgba(38, 57, 57, 0.5) 56.4%
  );
  border: toRem(1) solid;
  border-image-slice: 1;

  &--left {
    border-image-source: linear-gradient(
      95.36deg,
      rgba(255, 255, 255, 0.48) 0%,
      rgba(255, 255, 255, 0.08) 100%
    );

    &:hover {
      border-image-source: linear-gradient(
        95.36deg,
        rgba(3, 255, 133, 0.48) 0%,
        rgba(3, 255, 133, 0.08) 100%
      );
    }
  }

  &--right {
    border-image-source: linear-gradient(
      95.36deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.48) 100%
    );

    &:hover {
      border-image-source: linear-gradient(
        95.36deg,
        rgba(3, 255, 133, 0.48) 0%,
        rgba(3, 255, 133, 0.08) 100%
      );
    }
  }
}
</style>
