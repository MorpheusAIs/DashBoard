<template>
  <div class="skeleton-table">
    <div
      v-for="row in rows"
      :key="row"
      class="skeleton-table__row"
      :style="{
        gridTemplateColumns: sizing,
      }"
    >
      <skeleton v-for="scheme in schemes" :key="scheme" :scheme="scheme" />
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
  }>(),
  {
    schemes: () => ['medium', 'medium', 'medium', 'medium', 'medium'],
  },
)
</script>

<style lang="scss" scoped>
.skeleton-table {
  display: flex;
  flex-direction: column;
  gap: toRem(24);
  width: 100%;
}

.skeleton-table__row {
  display: grid;
  align-items: center;
  grid-gap: toRem(16);
}
</style>
