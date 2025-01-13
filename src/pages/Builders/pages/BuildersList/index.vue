<template>
  <div class="flex w-full flex-col items-center">
    <div
      class="flex max-w-[700px] flex-col items-center justify-center gap-6 pb-6 pt-16 text-center"
    >
      <h2 class="typography-h1">Create or Stake in a Builder</h2>
      <span class="builders-list__hero-desc">
        You can become a Builder or participate in an existing one to start
        earning rewards. When you create a Builder, you can set custom
        parameters including token lock time and reward details. Or you can join
        an existing Builder using your stake Start staking now and claim your
        rewards!
      </span>
      <span class="builders-list__hero-desc-underline">
        Start staking now and claim your rewards!
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
        >
          Become a builder
        </app-button>
      </div>
    </div>

    <builders-table class="mt-16" :builders-projects="buildersProjects" />

    <!--FIXME: replace total-items mocked value-->
    <pagination
      v-model:current-page="currentPage"
      :page-limit="DEFAULT_PAGE_LIMIT"
      :total-items="buildersProjects.length * 10"
      class="mt-6"
    />

    <builder-form-modal
      v-model:is-shown="isCreateBuilderModalShown"
      @builder-created="handleBuilderCreated"
    />

    <builders-table
      v-if="userAccountBuildersProjects.length"
      class="mt-16 w-full"
      :builders-projects="userAccountBuildersProjects"
    />
  </div>
</template>

<script setup lang="ts">
import { AppButton, Pagination } from '@/common'
import BuildersTable from '@/pages/Builders/pages/BuildersList/components/BuildersTable.vue'
import BuilderFormModal from '@/pages/Builders/components/BuilderFormModal.vue'
import { config } from '@config'
import {
  GetAccountUserBuildersProjectsIds,
  GetAccountUserBuildersProjectsIdsQuery,
  GetAccountUserBuildersProjectsIdsQueryVariables,
  GetBuildersProjects,
  GetBuildersProjectsByIds,
  GetBuildersProjectsByIdsQuery,
  GetBuildersProjectsByIdsQueryVariables,
  GetBuildersProjectsQuery,
  GetBuildersProjectsQueryVariables,
} from '@/types/graphql'
import { ref, watch } from 'vue'
import { DEFAULT_PAGE_LIMIT } from '@/const'
import { useRoute, useRouter } from 'vue-router'
import { useWeb3ProvidersStore } from '@/store'
import { ROUTE_NAMES } from '@/enums'

defineOptions({
  inheritAttrs: false,
})

const route = useRoute()
const router = useRouter()

const { provider } = useWeb3ProvidersStore()

const currentPage = ref(1)

const isCreateBuilderModalShown = ref(false)

const buildersProjects = ref<GetBuildersProjectsQuery['buildersProjects']>([])

const userAccountBuildersProjects = ref<
  GetBuildersProjectsQuery['buildersProjects']
>([])

const loadAccountUserBuildersProjects = async () => {
  const { data: accountUserBuildersProjectsIds } =
    await config.testnetBuildersApolloClient.query<
      GetAccountUserBuildersProjectsIdsQuery,
      GetAccountUserBuildersProjectsIdsQueryVariables
    >({
      query: GetAccountUserBuildersProjectsIds,
      fetchPolicy: 'network-only',
      variables: {
        address: provider.selectedAddress,
      },
    })

  const { data: accountUserBuildersProjects } =
    await config.testnetBuildersApolloClient.query<
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

  userAccountBuildersProjects.value =
    accountUserBuildersProjects.buildersProjects
}

watch(
  () => provider.selectedAddress,
  () => loadAccountUserBuildersProjects(),
  {
    immediate: true,
  },
)

const loadProjects = async (limit = DEFAULT_PAGE_LIMIT) => {
  const { data } = await config.testnetBuildersApolloClient.query<
    GetBuildersProjectsQuery,
    GetBuildersProjectsQueryVariables
  >({
    query: GetBuildersProjects,
    fetchPolicy: 'network-only',
    variables: {
      first: limit,
      skip: currentPage.value * limit - limit,
    },
  })

  buildersProjects.value = data.buildersProjects
}

watch(
  [currentPage, () => route.query.user, () => route.query.network],
  () => loadProjects(),
  { immediate: true },
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
