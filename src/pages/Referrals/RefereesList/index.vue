<template>
  <div class="referees-list">
    <h3 class="referees-list__title">
      {{ $t('referees-list.title') }}
    </h3>
    <div class="referees-list__content">
      <referees-list-navigation
        :sorting="sortingOrder"
        @sort="chooseSortingOrder"
      />
      <div class="referees-list__users">
        <referee-list-item
          :number="'1'"
          :address="'0xbd66ad8376415edd7f4ee0fde32e759a763989e9'"
          :deposited-amount="'25'"
        />
        <referee-list-item
          :number="'1'"
          :address="'0xbd66ad8376415edd7f4ee0fde32e759a763989e9'"
          :deposited-amount="'25'"
        />
        <referee-list-item
          :number="'1'"
          :address="'0xbd66ad8376415edd7f4ee0fde32e759a763989e9'"
          :deposited-amount="'25'"
        />
      </div>
      <div class="referees-list__pagination-wrapper">
        <pagination />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RefereeListItem from './RefereeListItem.vue'
import RefereesListNavigation from './RefereesListNavigation.vue'
import { SORTING_ORDER } from '@/enums'
import { Pagination } from '@/common'

const sortingOrder = ref(SORTING_ORDER.none)

const chooseSortingOrder = (order: SORTING_ORDER) => {
  if (sortingOrder.value === order) {
    sortingOrder.value = SORTING_ORDER.none
    return
  }
  sortingOrder.value = order
}
</script>

<style scoped lang="scss">
.referees-list__title {
  font-size: toRem(32);
  margin-bottom: toRem(24);
  font-weight: 700;
}

.referees-list__content {
  max-width: toRem(582);
}

.referees-list__users {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
}
</style>
