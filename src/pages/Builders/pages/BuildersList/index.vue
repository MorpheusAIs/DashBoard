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

    <h2
      v-if="
        !buildersProjectsState.isLoaded.value ||
        listData.buildersProjects.length
      "
      class="mt-16 self-start text-textSecondaryMain"
    >
      {{ $t('builders-list.main-table-title') }}
    </h2>

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
      v-if="
        !buildersProjectsState.isLoaded.value ||
        listData.userAccountBuildersProjects.length
      "
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
            v-model:order-by-model="usersBuildersOrderBy"
            v-model:order-direction-model="usersOrderDirection"
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
import {
  AppButton,
  ErrorMessage,
  NoDataMessage,
  Pagination,
  SkeletonTable,
} from '@/common'
import BuildersTable from '@/pages/Builders/pages/BuildersList/components/BuildersTable/index.vue'
import BuilderFormModal from '@/pages/Builders/components/BuilderFormModal.vue'
import {
  BuildersProject_OrderBy,
  BuildersUser_OrderBy,
  CombinedBuildersList,
  CombinedBuildersListFilteredByPredefinedBuilders,
  CombinedBuildersListFilteredByPredefinedBuildersQuery,
  CombinedBuildersListFilteredByPredefinedBuildersQueryVariables,
  CombinedBuildersListQuery,
  CombinedBuildersListQueryVariables,
  OrderDirection,
} from '@/types/graphql'
import { computed, provide, ref } from 'vue'
import { DEFAULT_BUILDERS_PAGE_LIMIT } from '@/const'
import { useRoute, useRouter } from 'vue-router'
import { useWeb3ProvidersStore } from '@/store'
import { ROUTE_NAMES, AdditionalBuildersOrderBy } from '@/enums'
import { useLoad } from '@/composables'
import { storeToRefs } from 'pinia'
import { useSecondApolloClient } from '@/composables/use-second-apollo-client'
import { NetworkTypes } from '@config'
import predefinedBuildersMeta from '@/assets/predefined-builders-meta.json'

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

const orderBy = ref<BuildersProject_OrderBy | AdditionalBuildersOrderBy>(
  BuildersProject_OrderBy.TotalStaked,
)
const orderDirection = ref(OrderDirection.Desc)

const usersBuildersOrderBy = ref(BuildersProject_OrderBy.TotalStaked)
const usersOrderDirection = ref(OrderDirection.Asc)

const isCreateBuilderModalShown = ref(false)

const buildersApolloClient = useSecondApolloClient()

const mapperUsersBuildersOrderBy = computed(
  () =>
    ({
      [BuildersProject_OrderBy.Admin]:
        BuildersUser_OrderBy.BuildersProjectAdmin,
      [BuildersProject_OrderBy.ClaimLockEnd]:
        BuildersUser_OrderBy.BuildersProjectClaimLockEnd,
      [BuildersProject_OrderBy.Id]: BuildersUser_OrderBy.BuildersProjectId,
      [BuildersProject_OrderBy.MinimalDeposit]:
        BuildersUser_OrderBy.BuildersProjectMinimalDeposit,
      [BuildersProject_OrderBy.Name]: BuildersUser_OrderBy.BuildersProjectName,
      [BuildersProject_OrderBy.StartsAt]:
        BuildersUser_OrderBy.BuildersProjectStartsAt,
      [BuildersProject_OrderBy.TotalClaimed]:
        BuildersUser_OrderBy.BuildersProjectTotalClaimed,
      [BuildersProject_OrderBy.TotalStaked]:
        BuildersUser_OrderBy.BuildersProjectTotalStaked,
      [BuildersProject_OrderBy.TotalUsers]:
        BuildersUser_OrderBy.BuildersProjectTotalUsers,
      [BuildersProject_OrderBy.WithdrawLockPeriodAfterDeposit]:
        BuildersUser_OrderBy.BuildersProjectWithdrawLockPeriodAfterDeposit,
      [AdditionalBuildersOrderBy.RewardType]:
        BuildersUser_OrderBy.BuildersProjectId,
    })[usersBuildersOrderBy.value],
)

const { data: allPredefinedBuilders } = useLoad<LoadBuildersResponse>(
  {
    buildersProjects: [],
    userAccountBuildersProjects: [],
    buildersCounters: {} as CombinedBuildersListQuery['counters'][0],
  },
  async (): Promise<LoadBuildersResponse> => {
    const isSortingLocal = Object.keys(AdditionalBuildersOrderBy).includes(
      orderBy.value,
    )

    const { data } = await buildersApolloClient.value.query<
      CombinedBuildersListFilteredByPredefinedBuildersQuery,
      CombinedBuildersListFilteredByPredefinedBuildersQueryVariables
    >({
      query: CombinedBuildersListFilteredByPredefinedBuilders,
      fetchPolicy: 'network-only',
      variables: {
        orderBy: isSortingLocal
          ? BuildersProject_OrderBy.TotalStaked
          : (orderBy.value as BuildersProject_OrderBy),
        usersOrderBy: mapperUsersBuildersOrderBy.value,
        usersDirection: usersOrderDirection.value,
        orderDirection: orderDirection.value,
        name_in: predefinedBuildersMeta.map(el => el.name),

        address: provider.value.selectedAddress,
      },
    })

    if (isSortingLocal)
      return sortLocally(
        orderBy.value as AdditionalBuildersOrderBy,
        orderDirection.value,
        data,
      )

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
      mapperUsersBuildersOrderBy,
      usersOrderDirection,
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
}): Promise<LoadBuildersResponse> => {
  const buildersProjects = allPredefinedBuilders.value.buildersProjects.slice(
    args.skip,
    args.skip + args.first,
  )
  const userAccountBuildersProjects =
    allPredefinedBuilders.value.userAccountBuildersProjects
  const buildersCounters = allPredefinedBuilders.value.buildersCounters

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
        usersOrderBy: mapperUsersBuildersOrderBy.value,
        usersDirection: usersOrderDirection.value,
        orderDirection: orderDirection.value,

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
        ? [
            orderBy,
            orderDirection,
            mapperUsersBuildersOrderBy,
            usersOrderDirection,
          ]
        : [],
  },
)

const sortLocally = (
  orderBy: AdditionalBuildersOrderBy,
  orderDirection: OrderDirection,
  data: CombinedBuildersListFilteredByPredefinedBuildersQuery,
): LoadBuildersResponse => {
  const mappedSortingHandler = {
    [AdditionalBuildersOrderBy.RewardType]: (
      a: CombinedBuildersListFilteredByPredefinedBuildersQuery['buildersProjects'][number],
      b: CombinedBuildersListFilteredByPredefinedBuildersQuery['buildersProjects'][number],
    ) => {
      const aType = predefinedBuildersMeta.find(
        el => el.name === a.name,
      )?.rewardType
      const bType = predefinedBuildersMeta.find(
        el => el.name === b.name,
      )?.rewardType

      if (aType && bType) {
        return orderDirection === OrderDirection.Asc
          ? aType.localeCompare(bType)
          : bType.localeCompare(aType)
      }

      return 0
    },
  }

  return {
    // TODO: implement this sorting when adding multichain builders support
    buildersProjects: data.buildersProjects,
    userAccountBuildersProjects: data.buildersUsers
      .map(el => el.buildersProject)
      .sort((a, b) => {
        if (mappedSortingHandler[orderBy]) {
          return mappedSortingHandler[orderBy](a, b)
        }

        return 0
      }),
    buildersCounters: {
      id: '',
      totalBuildersProjects: data.buildersProjects.length,
      totalSubnets: 0,
    },
  }
}

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
</style>
