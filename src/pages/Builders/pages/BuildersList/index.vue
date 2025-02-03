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

    <div class="z-30 mt-16 flex w-full items-center justify-between">
      <h2
        v-if="
          !buildersProjectsState.isLoaded.value ||
          listData.buildersProjects.length
        "
        class="self-start text-textSecondaryMain"
      >
        {{ $t('builders-list.main-table-title') }}
      </h2>

      <div class="relative flex">
        <button
          :class="
            cn(
              'flex items-center gap-2 px-4 py-2',
              'bg-backgroundSecondaryMain text-textSecondaryMain',
            )
          "
          @click="isDropMenuShown = !isDropMenuShown"
        >
          {{ localizeChainSelection(selectedChain) }}

          <app-icon
            :name="$icons.chevronDown"
            :class="
              cn(
                'size-6 transition-transform duration-300 ease-in-out',
                isDropMenuShown && 'rotate-180',
              )
            "
          />
        </button>
        <drop-menu
          v-model:is-shown="isDropMenuShown"
          class="bg-backgroundSecondaryMain"
          is-hide-on-click-outside
        >
          <button
            class="z-20 px-3 py-2 text-left text-textSecondaryMain hover:brightness-150"
            v-for="(el, idx) in chainOptions"
            :key="idx"
            @click.stop="
              () => {
                selectedChain = el
                isDropMenuShown = false
              }
            "
          >
            {{ localizeChainSelection(el) }}
          </button>
        </drop-menu>
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
          class="z-10 mt-8"
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
import {
  config,
  EthereumChains,
  getEthereumChainsName,
  NetworkTypes,
} from '@config'
import predefinedBuildersMeta from '@/assets/predefined-builders-meta.json'
import DropMenu from '@/common/DropMenu.vue'
import { cn } from '@/theme/utils'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core'

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

const isDropMenuShown = ref(false)

const {
  provider,
  networkType,
  allowedForCurrentRouteChainsLimitedByNetworkType,
} = storeToRefs(useWeb3ProvidersStore())

const currentPage = ref(1)

const orderBy = ref<BuildersProject_OrderBy | AdditionalBuildersOrderBy>(
  BuildersProject_OrderBy.TotalStaked,
)
const orderDirection = ref(OrderDirection.Desc)

const usersBuildersOrderBy = ref<
  BuildersProject_OrderBy | AdditionalBuildersOrderBy
>(BuildersProject_OrderBy.TotalStaked)
const usersOrderDirection = ref(OrderDirection.Asc)

const isCreateBuilderModalShown = ref(false)

const { client: buildersApolloClient, clients } = useSecondApolloClient()

const chainOptions = computed(() => [
  undefined,
  ...allowedForCurrentRouteChainsLimitedByNetworkType.value,
])
const selectedChain = ref<EthereumChains | undefined>(chainOptions.value[0])

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
    const loadFn = (client: ApolloClient<NormalizedCacheObject>) => {
      return client.query<
        CombinedBuildersListFilteredByPredefinedBuildersQuery,
        CombinedBuildersListFilteredByPredefinedBuildersQueryVariables
      >({
        query: CombinedBuildersListFilteredByPredefinedBuilders,
        fetchPolicy: 'network-only',
        variables: {
          orderBy:
            orderBy.value in BuildersProject_OrderBy
              ? (orderBy.value as BuildersProject_OrderBy)
              : BuildersProject_OrderBy.TotalStaked,
          usersOrderBy: mapperUsersBuildersOrderBy.value,
          usersDirection: usersOrderDirection.value,
          orderDirection: orderDirection.value,
          name_in: predefinedBuildersMeta.map(el => el.name),

          address: provider.value.selectedAddress,
        },
      })
    }

    if (!selectedChain.value) {
      const response = await Promise.all(
        Object.values(clients.value).map(client => {
          return loadFn(client)
        }),
      )

      const result = response.reduce(
        (acc, curr) => {
          acc['buildersProjects'] = acc['buildersProjects'].concat(
            curr.data.buildersProjects,
          )
          acc['userAccountBuildersProjects'] = acc[
            'userAccountBuildersProjects'
          ].concat(curr.data.buildersUsers.map(el => el.buildersProject))

          acc['buildersCounters'] = {
            id: '',
            totalBuildersProjects: acc.buildersProjects.length,
            totalSubnets: 0,
          }

          return acc
        },
        {
          buildersProjects: [],
          userAccountBuildersProjects: [],
          buildersCounters: {
            totalBuildersProjects: 0,
            totalSubnets: 0,
          } as LoadBuildersResponse['buildersCounters'],
        } as LoadBuildersResponse,
      )

      return result
    }

    const { data } = await loadFn(clients.value[selectedChain.value])

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
      selectedChain,
    ],
    updateArgs: [[orderBy, orderDirection]],
  },
)

const paginateThroughAllPredefinedBuilders = async (args: {
  skip: number
  first: number
  orderBy: BuildersProject_OrderBy | AdditionalBuildersOrderBy
  orderDirection: OrderDirection
}): Promise<LoadBuildersResponse> => {
  const isSortingLocal = Object.keys(AdditionalBuildersOrderBy).includes(
    orderBy.value,
  )

  let buildersProjects = allPredefinedBuilders.value.buildersProjects.slice(
    args.skip,
    args.skip + args.first,
  )

  if (isSortingLocal) {
    buildersProjects = sortByCustomType(
      buildersProjects,
      orderBy.value as AdditionalBuildersOrderBy,
      orderDirection.value,
    )
  }

  const isUsersSortingLocal = Object.keys(AdditionalBuildersOrderBy).includes(
    usersBuildersOrderBy.value,
  )

  let userAccountBuildersProjects =
    allPredefinedBuilders.value.userAccountBuildersProjects
  if (isUsersSortingLocal) {
    userAccountBuildersProjects = sortByCustomType(
      userAccountBuildersProjects,
      usersBuildersOrderBy.value as AdditionalBuildersOrderBy,
      usersOrderDirection.value,
    )
  }

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
        orderBy:
          orderBy.value in BuildersProject_OrderBy
            ? (orderBy.value as BuildersProject_OrderBy)
            : BuildersProject_OrderBy.TotalStaked,
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

const sortByCustomType = (
  data: CombinedBuildersListQuery['buildersProjects'],
  orderBy: AdditionalBuildersOrderBy,
  orderDirection: OrderDirection,
): CombinedBuildersListQuery['buildersProjects'] => {
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

  return data.sort((a, b) => {
    if (mappedSortingHandler[orderBy]) {
      return mappedSortingHandler[orderBy](a, b)
    }

    return 0
  })
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

const localizeChainSelection = (chainId: string | undefined) => {
  if (!chainId) return 'All Networks'

  return config.chainsMap[getEthereumChainsName(chainId)].chainName
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
