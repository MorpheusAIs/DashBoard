<template>
  <div :class="cn('flex flex-row overflow-y-auto', 'md:flex-col')">
    <button class="flex items-center gap-2" @click="$router.go(-1)">
      <app-icon
        :name="$icons.arrowLeft"
        class="size-4 text-textSecondaryLight"
      />
      <span class="text-textSecondaryMain">
        {{ $t('builders-item.back-btn') }}
      </span>
    </button>

    <div class="mt-14 flex flex-col">
      <span
        :class="
          cn(
            'self-start px-3 py-1 text-[#15151D]',
            'bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-dark)]',
          )
        "
      >
        {{ $t('builders-item.your-builder-lbl') }}
      </span>
      <div v-if="isLoaded" class="flex items-center gap-8">
        <span class="typography-h1">
          {{ buildersData.buildersProject?.name }}
        </span>

        <button
          class="flex items-center gap-2"
          @click="isEditModalShown = true"
        >
          <span class="text-primaryMain">
            {{ $t('builders-item.edit-btn') }}
          </span>
          <app-icon :name="$icons.edit" class="size-6 text-primaryMain" />
        </button>
      </div>
      <skeleton class="my-4 h-[80px] w-[250px]" v-else />

      <div v-if="isLoaded" class="flex items-center gap-2">
        <span class="text-textSecondaryMain">
          {{ abbrCenter(buildersData.buildersProject?.admin) }}
        </span>
        <copy-button content="asdfasdf" message="aasdfasdf" />
      </div>
      <skeleton class="w-[350px]" v-else />
    </div>

    <div class="mt-6 grid grid-cols-3 gap-[18px]">
      <app-gradient-border-card
        v-if="isLoaded"
        :class="cn('min-h-[150px] flex-1')"
      >
        <div class="flex flex-col gap-8 p-6">
          <div class="flex items-center justify-between">
            <span class="text-textSecondaryMain typography-body3">
              {{ $t('builders-item.start-time-lbl') }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="line-clamp-1 text-textSecondaryMain typography-h2">
              {{
                time(+buildersData.buildersProject?.startsAt).format(
                  DOT_TIME_FORMAT,
                )
              }}
            </span>
          </div>
        </div>
      </app-gradient-border-card>
      <skeleton class="h-[160px]" v-else />
      <app-gradient-border-card v-if="isLoaded" class="flex-1">
        <div class="flex flex-col gap-8 p-6">
          <span class="text-textSecondaryMain typography-body3">
            {{ $t('builders-item.min-deposit-lbl') }}
          </span>
          <span class="text-textSecondaryMain typography-h2">
            {{ formatEther(buildersData.buildersProject?.minimalDeposit) }}
          </span>
        </div>
      </app-gradient-border-card>
      <skeleton class="h-[160px]" v-else />
      <app-gradient-border-card v-if="isLoaded" class="flex-1">
        <div class="flex flex-col gap-8 p-6">
          <span class="text-textSecondaryMain typography-body3">
            {{ $t('builders-item.lock-period-lbl') }}
          </span>
          <span class="text-textSecondaryMain typography-h2">
            {{
              humanizeTime(
                buildersData.buildersProject?.withdrawLockPeriodAfterDeposit /
                  1000,
              )
            }}</span
          >
        </div>
      </app-gradient-border-card>
      <skeleton class="h-[160px]" v-else />
    </div>

    <div class="mt-14 flex gap-[18px]">
      <div class="flex flex-[0.34] flex-col gap-[18px]">
        <app-gradient-border-card v-if="isLoaded">
          <div class="flex flex-col gap-8 p-6">
            <div class="flex justify-between">
              <span class="text-textSecondaryMain typography-body3">
                {{ $t('builders-item.available-for-withdrawal-lbl') }}
              </span>

              <app-button
                size="small"
                @click="
                  () => {
                    isWithdrawModalShown = true
                  }
                "
                :disabled="
                  !withdrawalUnlockTime ||
                  withdrawalUnlockTime.isBefore(time()) ||
                  !+buildersData.buildersProjectUserAccount?.staked
                "
              >
                {{ $t('builders-item.withdraw-btn') }}
              </app-button>
            </div>
            <div class="flex items-center gap-8">
              <span class="text-textSecondaryMain typography-h2">
                {{
                  formatEther(
                    buildersData.buildersProjectUserAccount?.staked ?? 0,
                  )
                }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-textSecondary">
                {{ $t('builders-item.unlock-time-lbl') }}
              </span>
              <div class="flex items-center gap-2">
                <span class="text-textSecondaryMain">
                  {{ withdrawalUnlockTime?.format(DOT_TIME_FORMAT) }}
                </span>
              </div>
            </div>
          </div>
        </app-gradient-border-card>
        <skeleton class="h-[160px]" v-else />
        <app-gradient-border-card v-if="isLoaded" class="">
          <div class="flex flex-col gap-8 p-6">
            <span class="text-textSecondaryMain typography-body3">
              {{ $t('builders-item.total-claimed-lbl') }}
            </span>
            <span class="text-textSecondaryMain typography-h2">
              {{ formatEther(buildersData.buildersProject?.totalClaimed) }}
            </span>
          </div>
        </app-gradient-border-card>
        <skeleton class="h-[160px]" v-else />
        <app-gradient-border-card v-if="isLoaded" class="">
          <div class="flex flex-col gap-8 p-6">
            <span class="text-textSecondaryMain typography-body3">
              {{ $t('builders-item.total-staked-lbl') }}
            </span>
            <span class="text-textSecondaryMain typography-h2">
              {{ formatEther(buildersData.buildersProject?.totalStaked) }}
            </span>
          </div>
        </app-gradient-border-card>
        <skeleton class="h-[160px]" v-else />
        <app-gradient-border-card v-if="isLoaded">
          <div class="flex flex-col gap-8 p-6">
            <div class="flex justify-between">
              <span class="text-textSecondaryMain typography-body3">
                {{ $t('builders-item.claim-lock-ends-lbl') }}
              </span>

              <app-button
                v-if="isUserAccountAdmin"
                size="small"
                :disabled="
                  !buildersData.buildersProject ||
                  !+buildersData.buildersProject.claimLockEnd ||
                  time(buildersData.buildersProject.claimLockEnd).isAfter(
                    time(),
                  )
                "
              >
                {{ $t('builders-item.claim-btn') }}
              </app-button>
            </div>
            <div class="flex items-center gap-8">
              <span class="text-textSecondaryMain typography-h2">
                {{
                  time(buildersData.buildersProject?.claimLockEnd).format(
                    DOT_TIME_FORMAT,
                  )
                }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-textSecondary">
                {{ $t('builders-item.admin-addr-lbl') }}
              </span>
              <div class="flex items-center gap-2">
                <span class="text-textSecondaryMain">
                  {{ abbrCenter(buildersData.buildersProject?.admin) }}
                </span>
                <copy-button
                  :content="buildersData.buildersProject?.admin"
                  message="Copied"
                />
              </div>
            </div>
          </div>
        </app-gradient-border-card>
        <skeleton class="h-[160px]" v-else />
      </div>
      <div class="col-span-2 flex flex-[0.65] flex-col gap-6 pl-12">
        <div class="flex items-center justify-between">
          <div v-if="isLoaded" class="flex items-center gap-4">
            <span class="span text-textSecondaryMain">
              {{ $t('builders-item.stakers-lbl') }}
            </span>
            <app-gradient-border-card
              class="bg-transparent p-2 text-textSecondaryMain"
            >
              {{ buildersData?.buildersProject?.totalUsers }}
            </app-gradient-border-card>
          </div>
          <div v-else class="flex items-center gap-4">
            <skeleton class="w-[160px]" />
            <skeleton class="w-[35px]" />
          </div>

          <app-button :disabled="!isLoaded" @click="isStakeModalShown = true">
            {{ $t('builders-item.stake-btn') }}
          </app-button>
        </div>

        <div class="flex flex-1 flex-col">
          <template v-if="isLoaded">
            <template v-if="stakers?.length">
              <div class="mb-2 grid grid-cols-2 items-center justify-between">
                <div class="px-20">
                  <span class="text-textSecondary">
                    {{ $t('builders-item.staker-addr-name-th') }}
                  </span>
                </div>

                <button class="flex items-center justify-end gap-2 px-20">
                  <span class="text-textSecondary">
                    {{ $t('builders-item.start-time-th') }}
                  </span>
                  <app-icon :name="$icons.sort" class="size-6" />
                </button>
              </div>

              <div class="flex flex-col gap-2">
                <app-gradient-border-card v-for="el in stakers" :key="el.id">
                  <div class="grid grid-cols-2">
                    <div class="px-20 py-8">
                      <span class="text-textSecondaryMain">
                        {{ abbrCenter(el.address) }}
                      </span>
                    </div>
                    <div class="px-20 py-8 text-end">
                      <span class="text-textSecondaryMain">
                        {{ formatEther(el.staked) }}
                      </span>
                    </div>
                  </div>
                </app-gradient-border-card>
              </div>

              <pagination
                v-if="isLoaded && !isLoadFailed"
                v-model:current-page="stakersCurrentPage"
                :page-limit="DEFAULT_PAGE_LIMIT"
                :total-items="buildersData.buildersProject?.totalUsers"
                class="mt-6 self-center"
              />
            </template>
            <template v-else>
              <no-data-message
                title="No stakers found"
                message="Be the first staker"
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
    </div>
  </div>

  <builder-withdraw-modal
    v-if="buildersData.buildersProject"
    v-model:is-shown="isWithdrawModalShown"
    :builder-project="buildersData.buildersProject"
  />
  <builder-form-modal
    v-if="buildersData.buildersProject"
    v-model:is-shown="isEditModalShown"
    :builders-project="buildersData.buildersProject"
  />
  <builders-stake-modal
    v-model:is-shown="isStakeModalShown"
    v-if="buildersData.buildersProject"
    :builder-project="buildersData.buildersProject"
  />
</template>

<script setup lang="ts">
import {
  AppButton,
  AppGradientBorderCard,
  AppIcon,
  CopyButton,
  NoDataMessage,
  Pagination,
  Skeleton,
} from '@/common'
import { abbrCenter, ErrorHandler, humanizeTime } from '@/helpers'
import BuilderWithdrawModal from '@/pages/Builders/pages/BuildersItem/components/BuilderWithdrawModal.vue'
import { computed, ref, watch } from 'vue'
import {
  GetBuildersProject,
  GetBuildersProjectQuery,
  GetBuildersProjectQueryVariables,
  GetBuildersProjectUsers,
  GetBuildersProjectUsersQuery,
  GetBuildersProjectUsersQueryVariables,
  GetUserAccountBuildersProject,
  GetUserAccountBuildersProjectQuery,
  GetUserAccountBuildersProjectQueryVariables,
} from '@/types/graphql'
import { config } from '@config'
import { useRoute } from 'vue-router'
import { formatEther } from '@/utils'
import { time } from '@distributedlab/tools'
import { DEFAULT_PAGE_LIMIT, DOT_TIME_FORMAT } from '@/const'
import { useWeb3ProvidersStore } from '@/store'
import { cn } from '@/theme/utils'
import { useLoad } from '@/composables'
import BuilderFormModal from '@/pages/Builders/components/BuilderFormModal.vue'
import BuildersStakeModal from '@/pages/Builders/components/BuildersStakeModal.vue'

defineOptions({
  inheritAttrs: true,
})

const route = useRoute()
const { provider } = useWeb3ProvidersStore()

const isWithdrawModalShown = ref(false)
const isEditModalShown = ref(false)
const isStakeModalShown = ref(false)

const stakersCurrentPage = ref(1)

const stakers = ref<GetBuildersProjectUsersQuery['buildersUsers']>([])

const {
  data: buildersData,
  isLoaded,
  isLoadFailed,
} = useLoad<{
  buildersProject: GetBuildersProjectQuery['buildersProject'] | null
  buildersProjectUserAccount:
    | GetUserAccountBuildersProjectQuery['buildersUsers'][0]
    | null
}>(
  { buildersProject: null, buildersProjectUserAccount: null },
  async () => {
    const [{ data: buildersProjectsResponse }] = await Promise.all([
      config.testnetBuildersApolloClient.query<
        GetBuildersProjectQuery,
        GetBuildersProjectQueryVariables
      >({
        query: GetBuildersProject,
        fetchPolicy: 'network-only',
        variables: {
          id: route.params.id as string,
        },
      }),
    ])

    const { data: userAccountInProject } =
      await config.testnetBuildersApolloClient.query<
        GetUserAccountBuildersProjectQuery,
        GetUserAccountBuildersProjectQueryVariables
      >({
        query: GetUserAccountBuildersProject,
        fetchPolicy: 'network-only',
        variables: {
          address: provider.selectedAddress,
          buildersProjectId: buildersProjectsResponse.buildersProject?.id,
        },
      })

    return {
      buildersProject: buildersProjectsResponse.buildersProject,
      buildersProjectUserAccount: userAccountInProject.buildersUsers[0],
    }
  },
  {
    isLoadOnMount: true,
  },
)

const isUserAccountAdmin = computed(
  () => provider.selectedAddress === buildersData.value.buildersProject?.admin,
)

const withdrawalUnlockTime = computed(() => {
  if (
    !buildersData.value.buildersProjectUserAccount ||
    !buildersData.value.buildersProject
  )
    return

  return time(buildersData.value.buildersProjectUserAccount.lastStake).add(
    buildersData.value.buildersProject.withdrawLockPeriodAfterDeposit,
    'seconds',
  )
})

const loadStakers = async (limit = DEFAULT_PAGE_LIMIT) => {
  try {
    const { data } = await config.testnetBuildersApolloClient.query<
      GetBuildersProjectUsersQuery,
      GetBuildersProjectUsersQueryVariables
    >({
      query: GetBuildersProjectUsers,
      fetchPolicy: 'network-only',
      variables: {
        first: limit,
        skip: stakersCurrentPage.value * limit - limit,
        buildersProjectId: buildersData.value.buildersProject?.id,
      },
    })

    stakers.value = data.buildersUsers
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
  }
}

watch(
  [
    () => route.query.user,
    () => route.query.network,
    () => buildersData.value.buildersProject,
    stakersCurrentPage,
  ],
  () => {
    loadStakers()
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss">
main {
  padding-top: toRem(24);
}
</style>
