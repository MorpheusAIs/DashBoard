<template>
  <div
    :class="
      cn(
        'skeleton',
        'relative w-full overflow-hidden bg-backgroundSecondaryMain',
        `skeleton--${scheme}`,
        scheme === 'circle' && 'rounded-full',
        scheme === 'thin' && 'min-h-5',
        scheme === 'medium' && 'min-h-8',
      )
    "
    v-bind="$attrs"
  />
</template>

<script lang="ts" setup>
import { cn } from '@/theme/utils'

withDefaults(
  defineProps<{
    scheme?: 'thin' | 'medium' | 'circle'
  }>(),
  {
    scheme: 'medium',
  },
)
</script>

<style lang="scss" scoped>
.skeleton {
  &:after {
    content: '';

    @apply absolute inset-0 -translate-x-full;

    background-image: linear-gradient(
      90deg,
      rgba(var(--white-rgb), 0) 0,
      rgba(var(--white-rgb), 0.2) 20%,
      rgba(var(--white-rgb), 0.5) 60%,
      rgba(var(--white-rgb), 0)
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}
</style>
