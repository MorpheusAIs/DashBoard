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
      <button
        class="builders-table__header-item"
        @click="$emit('update-sorting', BuildersProject_OrderBy.StartsAt)"
      >
        <span class="builders-table__header-item-text">
          {{ $t('builders-table.starts-time-th') }}
        </span>
        <div class="builders-table__header-icons-wrp">
          <app-icon
            class="builders-table__header-item-icon"
            :class="{
              'builders-table__header-item-icon--active':
                orderBy === BuildersProject_OrderBy.StartsAt &&
                orderDirection === OrderDirection.Asc,
            }"
            :name="$icons.triangleTop"
          />
          <app-icon
            class="builders-table__header-item-icon"
            :class="{
              'builders-table__header-item-icon--active':
                orderBy === BuildersProject_OrderBy.StartsAt &&
                orderDirection === OrderDirection.Desc,
            }"
            :name="$icons.triangleTop"
          />
        </div>
      </button>
      <button
        class="builders-table__header-item"
        @click="$emit('update-sorting', BuildersProject_OrderBy.MinimalDeposit)"
      >
        <span class="builders-table__header-item-text">
          {{ $t('builders-table.min-deposit-th') }}
        </span>
        <div class="builders-table__header-icons-wrp">
          <app-icon
            class="builders-table__header-item-icon"
            :class="{
              'builders-table__header-item-icon--active':
                orderBy === BuildersProject_OrderBy.MinimalDeposit &&
                orderDirection === OrderDirection.Asc,
            }"
            :name="$icons.triangleTop"
          />
          <app-icon
            class="builders-table__header-item-icon"
            :class="{
              'builders-table__header-item-icon--active':
                orderBy === BuildersProject_OrderBy.MinimalDeposit &&
                orderDirection === OrderDirection.Desc,
            }"
            :name="$icons.triangleTop"
          />
        </div>
      </button>
      <button
        class="builders-table__header-item"
        @click="$emit('update-sorting', BuildersProject_OrderBy.TotalStaked)"
      >
        <span class="builders-table__header-item-text">
          {{ $t('builders-table.total-staked-th') }}
        </span>
        <div class="builders-table__header-icons-wrp">
          <app-icon
            class="builders-table__header-item-icon"
            :class="{
              'builders-table__header-item-icon--active':
                orderBy === BuildersProject_OrderBy.TotalStaked &&
                orderDirection === OrderDirection.Asc,
            }"
            :name="$icons.triangleTop"
          />
          <app-icon
            class="builders-table__header-item-icon"
            :class="{
              'builders-table__header-item-icon--active':
                orderBy === BuildersProject_OrderBy.TotalStaked &&
                orderDirection === OrderDirection.Desc,
            }"
            :name="$icons.triangleTop"
          />
        </div>
      </button>
      <button
        class="builders-table__header-item"
        @click="
          $emit(
            'update-sorting',
            BuildersProject_OrderBy.WithdrawLockPeriodAfterDeposit,
          )
        "
      >
        <span class="builders-table__header-item-text">
          {{ $t('builders-table.withdraw-lock-period-th') }}
        </span>
        <div class="builders-table__header-icons-wrp">
          <app-icon
            class="builders-table__header-item-icon"
            :class="{
              'builders-table__header-item-icon--active':
                orderBy ===
                  BuildersProject_OrderBy.WithdrawLockPeriodAfterDeposit &&
                orderDirection === OrderDirection.Asc,
            }"
            :name="$icons.triangleTop"
          />
          <app-icon
            class="builders-table__header-item-icon"
            :class="{
              'builders-table__header-item-icon--active':
                orderBy ===
                  BuildersProject_OrderBy.WithdrawLockPeriodAfterDeposit &&
                orderDirection === OrderDirection.Desc,
            }"
            :name="$icons.triangleTop"
          />
        </div>
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
import {
  BuilderProjectFragment,
  BuildersProject_OrderBy,
  OrderDirection,
} from '@/types/graphql'
import { cn } from '@/theme/utils'

withDefaults(
  defineProps<{
    buildersProjects: BuilderProjectFragment[]
    orderBy: BuildersProject_OrderBy
    orderDirection: OrderDirection
  }>(),
  {},
)

defineEmits<{
  (e: 'update-sorting', orderBy: BuildersProject_OrderBy): void
}>()
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

.builders-table__header-icons-wrp {
  display: flex;
  flex-direction: column;
}

.builders-table__header-item-icon {
  @include square(10);

  &--active {
    color: var(--primary-main);
  }

  &:nth-child(2) {
    transform: rotate(180deg);
  }
}
</style>
