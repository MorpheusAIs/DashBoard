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

    <builder-form-modal v-model:is-shown="isCreateBuilderModalShown" />
  </div>
</template>

<script setup lang="ts">
import { AppButton, Pagination } from '@/common'
import BuildersTable from '@/pages/Builders/pages/BuildersList/components/BuildersTable.vue'
import BuilderFormModal from '@/pages/Builders/pages/BuildersList/components/BuilderFormModal.vue'
import BuildersStakeModal from '@/pages/Builders/pages/BuildersList/components/BuildersStakeModal.vue'
import { config } from '@config'
import {
  GetBuildersProjects,
  GetBuildersProjectsQuery,
  GetBuildersProjectsQueryVariables,
} from '@/types/graphql'
import { ref, watch } from 'vue'
import { DEFAULT_PAGE_LIMIT } from '@/const'
import { useRoute } from 'vue-router'

defineOptions({
  inheritAttrs: false,
})

const route = useRoute()

const currentPage = ref(1)

const isCreateBuilderModalShown = ref(false)

const buildersProjects = ref<GetBuildersProjectsQuery['buildersProjects']>([])

const loadProjects = async (limit = DEFAULT_PAGE_LIMIT, offset = 0) => {
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
