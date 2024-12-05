<template>
  <div class="delegates-list">
    <h3 class="delegates-list__title">
      {{ $t('delegates-list.title') }}
    </h3>
    <delegates-list-header
      :sorting="sortingOrder"
      :sorting-type="sortingType"
      @sort="chooseSortingOrder"
    />
    <div class="delegates-list__content">
      <div
        class="delegates-list__users-wrapper"
        :class="{ 'delegates-list__users-wrapper--small': !isPaginationShown }"
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
                :total-items="refsCount"
              />
            </div>
          </template>
        </template>
        <loader v-else class="delegates-list__system-message" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import DelegatesListHeader from './DelegatesListHeader.vue'
import DelegatesListItem from './DelegatesListItem.vue'
import { ErrorMessage, Loader, Pagination } from '@/common'
import { DelegatesUser } from '@/types'
import { computed, ref, watch } from 'vue'
import { DELEGATION_RIGHTS, SORTING_ORDER } from '@/enums'
import { DEFAULT_PAGE_LIMIT } from '@/const'
import { ErrorHandler } from '@/helpers'

const HARDCODED_LIST: DelegatesUser = [
  {
    address: '0xbD66AD8376415edD7F4eE0fDE32E759A763989E9',
    tokensStaked: '1000',
    tokensDelegated: '10.22',
    delegationRights: DELEGATION_RIGHTS.fullRights,
  },
  {
    address: '0x8ED80CCF20F1E284eb56F2Ea225636F1aAC647Ce',
    tokensStaked: '1200',
    tokensDelegated: '10.22',
    delegationRights: DELEGATION_RIGHTS.marketplaceRights,
  },
  {
    address: '0xAbCA5f27ee9249669039612b6119aEB154acaC97',
    tokensStaked: '1300',
    tokensDelegated: '10.22',
    delegationRights: DELEGATION_RIGHTS.providerRights,
  },
]

const currentPage = ref(1)
const isLoaded = ref(false)
const isLoadFailed = ref(false)
const sortingOrder = ref(SORTING_ORDER.none)
const usersList = ref<DelegatesUser[]>(HARDCODED_LIST)

const isPaginationShown = computed(
  () => usersList.value.length > DEFAULT_PAGE_LIMIT,
)

const loadPage = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    await new Promise(resolve => resolve())
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.process(e)
  }
  isLoaded.value = true
}

watch([currentPage, sortingOrder], loadPage, { immediate: true })
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

.delegates-list__users {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
}
</style>
