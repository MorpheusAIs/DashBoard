<template>
  <div class="flex w-full flex-col items-center">
    <div
      class="flex max-w-[700px] flex-col items-center justify-center gap-6 pb-6 pt-16 text-center"
    >
      <h2 class="typography-h1">
        {{ $t('builders-list.title') }}
      </h2>
      <span class="builders-list__hero-desc">
        {{ $t('builders-list.description') }}
      </span>
      <span class="builders-list__hero-desc-underline">
        {{ $t('builders-list.description-underline') }}
      </span>
      <div class="flex items-center gap-6">
        <app-button
          scheme="filled"
          color="secondary"
          @click="
            () => {
              isCreateBuilderModalShown = true
            }
          "
          :disabled="!provider.isConnected"
        >
          {{ $t('builders-list.create-builder-btn') }}
        </app-button>
      </div>
    </div>

    <div class="self-start w-full flex justify-between items-center mt-16">
      <h2 class="text-textSecondaryMain">
        {{ $t('builders-list.main-table-title') }}
      </h2>

      <div
        class="builders-list__search relative flex items-center justify-center w-10 h-10"
        :class="{
          'builders-list__search--active': searchQuery,
        }"
      >
        <input-field
          v-model="searchQuery"
          :placeholder="$t('builders-list.search-placeholder')"
        />
        <app-icon :name="$icons.search" />
      </div>
    </div>

    <template v-if="buildersProjectsState.isLoaded.value">
      <template v-if="buildersProjectsState.isLoadFailed.value">
        <error-message
          :message="$t('builders-list.loading-projects-error-msg')"
        />
      </template>
      <template v-else-if="listData.buildersProjects.length">
        <builders-table
          class="mt-8"
          :builders-projects="listData.buildersProjects"
          v-model:order-by-model="orderBy"
          v-model:order-direction-model="orderDirection"
        />
      </template>
      <template v-else>
        <no-data-message
          :message="$t('builders-list.builders-projects-empty-msg')"
        />
      </template>
    </template>
    <skeleton-table
      v-else
      :rows="DEFAULT_BUILDERS_PAGE_LIMIT"
      sizing="1fr"
      :schemes="['medium']"
      common-skeleton-class-names="min-h-[72px]"
    />

    <pagination
      v-if="
        listData.buildersCounters?.totalBuildersProjects &&
        buildersProjectsState.isLoaded.value &&
        listData.buildersCounters?.totalBuildersProjects >
          DEFAULT_BUILDERS_PAGE_LIMIT
      "
      v-model:current-page="currentPage"
      :page-limit="DEFAULT_BUILDERS_PAGE_LIMIT"
      :total-items="+listData.buildersCounters?.totalBuildersProjects"
      class="mt-6"
    />

    <h2
      v-if="listData.userAccountBuildersProjects.length"
      class="mt-16 self-start text-textSecondaryMain"
    >
      {{ $t('builders-list.account-projects-table-title') }}
    </h2>

    <div class="mt-8 w-full">
      <template v-if="buildersProjectsState.isLoaded.value">
        <template v-if="buildersProjectsState.isLoadFailed.value">
          <error-message
            :message="$t('builders-list.loading-account-projects-error-msg')"
          />
        </template>
        <template v-else-if="listData.userAccountBuildersProjects.length">
          <builders-table
            class="w-full"
            :builders-projects="listData.userAccountBuildersProjects"
            v-model:order-by-model="orderBy"
            v-model:order-direction-model="orderDirection"
          />
        </template>
      </template>
      <skeleton-table
        v-else
        :rows="DEFAULT_BUILDERS_PAGE_LIMIT"
        sizing="1fr"
        :schemes="['medium']"
        common-skeleton-class-names="min-h-[72px]"
      />
    </div>

    <builder-form-modal
      v-model:is-shown="isCreateBuilderModalShown"
      @submitted="handleBuilderCreated"
    />
  </div>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce'
import {
  AppButton,
  AppIcon,
  ErrorMessage,
  NoDataMessage,
  Pagination,
  SkeletonTable,
} from '@/common'
import BuildersTable from '@/pages/Builders/pages/BuildersList/components/BuildersTable/index.vue'
import BuilderFormModal from '@/pages/Builders/components/BuilderFormModal.vue'
import {
  BuildersProject_OrderBy,
  CombinedBuildersList,
  CombinedBuildersListFilteredByPredefinedBuilders,
  CombinedBuildersListFilteredByPredefinedBuildersQuery,
  CombinedBuildersListFilteredByPredefinedBuildersQueryVariables,
  CombinedBuildersListQuery,
  CombinedBuildersListQueryVariables,
  OrderDirection,
} from '@/types/graphql'
import { provide, ref, watch } from 'vue'
import { DEFAULT_BUILDERS_PAGE_LIMIT } from '@/const'
import { useRoute, useRouter } from 'vue-router'
import { useWeb3ProvidersStore } from '@/store'
import { ROUTE_NAMES } from '@/enums'
import { useLoad } from '@/composables'
import { storeToRefs } from 'pinia'
import { useSecondApolloClient } from '@/composables/use-second-apollo-client'
import { NetworkTypes } from '@config'
import predefinedBuildersMeta from '@/assets/predefined-builders-meta.json'
import { InputField } from '@/fields'

type LoadBuildersResponse = {
  buildersProjects: CombinedBuildersListQuery['buildersProjects']
  userAccountBuildersProjects: CombinedBuildersListQuery['buildersProjects']
  buildersCounters: CombinedBuildersListQuery['counters'][0]
}

defineOptions({
  inheritAttrs: false,
})

const route = useRoute()
const router = useRouter()

const { provider, networkType } = storeToRefs(useWeb3ProvidersStore())

const currentPage = ref(1)
const searchQuery = ref('')

const orderBy = ref(BuildersProject_OrderBy.TotalStaked)
const orderDirection = ref(OrderDirection.Desc)

const isCreateBuilderModalShown = ref(false)

const buildersApolloClient = useSecondApolloClient()

const { data: allPredefinedBuilders } = useLoad<LoadBuildersResponse>(
  {
    buildersProjects: [],
    userAccountBuildersProjects: [],
    buildersCounters: {} as CombinedBuildersListQuery['counters'][0],
  },
  async (): Promise<LoadBuildersResponse> => {
    const { data } = await buildersApolloClient.value.query<
      CombinedBuildersListFilteredByPredefinedBuildersQuery,
      CombinedBuildersListFilteredByPredefinedBuildersQueryVariables
    >({
      query: CombinedBuildersListFilteredByPredefinedBuilders,
      fetchPolicy: 'network-only',
      variables: {
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        nameIn: predefinedBuildersMeta.map(el => el.name),
        nameFilter: searchQuery.value,

        address: provider.value.selectedAddress,
      },
    })

    return {
      buildersProjects: data.buildersProjects,
      userAccountBuildersProjects: data.buildersUsers.map(
        el => el.buildersProject,
      ),
      buildersCounters: {
        id: '',
        totalBuildersProjects: data.buildersProjects.length,
        totalSubnets: 0,
      },
    }
  },
  {
    isLoadOnMount: networkType.value === NetworkTypes.Mainnet,
    reloadArgs: [
      orderBy,
      orderDirection,
      () => route.query.user,
      () => route.query.network,
      () => provider.value.chainId,
    ],
    updateArgs: [orderBy, orderDirection],
  },
)

const paginateThroughAllPredefinedBuilders = async (args: {
  skip: number
  first: number
  orderBy: BuildersProject_OrderBy
  orderDirection: OrderDirection
  filter?: string
}): Promise<LoadBuildersResponse> => {
  const filteredBuilders = allPredefinedBuilders.value.buildersProjects.filter(
    el =>
      el.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  const buildersProjects = filteredBuilders.slice(
    args.skip,
    args.skip + args.first,
  )
  const userAccountBuildersProjects =
    allPredefinedBuilders.value.userAccountBuildersProjects.filter(
      el => el.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  const buildersCounters = allPredefinedBuilders.value.buildersCounters
  buildersCounters.totalBuildersProjects = filteredBuilders.length

  return {
    buildersProjects,
    userAccountBuildersProjects,
    buildersCounters,
  }
}

const {
  data: listData,
  reload: reloadList,
  update: updateList,
  ...buildersProjectsState
} = useLoad<LoadBuildersResponse>(
  {
    buildersProjects: [],
    userAccountBuildersProjects: [],
    buildersCounters: {} as CombinedBuildersListQuery['counters'][0],
  },
  async () => {
    if (networkType.value === NetworkTypes.Mainnet) {
      return paginateThroughAllPredefinedBuilders({
        first: DEFAULT_BUILDERS_PAGE_LIMIT,
        skip:
          currentPage.value * DEFAULT_BUILDERS_PAGE_LIMIT -
          DEFAULT_BUILDERS_PAGE_LIMIT,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        filter: searchQuery.value,
      })
    }

    const { data } = await buildersApolloClient.value.query<
      CombinedBuildersListQuery,
      CombinedBuildersListQueryVariables
    >({
      query: CombinedBuildersList,
      fetchPolicy: 'network-only',
      variables: {
        first: DEFAULT_BUILDERS_PAGE_LIMIT,
        skip:
          currentPage.value * DEFAULT_BUILDERS_PAGE_LIMIT -
          DEFAULT_BUILDERS_PAGE_LIMIT,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        nameFilter: searchQuery.value,

        address: provider.value.selectedAddress,
      },
    })

    const buildersProjects = data.buildersProjects
    const userAccountBuildersProjects = data.buildersUsers.map(
      el => el.buildersProject,
    )
    const buildersCounters = data.counters[0]

    return {
      buildersProjects,
      userAccountBuildersProjects,
      buildersCounters,
    }
  },
  {
    isLoadOnMount: networkType.value === NetworkTypes.Testnet,
    reloadArgs: [
      currentPage,
      () => route.query.user,
      () => route.query.network,
      () => provider.value.chainId,
      networkType.value === NetworkTypes.Mainnet
        ? () => allPredefinedBuilders.value
        : undefined,
    ],
    updateArgs:
      networkType.value === NetworkTypes.Testnet
        ? [orderBy, orderDirection]
        : [],
  },
)

const handleBuilderCreated = async (poolId: string) => {
  isCreateBuilderModalShown.value = false
  await router.push({
    name: ROUTE_NAMES.appBuildersItem,
    params: {
      id: poolId,
    },
  })
}

provide('reloadBuildersProjects', reloadList)
provide('updateBuildersProjects', updateList)
provide('reloadUserAccountBuildersProjects', reloadList)
provide('updateUserAccountBuildersProjects', updateList)

watch(
  () => searchQuery.value,
  debounce(() => {
    reloadList()
  }, 500),
)
</script>

<style scoped lang="scss">
.builders-list__hero-desc {
  font-size: toRem(17);
  line-height: toRem(25.5);
}

.builders-list__hero-desc-underline {
  text-align: center;
  font-size: toRem(17);
  line-height: toRem(25.5);
  margin-bottom: toRem(8);
}

.builders-list__search {
  background: linear-gradient(
    95.36deg,
    rgba(57, 99, 58, 0.04) 0%,
    rgba(38, 57, 57, 0.5) 56.4%
  );
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    95.36deg,
    rgba(255, 255, 255, 0.48) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );

  color: var(--text-primary-invert-main);
  gap: 0;

  :deep(.input-field__input) {
    border: 0;
    background: transparent;
    box-shadow: none;
  }

  :deep(.input-field) {
    width: 0;
    overflow: hidden;
    white-space: nowrap;
    transition: .2s;
  }

  :deep(.app-icon) {
    max-width: toRem(20);
    max-height: toRem(20);
    position: absolute;
    right: toRem(10);
  }

  &:hover,
  &--active {
    width: fit-content;
    padding-right: toRem(42);
    border-image-source: linear-gradient(
      95.36deg,
      rgba(3, 255, 133, 0.48) 0%,
      rgba(3, 255, 133, 0.08) 100%
    );

    :deep(.input-field) {
      width: toRem(200);
    }
  }
}
</style>
