<template>
  <div class="delegation-providers">
    <h3 class="delegation-providers__title">
      {{ $t('delegation-providers.title') }}
    </h3>
    <div class="delegation-providers__table-header">
      <delegation-providers-navigation
        :sorting="sortingOrder"
        @sort="chooseSortingOrder"
      />
    </div>
    <delegation-providers-list />
  </div>
</template>

<script setup lang="ts">
import { SORTING_ORDER } from '@/enums'
import DelegationProvidersNavigation from './DelegationProvidersNavigation.vue'
import { ref } from 'vue'
import DelegationProvidersList from './DelegationProvidersList.vue'

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
.delegation-providers__table-header {
  margin-top: toRem(24);
}
</style>
