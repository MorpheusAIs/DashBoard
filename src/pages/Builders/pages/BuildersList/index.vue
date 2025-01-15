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

    <h2 class="mt-16 self-start text-textSecondaryMain">
      {{ $t('builders-list.main-table-title') }}
    </h2>

    <template v-if="buildersProjectsState.isLoaded.value">
      <template v-if="buildersProjectsState.isLoadFailed.value">
        <error-message
          :message="$t('builders-list.loading-projects-error-msg')"
        />
      </template>
      <template v-else-if="buildersProjects.length">
        <builders-table class="mt-8" :builders-projects="buildersProjects" />
      </template>
      <template v-else>
        <no-data-message
          :message="$t('builders-list.builders-projects-empty-msg')"
        />
      </template>
    </template>
    <skeleton-table
      v-else
      :rows="DEFAULT_PAGE_LIMIT"
      sizing="1fr"
      :schemes="['medium']"
      common-skeleton-class-names="min-h-[72px]"
    />

    <pagination
      v-if="
        buildersCounters?.totalBuildersProjects &&
        buildersProjectsState.isLoaded.value
      "
      v-model:current-page="currentPage"
      :page-limit="DEFAULT_PAGE_LIMIT"
      :total-items="+buildersCounters?.totalBuildersProjects"
      class="mt-6"
    />

    <h2
      v-if="userAccountBuildersProjects.length"
      class="mt-16 self-start text-textSecondaryMain"
    >
      {{ $t('builders-list.account-projects-table-title') }}
    </h2>

    <div class="mt-8 w-full">
      <template v-if="userAccountBuildersProjectsState.isLoaded.value">
        <template v-if="userAccountBuildersProjectsState.isLoadFailed.value">
          <error-message
            :message="$t('builders-list.loading-account-projects-error-msg')"
          />
        </template>
        <template v-else-if="userAccountBuildersProjects.length">
          <builders-table
            class="w-full"
            :builders-projects="userAccountBuildersProjects"
          />
        </template>
      </template>
      <skeleton-table
        v-else
        :rows="DEFAULT_PAGE_LIMIT"
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
import BuildersTable from '@/pages/Builders/pages/BuildersList/components/BuildersTable.vue'
import BuilderFormModal from '@/pages/Builders/components/BuilderFormModal.vue'
import {
  GetAccountUserBuildersProjectsIds,
  GetAccountUserBuildersProjectsIdsQuery,
  GetAccountUserBuildersProjectsIdsQueryVariables,
  GetBuildersCounters,
  GetBuildersCountersQuery,
  GetBuildersCountersQueryVariables,
  GetBuildersProjects,
  GetBuildersProjectsByIds,
  GetBuildersProjectsByIdsQuery,
  GetBuildersProjectsByIdsQueryVariables,
  GetBuildersProjectsQuery,
  GetBuildersProjectsQueryVariables,
} from '@/types/graphql'
import { ref, provide } from 'vue'
import { DEFAULT_PAGE_LIMIT } from '@/const'
import { useRoute, useRouter } from 'vue-router'
import { useWeb3ProvidersStore } from '@/store'
import { ROUTE_NAMES } from '@/enums'
import { useLoad } from '@/composables'
import { storeToRefs } from 'pinia'
import { useSecondApolloClient } from '@/composables/use-second-apollo-client'

defineOptions({
  inheritAttrs: false,
})

const route = useRoute()
const router = useRouter()

const { provider } = storeToRefs(useWeb3ProvidersStore())

const currentPage = ref(1)

const isCreateBuilderModalShown = ref(false)

const buildersApolloClient = useSecondApolloClient()

const { data: buildersCounters } = useLoad<
  GetBuildersCountersQuery['counters'][0] | undefined
>(
  undefined,
  async () => {
    const { data } = await buildersApolloClient.value.query<
      GetBuildersCountersQuery,
      GetBuildersCountersQueryVariables
    >({
      query: GetBuildersCounters,
      fetchPolicy: 'network-only',
      variables: {},
    })

    return data.counters[0]
  },
  {},
)

const {
  data: buildersProjects,
  reload: reloadBuildersProjects,
  update: updateBuildersProjects,
  ...buildersProjectsState
} = useLoad<GetBuildersProjectsQuery['buildersProjects']>(
  [],
  async () => {
    const { data } = await buildersApolloClient.value.query<
      GetBuildersProjectsQuery,
      GetBuildersProjectsQueryVariables
    >({
      query: GetBuildersProjects,
      fetchPolicy: 'network-only',
      variables: {
        first: DEFAULT_PAGE_LIMIT,
        skip: currentPage.value * DEFAULT_PAGE_LIMIT - DEFAULT_PAGE_LIMIT,
      },
    })

    return data.buildersProjects
  },
  {
    reloadArgs: [
      currentPage,
      () => route.query.user,
      () => route.query.network,
    ],
  },
)

const {
  data: userAccountBuildersProjects,
  reload: reloadUserAccountBuildersProjects,
  update: updateUserAccountBuildersProjects,
  ...userAccountBuildersProjectsState
} = useLoad(
  [],
  async () => {
    const { data: accountUserBuildersProjectsIds } =
      await buildersApolloClient.value.query<
        GetAccountUserBuildersProjectsIdsQuery,
        GetAccountUserBuildersProjectsIdsQueryVariables
      >({
        query: GetAccountUserBuildersProjectsIds,
        fetchPolicy: 'network-only',
        variables: {
          address: provider.value.selectedAddress,
        },
      })

    const { data: accountUserBuildersProjects } =
      await buildersApolloClient.value.query<
        GetBuildersProjectsByIdsQuery,
        GetBuildersProjectsByIdsQueryVariables
      >({
        query: GetBuildersProjectsByIds,
        fetchPolicy: 'network-only',
        variables: {
          id_in: accountUserBuildersProjectsIds.buildersUsers.map(
            el => el.buildersProjectId,
          ),
        },
      })

    return accountUserBuildersProjects.buildersProjects
  },
  {
    reloadArgs: [() => provider.value.selectedAddress],
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

provide('reloadBuildersProjects', reloadBuildersProjects)
provide('updateBuildersProjects', updateBuildersProjects)
provide('reloadUserAccountBuildersProjects', reloadUserAccountBuildersProjects)
provide('updateUserAccountBuildersProjects', updateUserAccountBuildersProjects)
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
