<template>
  <div class="loader">
    <component v-bind="$attrs" :is="loaderComponent" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Spinner, Skeleton } from '@/common/loaders'

const props = withDefaults(
  defineProps<{
    scheme: 'spinner' | 'skeleton'
  }>(),
  {
    scheme: 'spinner',
  },
)

const loaderComponent = computed(() => {
  switch (props.scheme) {
    case 'skeleton':
      return Skeleton
    case 'spinner':
    default:
      return Spinner
  }
})
</script>

<style lang="scss" scoped>
.loader {
  overflow: hidden;
  display: grid;
  place-items: center;
}
</style>
