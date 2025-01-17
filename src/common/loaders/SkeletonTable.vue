<template>
  <div class="flex w-full flex-col gap-6">
    <div
      v-for="row in rows"
      :key="row"
      class="grid items-center gap-4"
      :style="{
        gridTemplateColumns: sizing,
      }"
    >
      <skeleton
        v-for="scheme in schemes"
        :key="scheme"
        :scheme="scheme"
        :class="commonSkeletonClassNames"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Skeleton } from '@/common'

withDefaults(
  defineProps<{
    rows: number
    schemes?: ('thin' | 'medium' | 'circle')[]
    sizing: string
    commonSkeletonClassNames?: string
  }>(),
  {
    schemes: () => ['medium', 'medium', 'medium', 'medium', 'medium'],
    commonSkeletonClassNames: '',
  },
)
</script>

<style lang="scss" scoped></style>
