<template>
  <div class="loader">
    <template v-if="scheme === 'spinner'">
      <spinner />
    </template>
    <template v-else-if="scheme === 'skeleton'">
      <skeleton v-bind="$attrs" />
    </template>
  </div>
</template>

<script lang="ts" setup>
/* create skeletons */
import { Spinner, Skeleton } from '@/common/loaders'

withDefaults(
  defineProps<{
    scheme?: 'spinner' | 'skeleton'
  }>(),
  {
    scheme: 'spinner',
  },
)
</script>

<style lang="scss" scoped>
.loader {
  overflow: hidden;
  display: grid;
  place-items: center;
}
</style>
