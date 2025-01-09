<template>
  <div class="flex w-full flex-col gap-2">
    <div class="grid grid-cols-6 items-center px-8">
      <div class="builders-table__header-item">
        <span class="builders-table__header-item-text">Name</span>
      </div>
      <button class="builders-table__header-item">
        <span class="builders-table__header-item-text">Start time</span>
        <app-icon
          :name="$icons.sort"
          class="builders-table__header-item-icon"
        />
      </button>
      <button class="builders-table__header-item">
        <span class="builders-table__header-item-text">Min MOR Deposit</span>
        <app-icon
          :name="$icons.sort"
          class="builders-table__header-item-icon"
        />
      </button>
      <button class="builders-table__header-item">
        <span class="builders-table__header-item-text">Total MOR Staked</span>
        <app-icon
          :name="$icons.sort"
          class="builders-table__header-item-icon"
        />
      </button>
      <button class="builders-table__header-item">
        <span class="builders-table__header-item-text">Lock Period</span>
        <app-icon
          :name="$icons.sort"
          class="builders-table__header-item-icon"
        />
      </button>
      <div class=""></div>
    </div>
    <builders-table-item
      v-for="(el, index) in buildersProjects"
      :key="index"
      :builder-project="el"
    />
  </div>
</template>

<script setup lang="ts">
import BuildersTableItem from './BuildersTableItem.vue'
import { AppIcon } from '@/common'
import { GetBuildersProjectsQuery } from '@/types/graphql'

withDefaults(
  defineProps<{
    buildersProjects: GetBuildersProjectsQuery['buildersProjects']
  }>(),
  {},
)
</script>

<style scoped lang="scss">
.builders-table__header-item {
  display: flex;
  align-items: center;
  justify-self: end;
  gap: toRem(8);
  max-width: toRem(150);

  &:first-child {
    justify-self: start;
  }
}

.builders-table__header-item-text {
  font-size: toRem(16);
  line-height: toRem(24);
  color: var(--text-tertiary-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.builders-table__header-item-icon {
  @include square(24);
}
</style>
