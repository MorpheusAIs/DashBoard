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
        :sorting="sorting"
        :text="$t('delegation-providers-navigation.network-fee-text')"
        @sort="() => {}"
      />
    </div>
    <div class="delegation-providers-navigation__cel">
      <table-sorting-header-column
        :sorting="sorting"
        :text="
          $t('delegation-providers-navigation.delegated-text', {
            asset: web3ProvidersStore.rewardsTokenSymbol,
          })
        "
        @sort="() => {}"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TableSortingHeaderColumn } from '@/common'
import { SORTING_ORDER } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'

defineProps<{
  sorting: SORTING_ORDER
}>()

const web3ProvidersStore = useWeb3ProvidersStore()
</script>

<style scoped lang="scss">
.delegation-providers-navigation {
  display: grid;
  grid-template-columns: repeat(3, minmax(toRem(100), 1fr));
  gap: toRem(32);
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
