<template>
  <div class="flex flex-1 flex-col gap-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <span class="whitespace-nowrap text-textSecondaryMain">
          {{ $t('builders-item.you-have-staked-lbl') }}
        </span>
        <app-gradient-border-card
          :class="
            cn(
              'size-10 min-w-10 items-center justify-center',
              'bg-transparent p-2 text-textSecondaryMain',
            )
          "
        >
          {{ formattedUserStaked }}
          <span class="ml-1">{{ $t('builders-item.mor-currency') }}</span>
        </app-gradient-border-card>
      </div>
    </div>

    <div class="flex flex-1 flex-col">
      <template v-if="isLoaded">
        <template v-if="delegates?.length">
          <delegates-list-header
            :sorting="SORTING_ORDER.none"
            :sorting-type="DELEGATES_SORTING_TYPES.none"
          />

          <div class="flex flex-col gap-2">
            <delegates-list-item
              v-for="delegate in delegates"
              :key="delegate.id"
              :user="delegate"
              :fee="'0'"
            />
          </div>

          <div class="mt-6 flex items-center gap-4 self-start">
            <span class="text-textSecondaryMain">
              {{ $t('builders-item.stakers-lbl') }}
            </span>
            <app-gradient-border-card
              :class="
                cn(
                  'size-10 min-w-10 items-center justify-center',
                  'bg-transparent p-2 text-textSecondaryMain',
                )
              "
            >
              {{ totalDelegates }}
            </app-gradient-border-card>
          </div>

          <pagination
            v-if="shouldShowPagination"
            v-model:current-page="currentPage"
            :page-limit="DEFAULT_PAGE_LIMIT"
            :total-items="totalDelegates"
            class="mt-6 self-center"
          />
        </template>
        <template v-else>
          <no-data-message
            :title="$t('delegates-list.no-data-message')"
            :message="$t('delegates-list.no-data-message')"
          />
        </template>
      </template>
      <template v-else>
        <div class="flex flex-col gap-2">
          <skeleton v-for="i in 10" :key="i" class="h-16 animate-pulse" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLoad } from '@/composables'
import { ErrorHandler } from '@/helpers'
import { formatEther } from '@/utils'
import { DEFAULT_PAGE_LIMIT } from '@/const'
import { useSecondApolloClient } from '@/composables/use-second-apollo-client'
import { SORTING_ORDER, DELEGATES_SORTING_TYPES } from '@/enums'
import {
  AppButton,
  AppGradientBorderCard,
  NoDataMessage,
  Pagination,
  Skeleton,
} from '@/common'
import DelegatesListHeader from './DelegatesListHeader.vue'
import DelegatesListItem from './DelegatesListItem.vue'
import { gql } from '@apollo/client/core'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3ProvidersStore } from '@/store'
import type { SubnetUser } from '@/types/graphql'
import { cn } from '@/theme/utils'

defineEmits(['stake'])

const route = useRoute()
const apolloClient = useSecondApolloClient()
const web3ProvidersStore = useWeb3ProvidersStore()

const currentPage = ref(1)
const delegates = ref<SubnetUser[]>([])
const totalDelegates = ref(0)
const userStaked = ref(BigNumber.from('0'))

const loadDelegates = async (limit = DEFAULT_PAGE_LIMIT) => {
  try {
    const { data } = await apolloClient.value.query({
      query: gql`
        query GetDelegates($first: Int!, $skip: Int!, $subnetAddress: Bytes!) {
          subnetUsers(
            first: $first
            skip: $skip
            where: { subnet_: { id: $subnetAddress } }
            orderBy: staked
            orderDirection: desc
          ) {
            id
            address
            staked
            claimed
          }
          subnet(id: $subnetAddress) {
            totalUsers
          }
        }
      `,
      fetchPolicy: 'network-only',
      variables: {
        first: limit,
        skip: currentPage.value * limit - limit,
        subnetAddress: route.params.id as string,
      },
    })

    delegates.value = data.subnetUsers
    totalDelegates.value = Number(data.subnet?.totalUsers) || 0
    const currentUserDelegate = delegates.value.find(
      delegate =>
        delegate.address.toLowerCase() ===
        web3ProvidersStore.address.toLowerCase(),
    )
    userStaked.value = currentUserDelegate
      ? BigNumber.from(currentUserDelegate.staked || '0')
      : BigNumber.from('0')
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
  }
}

const formattedUserStaked = computed(() => {
  try {
    return formatEther(userStaked.value)
  } catch (error) {
    return '0'
  }
})

const { isLoaded } = useLoad(undefined, loadDelegates, {
  isLoadOnMount: true,
})

watch([() => route.params.id, currentPage], () => {
  loadDelegates()
})

const shouldShowPagination = computed(
  () => isLoaded.value && totalDelegates.value >= DEFAULT_PAGE_LIMIT,
)
</script>

<style scoped lang="scss">
.delegates-list {
  width: 100%;
}

.delegates-list__content {
  flex: 1;

  @include respond-to(medium) {
    margin: 0 auto;
  }
}

.delegates-list__system-message {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translateX(50%) translateY(-50%);

  @include respond-to(large) {
    position: static;
    transform: none;
    margin-top: toRem(24);
  }
}

.delegates-list__no-data-message {
  margin-top: toRem(24);
}

.delegates-list__users-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
  min-height: toRem(410);
  position: relative;

  &--small {
    min-height: fit-content;
  }

  @include respond-to(large) {
    min-height: fit-content;
  }
}

.delegates-list__users {
  display: flex;
  flex-direction: column;
  gap: toRem(10);
}

.delegates-list__pagination-wrapper {
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
