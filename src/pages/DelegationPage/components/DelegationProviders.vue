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
    <div class="delegation-providers__content-wrp">
      <delegation-providers-item :user="currentUser" />
      <div v-if="delegatedToUsers.length" class="delegation-providers__content">
        <h5 class="delegation-providers__content-title">
          {{ $t('delegation-providers.you-delegated-text') }}
        </h5>
        <delegation-providers-item
          v-for="user in delegatedToUsers"
          :key="user.address"
          :user="user"
        />
      </div>
      <div class="delegation-providers__content">
        <h5 class="delegation-providers__content-title">
          {{ $t('delegation-providers.other-subnets-text') }}
        </h5>
        <delegation-providers-list />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SORTING_ORDER } from '@/enums'
import DelegationProvidersNavigation from './DelegationProvidersNavigation.vue'
import { computed, ref } from 'vue'
import DelegationProvidersList from './DelegationProvidersList.vue'
import DelegationProvidersItem from './DelegationProvidersItem.vue'
import { DelegationUser } from '@/types'

const sortingOrder = ref(SORTING_ORDER.none)

const currentUser = computed<DelegationUser>(() => ({
  address: '0xbD66AD8376415edD7F4eE0fDE32E759A763989E9',
  tokensDelegated: '1000',
  networkFee: '1.9719%',
}))

const delegatedToUsers = computed<DelegationUser[]>(() => [
  {
    address: '0xbD66AD8376415edD7F4eE0fDE32E759A763989E9',
    tokensDelegated: '1000',
    networkFee: '1.9719%',
  },
  {
    address: '0xbD66AD8376415edD7F4eE0fDE32E759A763989E9',
    tokensDelegated: '1000',
    networkFee: '1.9719%',
  },
])

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

.delegation-providers__content-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(32);
}

.delegation-providers__content-title {
  font-size: toRem(14);
  color: var(--text-tertiary-main);
  margin-bottom: toRem(10);
}
</style>
