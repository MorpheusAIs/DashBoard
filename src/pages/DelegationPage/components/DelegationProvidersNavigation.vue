<template>
  <!--TODO: MOVE TO ONE COMPONENT WITH RefereesListNavigation.vue-->
  <div class="delegation-providers-navigation">
    <div class="delegation-providers-navigation__cel">
      <span class="delegation-providers-navigation__cel-text">
        {{ $t('delegation-providers-navigation.address-text') }}
      </span>
    </div>
    <div class="delegation-providers-navigation__cel">
      <table-sorting-header-column
        :sorting="
          type === DELEGATES_SORTING_TYPES.fee ? sorting : SORTING_ORDER.none
        "
        :text="$t('delegation-providers-navigation.subnet-fee-text')"
        @sort="e => changeSorting(e, DELEGATES_SORTING_TYPES.fee)"
      />
    </div>
    <div class="delegation-providers-navigation__cel">
      <table-sorting-header-column
        :sorting="
          type === DELEGATES_SORTING_TYPES.totalStaked
            ? sorting
            : SORTING_ORDER.none
        "
        :text="
          $t('delegation-providers-navigation.staked-text', {
            asset: web3ProvidersStore.rewardsTokenSymbol,
          })
        "
        @sort="e => changeSorting(e, DELEGATES_SORTING_TYPES.totalStaked)"
      />
    </div>
    <div class="delegation-providers-navigation__cel">
      <table-sorting-header-column
        :sorting="
          type === DELEGATES_SORTING_TYPES.totalClaimed
            ? sorting
            : SORTING_ORDER.none
        "
        :text="
          $t('delegation-providers-navigation.claimed-text', {
            asset: web3ProvidersStore.rewardsTokenSymbol,
          })
        "
        @sort="e => changeSorting(e, DELEGATES_SORTING_TYPES.totalClaimed)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TableSortingHeaderColumn } from '@/common'
import { DELEGATES_SORTING_TYPES, SORTING_ORDER } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'

defineProps<{
  sorting: SORTING_ORDER
  type: DELEGATES_SORTING_TYPES
}>()

const emit = defineEmits<{
  (e: 'sort', order: SORTING_ORDER, type: DELEGATES_SORTING_TYPES): void
}>()

const web3ProvidersStore = useWeb3ProvidersStore()

const changeSorting = (order: SORTING_ORDER, type: DELEGATES_SORTING_TYPES) => {
  emit('sort', order, type)
}
</script>

<style scoped lang="scss">
.delegation-providers-navigation {
  display: grid;
  grid-template-columns:
    minmax(toRem(100), 1fr) repeat(3, minmax(toRem(80), 1fr))
    toRem(80);
  gap: toRem(16);
  padding: toRem(8) toRem(32);
}

.delegation-providers-navigation__cel {
  display: flex;
  gap: toRem(12);
  align-items: center;
}

.delegation-providers-navigation__cel-text {
  font-size: toRem(16);
  color: var(--text-tertiary-main);
}
</style>
