<template>
  <div class="delegates-list-header">
    <div class="delegates-list-header__cel">
      <span class="delegates-list-header__cel-text">
        {{ $t('delegates-list-header.address-text') }}
      </span>
    </div>
    <div class="delegates-list-header__cel">
      <table-sorting-header-column
        :sorting="
          sortingType === DELEGATES_SORTING_TYPES.staked
            ? sorting
            : SORTING_ORDER.none
        "
        :text="
          $t('delegates-list-header.delegated-text', {
            asset: web3ProvidersStore.rewardsTokenSymbol,
          })
        "
        @sort="e => changeSorting(e, DELEGATES_SORTING_TYPES.staked)"
      />
    </div>
    <div class="delegates-list-header__cel">
      <table-sorting-header-column
        :sorting="
          sortingType === DELEGATES_SORTING_TYPES.claimed
            ? sorting
            : SORTING_ORDER.none
        "
        :text="
          $t('delegates-list-header.claimed-text', {
            asset: web3ProvidersStore.rewardsTokenSymbol,
          })
        "
        @sort="e => changeSorting(e, DELEGATES_SORTING_TYPES.claimed)"
      />
    </div>
    <div class="delegates-list-header__cel">
      <table-sorting-header-column
        :sorting="
          sortingType === DELEGATES_SORTING_TYPES.fee
            ? sorting
            : SORTING_ORDER.none
        "
        :text="
          $t('delegates-list-header.fee-text', {
            asset: web3ProvidersStore.rewardsTokenSymbol,
          })
        "
        @sort="e => changeSorting(e, DELEGATES_SORTING_TYPES.fee)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TableSortingHeaderColumn } from '@/common'
import { SORTING_ORDER, DELEGATES_SORTING_TYPES } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'

defineProps<{
  sorting: SORTING_ORDER
  sortingType: DELEGATES_SORTING_TYPES
}>()

const web3ProvidersStore = useWeb3ProvidersStore()

const emit = defineEmits<{
  (e: 'sort', order: SORTING_ORDER, type: DELEGATES_SORTING_TYPES): void
}>()

const changeSorting = (order: SORTING_ORDER, type: DELEGATES_SORTING_TYPES) => {
  emit('sort', order, type)
}
</script>

<style scoped lang="scss">
.delegates-list-header {
  display: grid;
  grid-template-columns: repeat(4, minmax(toRem(100), 1fr));
  gap: toRem(32);
  padding: toRem(8) toRem(32);
}

.delegates-list-header__cel {
  display: flex;
  gap: toRem(12);
  align-items: center;
  justify-content: flex-end;

  &:first-child {
    justify-content: flex-start;
  }
}

.delegates-list-header__cel-text {
  font-size: toRem(16);
  color: var(--text-tertiary-main);

  @include respond-to(small) {
    font-size: toRem(14);
  }
}

.delegates-list-header__buttons {
  display: flex;
  flex-direction: column;
  gap: toRem(4);
}

.delegates-list-header__button {
  &:nth-child(2) {
    transform: rotate(180deg);
  }
}

.delegates-list-header__button-icon {
  width: toRem(10);
  height: toRem(5);
  color: var(--background-tertiary-light);

  &--active {
    color: var(--primary-main);
  }
}
</style>
