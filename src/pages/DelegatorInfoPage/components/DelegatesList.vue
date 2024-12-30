<template>
  <div class="delegates-list">
    <div class="delegates-list__title-wrapper">
      <div class="delegates-list__title-text-wrapper">
        <h3 class="delegates-list__title">
          {{ $t('delegates-list.title') }}
        </h3>
        <div class="delegates-list__amount">
          {{ usersList.length ?? 0 }}
        </div>
      </div>
      <app-button
        size="small"
        :text="$t('delegates-list.stake-button')"
        @click="openDelegateModal"
      />
    </div>
    <no-data-message
      v-if="isLoaded && !isLoadFailed && !usersList.length"
      class="delegates-list__no-data-message"
      :message="$t('delegates-list.no-data-message')"
    />
    <template v-else>
      <delegates-list-header
        class="delegates-list__list"
        :sorting="sortingOrder"
        :sorting-type="sortingType"
        @sort="chooseSortingOrder"
      />
      <div class="delegates-list__content">
        <div
          class="delegates-list__users-wrapper"
          :class="{
            'delegates-list__users-wrapper--small': !isPaginationShown,
          }"
        >
          <template v-if="isLoaded">
            <error-message
              v-if="isLoadFailed"
              class="delegates-list__system-message"
              :message="$t('delegates-list.error-message')"
            />
            <template v-else>
              <div class="delegates-list__users">
                <delegates-list-item
                  v-for="(user, idx) in usersList"
                  :key="idx"
                  :user="user"
                />
              </div>
              <div
                v-if="isPaginationShown"
                class="delegates-list__pagination-wrapper"
              >
                <pagination
                  v-model:current-page="currentPage"
                  :total-items="totalUsers"
                  :page-limit="DEFAULT_PAGE_LIMIT"
                />
              </div>
            </template>
          </template>
          <loader v-else class="delegates-list__system-message" />
        </div>
      </div>
    </template>
    <delegate-tokens-modal
      v-model:is-shown="isDelegateModalOpened"
      :delegate-address="delegateAddress"
    />
  </div>
</template>
<script setup lang="ts">
import DelegateTokensModal from '@/pages/DelegationPage/components/DelegateTokensModal.vue'
import DelegatesListHeader from './DelegatesListHeader.vue'
import DelegatesListItem from './DelegatesListItem.vue'

import {
  AppButton,
  ErrorMessage,
  Loader,
  Pagination,
  NoDataMessage,
} from '@/common'
import { SubnetProvider } from '@/types'
import { computed, ref, watch } from 'vue'
import { DELEGATES_SORTING_TYPES, SORTING_ORDER } from '@/enums'
import { DEFAULT_PAGE_LIMIT } from '@/const'
import { ErrorHandler, fetchProviders } from '@/helpers'
import { useRoute } from 'vue-router'
import { useWeb3ProvidersStore } from '@/store'

const route = useRoute()
const web3ProvidersStore = useWeb3ProvidersStore()

const currentPage = ref(1)
const isLoaded = ref(false)
const isLoadFailed = ref(false)
const sortingOrder = ref(SORTING_ORDER.none)
const sortingType = ref(DELEGATES_SORTING_TYPES.none)
const usersList = ref<SubnetProvider[]>([])
const isDelegateModalOpened = ref(false)
const totalUsers = ref(0)

const isPaginationShown = computed(() => totalUsers.value > DEFAULT_PAGE_LIMIT)

const loadPage = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const data = await fetchProviders(
      web3ProvidersStore.networkId,
      String(route.query.subnetAddress),
      {
        ...(sortingOrder.value !== SORTING_ORDER.none && {
          order: sortingOrder.value,
        }),
        ...(sortingType.value !== DELEGATES_SORTING_TYPES.none && {
          type: sortingType.value,
        }),
        skip: (currentPage.value - 1) * DEFAULT_PAGE_LIMIT,
        first: DEFAULT_PAGE_LIMIT,
      },
    )

    usersList.value = data.subnetUsers || []
    totalUsers.value = Number(data.subnets[0].totalUsers) || 0
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.process(e)
  }
  isLoaded.value = true
}

const openDelegateModal = () => {
  isDelegateModalOpened.value = true
}

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

const delegateAddress = computed(() => String(route.query.subnetAddress))

watch([currentPage, sortingOrder], loadPage, { immediate: true })
</script>

<style scoped lang="scss">
.delegates-list {
  width: 100%;
}

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

.delegates-list__no-data-message {
  margin-top: toRem(24);
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

.delegates-list__users {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
}

.delegates-list__title-wrapper {
  display: flex;
  justify-content: space-between;
}

.delegates-list__title-text-wrapper {
  display: flex;
  gap: toRem(16);
  align-items: center;
}

.delegates-list__amount {
  display: flex;
  font-weight: 500;
  color: var(--text-secondary-light);
  align-items: center;
  justify-content: center;
  width: toRem(37);
  height: toRem(37);
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    95.36deg,
    rgba(var(--white-rgb), 0.48) 0%,
    rgba(var(--white-rgb), 0.08) 100%
  );
}

.delegates-list__list {
  margin-top: toRem(24);
}
</style>
