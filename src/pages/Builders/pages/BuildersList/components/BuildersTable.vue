<template>
  <div class="flex w-full flex-col gap-2">
    <div
      :class="
        cn(
          'hidden',
          'grid-cols-[max(216px),max(160px),max(190px),1fr,1fr,max(100px)] items-center md:grid',
          'gap-2 px-8',
        )
      "
    >
      <div class="builders-table__header-item">
        <span class="builders-table__header-item-text">
          {{ $t('builders-table.name-th') }}
        </span>
      </div>
      <button class="builders-table__header-item">
        <span class="builders-table__header-item-text">
          {{ $t('builders-table.starts-time-th') }}
        </span>
        <app-icon
          :name="$icons.sort"
          class="builders-table__header-item-icon"
        />
      </button>
      <button class="builders-table__header-item">
        <span class="builders-table__header-item-text">
          {{ $t('builders-table.min-deposit-th') }}
        </span>
        <app-icon
          :name="$icons.sort"
          class="builders-table__header-item-icon"
        />
      </button>
      <button class="builders-table__header-item">
        <span class="builders-table__header-item-text">
          {{ $t('builders-table.total-staked-th') }}
        </span>
        <app-icon
          :name="$icons.sort"
          class="builders-table__header-item-icon"
        />
      </button>
      <button class="builders-table__header-item">
        <span class="builders-table__header-item-text">
          {{ $t('builders-table.withdraw-lock-period-th') }}
        </span>
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
import { cn } from '@/theme/utils'

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
