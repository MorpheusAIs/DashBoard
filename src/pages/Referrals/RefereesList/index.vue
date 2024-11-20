<template>
  <div class="referees-list">
    <h3 class="referees-list__title">
      {{ $t('referees-list.title') }}
    </h3>
    <div class="referees-list__content">
      <referees-list-navigation
        :sorting="sortingOrder"
        @sort="chooseSortingOrder"
      />
      <div
        class="referees-list__users-wrapper"
        :class="{ 'referees-list__users-wrapper--small': !isPaginationShown }"
      >
        <template v-if="isLoaded">
          <error-message
            v-if="isLoadFailed"
            class="referees-list__system-message"
            :message="$t('referees-list.error-message')"
          />
          <template v-else>
            <div class="referees-list__users">
              <referee-list-item
                v-for="(user, idx) in usersList"
                :key="user.id"
                :number="getUserNumberInTable(idx)"
                :address="user.user"
                :deposited-amount="humanizeDepositedAmount(user.amount)"
              />
            </div>
            <div
              v-if="isPaginationShown"
              class="referees-list__pagination-wrapper"
            >
              <pagination
                v-model:current-page="currentPage"
                :total-items="refsCount"
              />
            </div>
          </template>
        </template>
        <loader v-else class="referees-list__system-message" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import RefereeListItem from './RefereeListItem.vue'
import RefereesListNavigation from './RefereesListNavigation.vue'
import { SORTING_ORDER } from '@/enums'
import { ErrorMessage, Loader, Pagination } from '@/common'
import { useReferralInfo } from '@/composables'
import { ErrorHandler, roundNumber } from '@/helpers'
import { useRoute } from 'vue-router'
import { DEFAULT_PAGE_LIMIT } from '@/const'
import { UserReferral } from '@/types'
import { ethers } from 'ethers'

const props = defineProps<{
  poolId: number
}>()

const route = useRoute()
const { loadReferralDepositData, refsCount } = useReferralInfo(props.poolId)

const currentPage = ref(1)
const isLoaded = ref(false)
const isLoadFailed = ref(false)
const sortingOrder = ref(SORTING_ORDER.none)
const usersList = ref<UserReferral[]>([])

const isPaginationShown = computed(() => refsCount > DEFAULT_PAGE_LIMIT)

const chooseSortingOrder = (order: SORTING_ORDER) => {
  if (sortingOrder.value === order) {
    sortingOrder.value = SORTING_ORDER.none
    return
  }
  sortingOrder.value = order
}

const loadPage = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    usersList.value = await loadReferralDepositData(
      route.query.user,
      currentPage.value,
      DEFAULT_PAGE_LIMIT,
      sortingOrder.value,
      route.query.network,
    )
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.process(e)
  }
  isLoaded.value = true
}

const getUserNumberInTable = (numberInTable: number) =>
  numberInTable + 1 + (currentPage.value - 1) * DEFAULT_PAGE_LIMIT

const humanizeDepositedAmount = (amount: string) =>
  roundNumber(ethers.utils.formatUnits(amount))

watch(
  [
    currentPage,
    sortingOrder,
    () => route.query.user,
    () => route.query.network,
  ],
  loadPage,
  { immediate: true },
)
</script>

<style scoped lang="scss">
.referees-list__title {
  font-size: toRem(32);
  margin-bottom: toRem(24);
  font-weight: 700;

  @include respond-to(medium) {
    text-align: center;
  }
}

.referees-list__content {
  flex: 1;
  max-width: toRem(582);

  @include respond-to(medium) {
    margin: 0 auto;
  }
}

.referees-list__users {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
}

.referees-list__pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
}

.referees-list__users-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
  min-height: toRem(410);
  position: relative;

  &--small {
    min-height: fit-content;
  }
}

.referees-list__system-message {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translateX(50%) translateY(-50%);
}
</style>
