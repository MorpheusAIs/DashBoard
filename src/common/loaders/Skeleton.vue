<template>
  <div :class="['skeleton', `skeleton--${scheme}`]" v-bind="$attrs" />
</template>

<script lang="ts" setup>
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
  overflow: hidden;
  position: relative;
  background: var(--background-secondary-light);
  border-radius: toRem(4);
  width: 100%;
  height: 100%;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    transform: translateX(-100%);
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

  &--circle {
    border-radius: 50%;
  }

  &--thin {
    height: toRem(20);
  }

  &--medium {
    height: toRem(32);
  }
}
</style>
