<template>
  <div class="delegation-providers-list">
    <div v-if="isSubnetsShown" class="delegation-providers-list__content">
      <div
        class="delegation-providers-list__users-wrapper"
        :class="{
          'delegation-providers-list__users-wrapper--small': !isPaginationShown,
        }"
      >
        <template v-if="isLoaded">
          <error-message
            v-if="isLoadFailed"
            class="delegation-providers-list__system-message"
            :message="$t('delegation-providers-list.error-message')"
          />
          <template v-else>
            <div class="delegation-providers-list__users">
              <delegation-providers-item
                v-for="(user, idx) in filteredSubnets"
                :key="idx"
                :user="user"
              />
            </div>
            <div
              v-if="isPaginationShown"
              class="delegation-providers-list__pagination-wrapper"
            >
              <pagination
                v-model:current-page="currentPage"
                :total-items="paginationItemsLength"
                :page-limit="DEFAULT_PAGE_LIMIT"
              />
            </div>
          </template>
        </template>
        <loader v-else class="delegation-providers-list__loader" />
      </div>
    </div>
    <no-data-message
      v-else
      class="delegation-providers-list__no-data-msg"
      :message="$t('delegation-providers-list.no-data-msg')"
    />
  </div>
</template>

<script setup lang="ts">
import DelegationProvidersItem from './DelegationProvidersItem.vue'

import { ErrorMessage, Loader, Pagination, NoDataMessage } from '@/common'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { DELEGATES_SORTING_TYPES, SORTING_ORDER } from '@/enums'
import { SubnetItem } from '@/types'
import { DEFAULT_PAGE_LIMIT } from '@/const'
import { bus, BUS_EVENTS, ErrorHandler, fetchSubnets, sleep } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { useSecondApolloClient } from '@/composables/use-second-apollo-client'

const props = defineProps<{
  filteredIds: string[]
  sortingOrder: SORTING_ORDER
  sortingType: DELEGATES_SORTING_TYPES
}>()

const web3ProvidersStore = useWeb3ProvidersStore()

const currentPage = ref(1)
const isLoaded = ref(false)
const isLoadFailed = ref(false)
const subnetsList = ref<SubnetItem[]>([])
const totalSubnets = ref(0)

const filteredSubnets = computed(() =>
  subnetsList.value.filter(subnet => !props.filteredIds.includes(subnet.id)),
)

const isSubnetsShown = computed(
  () => subnetsList.value.length > 0 && totalSubnets.value > 0,
)

const paginationItemsLength = computed(
  () => totalSubnets.value - props.filteredIds.length,
)

const isPaginationShown = computed(
  () => paginationItemsLength.value > DEFAULT_PAGE_LIMIT,
)

const apolloClient = useSecondApolloClient()

const loadPage = async () => {
  isLoaded.value = false
  isLoadFailed.value = false

  try {
    subnetsList.value = []

    const data = await fetchSubnets(
      apolloClient.value,
      web3ProvidersStore.address,
      {
        ...(props.sortingOrder !== SORTING_ORDER.none && {
          order: props.sortingOrder,
        }),
        ...(props.sortingType !== DELEGATES_SORTING_TYPES.none && {
          type: props.sortingType,
        }),
        skip: (currentPage.value - 1) * DEFAULT_PAGE_LIMIT,
        first: DEFAULT_PAGE_LIMIT,
      },
    )

    subnetsList.value = data.subnets || []
    totalSubnets.value = Number(data.counters?.[0]?.totalSubnets) || 0
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.process(e)
  }

  isLoaded.value = true
}

onMounted(() => {
  bus.on(BUS_EVENTS.changedCurrentUserRefReward, async () => {
    await sleep(1000)
    loadPage()
  })
  bus.on(BUS_EVENTS.changedDelegation, async () => {
    await sleep(1000)
    loadPage()
  })
})

onBeforeUnmount(() => {
  bus.off(BUS_EVENTS.changedCurrentUserRefReward, () => [])
  bus.off(BUS_EVENTS.changedDelegation, () => [])
})

watch(
  () => [
    currentPage.value,
    props.sortingOrder,
    props.sortingType,
    web3ProvidersStore.address,
  ],
  loadPage,
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
.delegation-providers-list__content {
  flex: 1;

  @include respond-to(medium) {
    margin: 0 auto;
  }
}

.delegation-providers-list__system-message {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translateX(50%) translateY(-50%);
}

.delegation-providers-list__users-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
  min-height: toRem(410);
  position: relative;

  &--small {
    min-height: fit-content;
  }
}

.delegation-providers-list__users {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
}

.delegation-providers-list__pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
}

.delegation-providers-list__no-data-msg {
  margin-top: toRem(24);
}
</style>
