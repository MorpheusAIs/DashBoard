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
          :route="{ name: $routes.appBuildersForm }"
          :disabled="!provider.isConnected"
        >
          {{ $t('builders-list.create-builder-btn') }}
        </app-button>
      </div>
    </div>

    <div class="z-30 mt-16 flex w-full items-center justify-between">
      <h2
        v-if="
          !builderSubnetsState.isLoaded.value || listData.builderSubnets.length
        "
        class="self-start text-textSecondaryMain"
      >
        {{ $t('builders-list.main-table-title') }}
      </h2>

      <div class="flex gap-5">
        <div
          class="builders-list__search relative flex h-10 w-10 items-center justify-center"
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
    </div>

    <template
      v-if="
        builderSubnetsState.isLoaded.value &&
        ((networkType === 'mainnet' &&
          allPredefinedBuildersState.isLoaded.value) ||
          networkType === 'testnet')
      "
    >
      <template v-if="builderSubnetsState.isLoadFailed.value">
        <error-message
          :message="$t('builders-list.loading-projects-error-msg')"
        />
      </template>
      <template v-else-if="listData.builderSubnets.length">
        <builders-table
          class="z-10 mt-8"
          :builder-subnets="listData.builderSubnets"
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
        listData.buildersCounters?.totalBuilderProjects &&
        builderSubnetsState.isLoaded.value &&
        listData.buildersCounters?.totalBuilderProjects >
          DEFAULT_BUILDERS_PAGE_LIMIT
      "
      v-model:current-page="currentPage"
      :page-limit="DEFAULT_BUILDERS_PAGE_LIMIT"
      :total-items="+listData.buildersCounters?.totalBuilderProjects"
      class="mt-6"
    />

    <h2
      v-if="
        !builderSubnetsState.isLoaded.value ||
        listData.userAccountBuilderSubnets.length
      "
      class="mt-16 self-start text-textSecondaryMain"
    >
      {{ $t('builders-list.account-projects-table-title') }}
    </h2>

    <div class="mt-8 w-full">
      <template v-if="builderSubnetsState.isLoaded.value">
        <template v-if="builderSubnetsState.isLoadFailed.value">
          <error-message
            :message="$t('builders-list.loading-account-projects-error-msg')"
          />
        </template>
        <template v-else-if="listData.userAccountBuilderSubnets.length">
          <builders-table
            class="w-full"
            :builder-subnets="listData.userAccountBuilderSubnets"
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
import {
  BuilderSubnet_OrderBy,
  BuilderSubnetDefaultFragment,
  BuilderUser_OrderBy,
  CombinedBuilderSubnets,
  CombinedBuilderSubnetsFilteredByPredefinedBuilders,
  CombinedBuilderSubnetsFilteredByPredefinedBuildersQuery,
  CombinedBuilderSubnetsFilteredByPredefinedBuildersQueryVariables,
  CombinedBuilderSubnetsQuery,
  CombinedBuilderSubnetsQueryVariables,
  OrderDirection,
} from '@/types/graphql'
import { ref, computed, onBeforeMount, onBeforeUnmount } from 'vue'
import { DEFAULT_BUILDERS_PAGE_LIMIT } from '@/const'
import { useRoute } from 'vue-router'
import { useWeb3ProvidersStore } from '@/store'
import { AdditionalBuildersOrderBy } from '@/enums'
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
import { InputField } from '@/fields'
import { bus, BUS_EVENTS } from '@/helpers'

type LoadBuildersResponse = {
  builderSubnets: BuilderSubnetDefaultFragment[]
  userAccountBuilderSubnets: BuilderSubnetDefaultFragment[]
  buildersCounters: CombinedBuilderSubnetsQuery['counters'][0]
}

defineOptions({
  inheritAttrs: false,
})

const route = useRoute()

const isDropMenuShown = ref(false)

const {
  provider,
  networkType,
  allowedForCurrentRouteChainsLimitedByNetworkType,
} = storeToRefs(useWeb3ProvidersStore())

const currentPage = ref(1)
const searchQuery = ref('')

const orderBy = ref<BuilderSubnet_OrderBy | AdditionalBuildersOrderBy>(
  BuilderSubnet_OrderBy.TotalStaked,
)
const orderDirection = ref(OrderDirection.Desc)

const usersBuildersOrderBy = ref<
  BuilderSubnet_OrderBy | AdditionalBuildersOrderBy
>(BuilderSubnet_OrderBy.TotalStaked)
const usersOrderDirection = ref(OrderDirection.Asc)

const { client: buildersApolloClient, clients } = useSecondApolloClient()

const chainOptions = computed(() => [
  undefined,
  ...allowedForCurrentRouteChainsLimitedByNetworkType.value,
])
const selectedChain = ref<EthereumChains | undefined>(chainOptions.value[0])

const onNavbarSwitchChain = (chain: EthereumChains | undefined) => {
  if (!chainOptions.value.includes(chain)) return

  selectedChain.value = chain
}

onBeforeMount(() => {
  bus.on(BUS_EVENTS.navbarChainSwitched, onNavbarSwitchChain)
})

onBeforeUnmount(() => {
  bus.off(BUS_EVENTS.navbarChainSwitched, onNavbarSwitchChain)
})

const mapUsersOrderFilter = (
  orderBy: BuilderSubnet_OrderBy | AdditionalBuildersOrderBy,
): BuilderUser_OrderBy => {
  if (orderBy === 'RewardType') {
    return BuilderUser_OrderBy.BuilderSubnetId
  }

  return {
    [BuilderSubnet_OrderBy.BuilderUsers]: BuilderUser_OrderBy.Id,
    [BuilderSubnet_OrderBy.Description]:
      BuilderUser_OrderBy.BuilderSubnetDescription,
    [BuilderSubnet_OrderBy.Fee]: BuilderUser_OrderBy.BuilderSubnetFee,
    [BuilderSubnet_OrderBy.FeeTreasury]:
      BuilderUser_OrderBy.BuilderSubnetFeeTreasury,
    [BuilderSubnet_OrderBy.Id]: BuilderUser_OrderBy.BuilderSubnetId,
    [BuilderSubnet_OrderBy.Image]: BuilderUser_OrderBy.BuilderSubnetImage,
    [BuilderSubnet_OrderBy.MinClaimLockEnd]:
      BuilderUser_OrderBy.BuilderSubnetMinClaimLockEnd,
    [BuilderSubnet_OrderBy.MinStake]: BuilderUser_OrderBy.BuilderSubnetMinStake,
    [BuilderSubnet_OrderBy.Name]: BuilderUser_OrderBy.BuilderSubnetName,
    [BuilderSubnet_OrderBy.Owner]: BuilderUser_OrderBy.BuilderSubnetOwner,
    [BuilderSubnet_OrderBy.Slug]: BuilderUser_OrderBy.BuilderSubnetSlug,
    [BuilderSubnet_OrderBy.StartsAt]: BuilderUser_OrderBy.BuilderSubnetStartsAt,
    [BuilderSubnet_OrderBy.TotalClaimed]:
      BuilderUser_OrderBy.BuilderSubnetTotalClaimed,
    [BuilderSubnet_OrderBy.TotalStaked]:
      BuilderUser_OrderBy.BuilderSubnetTotalStaked,
    [BuilderSubnet_OrderBy.TotalUsers]:
      BuilderUser_OrderBy.BuilderSubnetTotalUsers,
    [BuilderSubnet_OrderBy.Website]: BuilderUser_OrderBy.BuilderSubnetWebsite,
    [BuilderSubnet_OrderBy.WithdrawLockPeriodAfterStake]:
      BuilderUser_OrderBy.BuilderSubnetWithdrawLockPeriodAfterStake,
  }[orderBy]
}

const mapperUsersBuildersOrderBy = computed(() =>
  mapUsersOrderFilter(usersBuildersOrderBy.value),
)

const { data: allPredefinedBuilders, ...allPredefinedBuildersState } =
  useLoad<LoadBuildersResponse>(
    {
      builderSubnets: [],
      userAccountBuilderSubnets: [],
      buildersCounters: {} as CombinedBuilderSubnetsQuery['counters'][0],
    },
    async (): Promise<LoadBuildersResponse> => {
      const loadFn = async (
        client: ApolloClient<NormalizedCacheObject>,
        chain: EthereumChains,
      ) => {
        const { data } = await client.query<
          CombinedBuilderSubnetsFilteredByPredefinedBuildersQuery,
          CombinedBuilderSubnetsFilteredByPredefinedBuildersQueryVariables
        >({
          query: CombinedBuilderSubnetsFilteredByPredefinedBuilders,
          fetchPolicy: 'network-only',
          variables: {
            orderBy: Object.values(BuilderSubnet_OrderBy).includes(
              orderBy.value as BuilderSubnet_OrderBy,
            )
              ? (orderBy.value as BuilderSubnet_OrderBy)
              : BuilderSubnet_OrderBy.TotalStaked,
            usersOrderBy: mapperUsersBuildersOrderBy.value,
            usersDirection: usersOrderDirection.value,
            orderDirection: orderDirection.value,
            name_in: predefinedBuildersMeta
              .map(el => el.name)
              .filter(el =>
                el.toLowerCase().includes(searchQuery.value.toLowerCase()),
              ),

            address: provider.value.selectedAddress,
          },
        })

        return {
          data: {
            builderSubnets: data.builderSubnets.map(el => ({ ...el, chain })),
            buildersUsers: data.builderUsers.map(el => {
              return {
                ...el,
                builderSubnet: {
                  ...el.builderSubnet,
                  chain,
                },
              }
            }),
            buildersCounters: {
              id: '',
              totalBuilderProjects: data.builderSubnets.length,
              totalSubnets: 0,
            },
          },
        }
      }

      if (!selectedChain.value) {
        const response = await Promise.all(
          Object.entries(clients.value).map(([chain, client]) => {
            return loadFn(client, chain as EthereumChains)
          }),
        )

        const result = response.reduce(
          (acc, curr) => {
            acc['builderSubnets'] = acc['builderSubnets'].concat(
              curr.data.builderSubnets,
            )
            acc['userAccountBuilderSubnets'] = acc[
              'userAccountBuilderSubnets'
            ].concat(curr.data.buildersUsers.map(el => el.builderSubnet))

            acc['buildersCounters'] = {
              id: '',
              totalBuilderProjects: acc.builderSubnets.length,
              totalSubnets: 0,
            }

            return acc
          },
          {
            builderSubnets: [],
            userAccountBuilderSubnets: [],
            buildersCounters: {
              id: '',
              totalBuilderProjects: 0,
              totalSubnets: 0,
            } as LoadBuildersResponse['buildersCounters'],
          } as LoadBuildersResponse,
        )

        return result
      }

      const { data } = await loadFn(
        clients.value[selectedChain.value],
        selectedChain.value,
      )

      return {
        builderSubnets: data.builderSubnets,
        userAccountBuilderSubnets: data.buildersUsers.map(
          el => el.builderSubnet,
        ),
        buildersCounters: {
          id: '',
          totalBuilderProjects: data.builderSubnets.length,
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
        searchQuery,
      ],
      updateArgs: [[orderBy, orderDirection]],
    },
  )

const paginateThroughAllPredefinedBuilders = async (args: {
  skip: number
  first: number
  orderBy: BuilderSubnet_OrderBy | AdditionalBuildersOrderBy
  orderDirection: OrderDirection
}): Promise<LoadBuildersResponse> => {
  let builderSubnets = allPredefinedBuilders.value.builderSubnets.slice(
    args.skip,
    args.skip + args.first,
  )
  if (!selectedChain.value) {
    builderSubnets = localSortBuilders(
      builderSubnets,
      Object.values(BuilderSubnet_OrderBy).includes(
        args.orderBy as BuilderSubnet_OrderBy,
      )
        ? (args.orderBy as BuilderSubnet_OrderBy)
        : BuilderSubnet_OrderBy.TotalStaked,
      args.orderDirection,
    )
  }

  const isCustomSorting = Object.keys(AdditionalBuildersOrderBy).includes(
    orderBy.value,
  )
  if (isCustomSorting) {
    builderSubnets = sortByCustomType(
      builderSubnets,
      orderBy.value as AdditionalBuildersOrderBy,
      orderDirection.value,
    )
  }

  let userAccountBuilderSubnets =
    allPredefinedBuilders.value.userAccountBuilderSubnets

  if (!selectedChain.value) {
    userAccountBuilderSubnets = localSortBuilders(
      userAccountBuilderSubnets,
      Object.values(BuilderSubnet_OrderBy).includes(
        args.orderBy as BuilderSubnet_OrderBy,
      )
        ? (args.orderBy as BuilderSubnet_OrderBy)
        : BuilderSubnet_OrderBy.TotalStaked,
      args.orderDirection,
    )
  }

  const isUsersCustomSorting = Object.keys(AdditionalBuildersOrderBy).includes(
    usersBuildersOrderBy.value,
  )
  if (isUsersCustomSorting) {
    userAccountBuilderSubnets = sortByCustomType(
      userAccountBuilderSubnets,
      usersBuildersOrderBy.value as AdditionalBuildersOrderBy,
      usersOrderDirection.value,
    )
  }

  const buildersCounters = allPredefinedBuilders.value.buildersCounters

  return {
    builderSubnets,
    userAccountBuilderSubnets,
    buildersCounters,
  }
}

const { data: listData, ...builderSubnetsState } =
  useLoad<LoadBuildersResponse>(
    {
      builderSubnets: [],
      userAccountBuilderSubnets: [],
      buildersCounters: {} as CombinedBuilderSubnetsQuery['counters'][0],
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
        CombinedBuilderSubnetsQuery,
        CombinedBuilderSubnetsQueryVariables
      >({
        query: CombinedBuilderSubnets,
        fetchPolicy: 'network-only',
        variables: {
          first: DEFAULT_BUILDERS_PAGE_LIMIT,
          skip:
            currentPage.value * DEFAULT_BUILDERS_PAGE_LIMIT -
            DEFAULT_BUILDERS_PAGE_LIMIT,
          orderBy: Object.values(BuilderSubnet_OrderBy).includes(
            orderBy.value as BuilderSubnet_OrderBy,
          )
            ? (orderBy.value as BuilderSubnet_OrderBy)
            : BuilderSubnet_OrderBy.TotalStaked,
          usersOrderBy: mapperUsersBuildersOrderBy.value,
          usersDirection: usersOrderDirection.value,
          orderDirection: orderDirection.value,

          address: provider.value.selectedAddress,
        },
      })

      const builderSubnets = data.builderSubnets.map(el => ({
        ...el,
        chain: selectedChain.value,
      }))
      const userAccountBuilderSubnets = data.builderUsers.map(
        el => el.builderSubnet,
      )
      const buildersCounters = data.counters[0]

      return {
        builderSubnets,
        userAccountBuilderSubnets,
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

const localSortBuilders = (
  data: CombinedBuilderSubnetsQuery['builderSubnets'],
  orderBy: BuilderSubnet_OrderBy,
  orderDirection: OrderDirection,
) => {
  if (!data || data.length === 0) return data

  return data.sort((a, b) => {
    const keyA = a[orderBy]
    const keyB = b[orderBy]

    if (keyA == null || keyB == null) return 0

    const isNumeric = !isNaN(Number(keyA)) && !isNaN(Number(keyB))

    if (orderDirection === OrderDirection.Asc) {
      if (isNumeric) {
        return Number(keyA) - Number(keyB)
      }

      return keyA.localeCompare(keyB)
    }

    if (orderDirection === OrderDirection.Desc) {
      if (isNumeric) {
        return Number(keyB) - Number(keyA)
      }

      return keyB.localeCompare(keyA)
    }

    return 0
  })
}

const sortByCustomType = (
  data: CombinedBuilderSubnetsQuery['builderSubnets'],
  orderBy: AdditionalBuildersOrderBy,
  orderDirection: OrderDirection,
): CombinedBuilderSubnetsQuery['builderSubnets'] => {
  const mappedSortingHandler = {
    [AdditionalBuildersOrderBy.RewardType]: (
      a: CombinedBuilderSubnetsFilteredByPredefinedBuildersQuery['builderSubnets'][number],
      b: CombinedBuilderSubnetsFilteredByPredefinedBuildersQuery['builderSubnets'][number],
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

const localizeChainSelection = (chainId: string | undefined) => {
  if (!chainId) return 'All Networks'

  return config.chainsMap[getEthereumChainsName(chainId)].chainName
}
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
    transition: 0.2s;
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
