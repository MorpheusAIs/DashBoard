<template>
  <div class="delegation-providers-list">
    <div class="delegation-providers-list__content">
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
                v-for="(user, idx) in usersList"
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
                :total-items="refsCount"
              />
            </div>
          </template>
        </template>
        <loader v-else class="delegation-providers-list__system-message" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorMessage, Loader, Pagination } from '@/common'
import { computed, ref, watch } from 'vue'
import { SORTING_ORDER } from '@/enums'
import { DelegationUser } from '@/types'
import { DEFAULT_PAGE_LIMIT } from '@/const'
import { ErrorHandler } from '@/helpers'
import DelegationProvidersItem from './DelegationProvidersItem.vue'

const HARDCODED_LIST: DelegationUser[] = [
  {
    address: '0xbD66AD8376415edD7F4eE0fDE32E759A763989E9',
    tokensDelegated: '1000',
    tokensClaimed: '500',
    networkFee: '1.9719%',
  },
  {
    address: '0x8ED80CCF20F1E284eb56F2Ea225636F1aAC647Ce',
    tokensDelegated: '1200',
    tokensClaimed: '500',
    networkFee: '1.9719%',
  },
  {
    address: '0xAbCA5f27ee9249669039612b6119aEB154acaC97',
    tokensDelegated: '1300',
    tokensClaimed: '500',
    networkFee: '1.9719%',
  },
]

const currentPage = ref(1)
const isLoaded = ref(false)
const isLoadFailed = ref(false)
const sortingOrder = ref(SORTING_ORDER.none)
const usersList = ref<DelegationUser[]>(HARDCODED_LIST)

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
</style>
