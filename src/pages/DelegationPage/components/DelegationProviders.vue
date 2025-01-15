<template>
  <div class="delegation-providers">
    <h3 class="delegation-providers__title">
      {{ $t('delegation-providers.title') }}
    </h3>
    <div class="delegation-providers__table-header">
      <delegation-providers-navigation
        :sorting="sortingOrder"
        :type="sortingType"
        @sort="chooseSortingOrder"
      />
    </div>
    <div class="delegation-providers__content-wrp">
      <template v-if="subnets.ownSubnets.length">
        <delegation-providers-item
          v-for="user in subnets.ownSubnets"
          :key="user.id"
          :user="user"
          :secondary="true"
        />
      </template>
      <div
        v-if="subnets.stakedSubnets.length"
        class="delegation-providers__content"
      >
        <h5 class="delegation-providers__content-title">
          {{ $t('delegation-providers.you-delegated-text') }}
        </h5>
        <delegation-providers-item
          v-for="user in subnets.stakedSubnets"
          :tertiary="true"
          :key="user.id"
          :user="user"
        />
      </div>
      <div class="delegation-providers__content">
        <h5
          v-if="subnets.ownSubnets.length || subnets.stakedSubnets.length"
          class="delegation-providers__content-title"
        >
          {{ $t('delegation-providers.other-subnets-text') }}
        </h5>
        <delegation-providers-list
          :filtered-ids="filteredIds"
          :sorting-order="sortingOrder"
          :sorting-type="sortingType"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DelegationProvidersNavigation from './DelegationProvidersNavigation.vue'
import DelegationProvidersList from './DelegationProvidersList.vue'
import DelegationProvidersItem from './DelegationProvidersItem.vue'

import { SORTING_ORDER, DELEGATES_SORTING_TYPES } from '@/enums'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  fetchOwnSubnets,
  sleep,
} from '@/helpers'
import { SubnetItem } from '@/types'
import { useWeb3ProvidersStore } from '@/store'
import { useSecondApolloClient } from '@/composables/use-second-apollo-client'

const web3ProvidersStore = useWeb3ProvidersStore()

const sortingOrder = ref(SORTING_ORDER.none)
const sortingType = ref(DELEGATES_SORTING_TYPES.none)
const isLoaded = ref(false)
const isLoadFailed = ref(false)

const subnets = ref({
  ownSubnets: [] as SubnetItem[],
  stakedSubnets: [] as SubnetItem[],
})

const filteredIds = computed(() =>
  subnets.value.stakedSubnets.map(item => item.id),
)

const chooseSortingOrder = (
  order: SORTING_ORDER,
  type: DELEGATES_SORTING_TYPES,
) => {
  if (sortingOrder.value === order && sortingType.value === type) {
    sortingOrder.value = SORTING_ORDER.none
    sortingType.value = DELEGATES_SORTING_TYPES.none
    return
  }

  sortingOrder.value = order
  sortingType.value = type
}

const apolloClient = useSecondApolloClient()

const init = async () => {
  isLoaded.value = false
  isLoadFailed.value = false

  try {
    const data = await fetchOwnSubnets(
      apolloClient.value,
      web3ProvidersStore.address,
      {
        ...(sortingOrder.value !== SORTING_ORDER.none && {
          order: sortingOrder.value,
        }),
        ...(sortingType.value !== DELEGATES_SORTING_TYPES.none && {
          type: sortingType.value,
        }),
      },
    )

    subnets.value.ownSubnets = data.subnets || []
    subnets.value.stakedSubnets =
      data.subnetUsers?.map(item => item.subnet) || []
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.process(e)
  }

  isLoaded.value = true
}

watch(
  () => [sortingOrder.value, sortingType.value, web3ProvidersStore.address],
  init,
  {
    immediate: true,
  },
)

onMounted(() => {
  bus.on(BUS_EVENTS.changedCurrentUserRefReward, async () => {
    await sleep(1000)
    init()
  })
  bus.on(BUS_EVENTS.changedDelegation, async () => {
    await sleep(1000)
    init()
  })
})

onBeforeUnmount(() => {
  bus.off(BUS_EVENTS.changedCurrentUserRefReward, init)
  bus.off(BUS_EVENTS.changedDelegation, init)
})
</script>

<style scoped lang="scss">
.delegation-providers {
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
}

.delegation-providers__table-header {
  margin-top: toRem(24);
}

.delegation-providers__content-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(32);
}

.delegation-providers__content {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
}

.delegation-providers__content-title {
  font-size: toRem(14);
  color: var(--text-tertiary-main);
  margin-bottom: toRem(10);
}
</style>
