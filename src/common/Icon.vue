<template>
  <svg class="icon" aria-hidden="true">
    <use :href="`#${name}-icon`" />
  </svg>
</template>

<script lang="ts" setup>
import { ICON_NAMES } from '@/enums'

defineProps<{
  name: ICON_NAMES
}>()
</script>

<style lang="scss" scoped>
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}
</style>
