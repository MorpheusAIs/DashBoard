<template>
  <div class="flex flex-col overflow-y-auto">
    <button class="flex items-center gap-2" @click="$router.go(-1)">
      <app-icon
        :name="$icons.arrowLeft"
        class="size-4 text-textSecondaryLight"
      />
      <span class="text-textSecondaryMain">Back</span>
    </button>

    <div class="mt-14 flex flex-col">
      <span
        class="self-start bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-dark)] px-3 py-1 text-[#15151D]"
      >
        Your Builder
      </span>
      <div class="flex items-center gap-8">
        <span class="typography-h1">{{ buildersProject?.name }}</span>

        <div class="flex items-center gap-2">
          <span class="text-primaryMain">Edit</span>
          <app-icon :name="$icons.edit" class="size-6 text-primaryMain" />
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-textSecondaryMain">
          {{ buildersProject && abbrCenter(buildersProject.admin) }}
        </span>
        <copy-button content="asdfasdf" message="aasdfasdf" />
      </div>
    </div>

    <div class="mt-6 grid grid-cols-3 gap-[18px]">
      <app-gradient-border-card class="flex-1">
        <div class="flex flex-col gap-8 p-6">
          <div class="flex items-center justify-between">
            <span class="text-textSecondaryMain typography-body3">
              Start time
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="line-clamp-1 text-textSecondaryMain typography-h2">
              {{
                buildersProject &&
                time(+buildersProject.startsAt).format(DOT_TIME_FORMAT)
              }}
            </span>
          </div>
        </div>
      </app-gradient-border-card>
      <app-gradient-border-card class="flex-1">
        <div class="flex flex-col gap-8 p-6">
          <span class="text-textSecondaryMain typography-body3">
            Min MOR Deposit
          </span>
          <span class="text-textSecondaryMain typography-h2">
            {{ buildersProject && formatEther(buildersProject.minimalDeposit) }}
          </span>
        </div>
      </app-gradient-border-card>
      <app-gradient-border-card class="flex-1">
        <div class="flex flex-col gap-8 p-6">
          <span class="text-textSecondaryMain typography-body3">
            Lock Period After Stake
          </span>
          <span class="text-textSecondaryMain typography-h2">
            {{
              buildersProject &&
              humanizeTime(
                buildersProject.withdrawLockPeriodAfterDeposit / 1000,
              )
            }}</span
          >
        </div>
      </app-gradient-border-card>
    </div>

    <div class="mt-14 flex gap-[18px]">
      <div class="flex flex-[0.34] flex-col gap-[18px]">
        <app-gradient-border-card v-if="isUserAccountAdmin">
          <div class="flex flex-col gap-8 p-6">
            <div class="flex justify-between">
              <span class="text-textSecondaryMain typography-body3">
                Available MOR for Withdrawal
              </span>

              <app-button
                size="small"
                @click="
                  () => {
                    isWithdrawModalShown = true
                  }
                "
              >
                Withdraw
              </app-button>
            </div>
            <div class="flex items-center gap-8">
              <span class="text-textSecondaryMain typography-h2">
                {{
                  buildersProjectUserAccount?.staked
                    ? formatEther(buildersProjectUserAccount?.staked)
                    : 0
                }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-textSecondary"> Unlock Time: </span>
              <div class="flex items-center gap-2">
                <span class="text-textSecondaryMain"> {{ time() }} </span>
              </div>
            </div>
          </div>
        </app-gradient-border-card>
        <app-gradient-border-card class="">
          <div class="flex flex-col gap-8 p-6">
            <span class="text-textSecondaryMain typography-body3">
              Total MOR Claimed
            </span>
            <span class="text-textSecondaryMain typography-h2">
              {{ buildersProject && formatEther(buildersProject.totalClaimed) }}
            </span>
          </div>
        </app-gradient-border-card>
        <app-gradient-border-card class="">
          <div class="flex flex-col gap-8 p-6">
            <span class="text-textSecondaryMain typography-body3">
              Total MOR Staked
            </span>
            <span class="text-textSecondaryMain typography-h2">
              {{ buildersProject && formatEther(buildersProject.totalStaked) }}
            </span>
          </div>
        </app-gradient-border-card>
        <app-gradient-border-card class="">
          <div class="flex flex-col gap-8 p-6">
            <div class="flex justify-between">
              <span class="text-textSecondaryMain typography-body3">
                Claim lock ends
              </span>

              <app-button size="small" disabled> Claim </app-button>
            </div>
            <div class="flex items-center gap-8">
              <span class="text-textSecondaryMain typography-h2">
                {{
                  buildersProject &&
                  time(buildersProject.claimLockEnd).format(DOT_TIME_FORMAT)
                }}
              </span>
              <!--              <span class="text-textPrimary"> 01.01.2024 </span>-->
              <!--              <span class="text-textPrimary"> 05:12 </span>-->
            </div>
            <div class="flex items-center gap-2">
              <span class="text-textSecondary"> Admin address: </span>
              <div class="flex items-center gap-2">
                <span class="text-textSecondaryMain">
                  {{ abbrCenter('0xaksjdnfkajsdnfkajsdnfkajsndfkjn') }}
                </span>
                <copy-button content="asdfasdf" message="aasdfasdf" />
              </div>
            </div>
          </div>
        </app-gradient-border-card>
      </div>
      <div class="col-span-2 flex flex-[0.65] flex-col gap-6 pl-12">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <span class="span text-textSecondaryMain">Stakers</span>
            <app-gradient-border-card
              class="bg-transparent p-2 text-textSecondaryMain"
            >
              {{ buildersProject?.totalUsers }}
            </app-gradient-border-card>
          </div>
          <app-button>Stake</app-button>
        </div>

        <div class="flex flex-1 flex-col">
          <div class="mb-2 grid grid-cols-2 items-center justify-between">
            <div class="px-20">
              <span class="text-textSecondary">Name / Address</span>
            </div>

            <button class="flex items-center justify-end gap-2 px-20">
              <span class="text-textSecondary">Start time</span>
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
            v-model:current-page="stakersCurrentPage"
            :page-limit="DEFAULT_PAGE_LIMIT"
            :total-items="buildersProject?.totalUsers"
            class="mt-6 self-center"
          />
        </div>
      </div>
    </div>
  </div>

  <builder-withdraw-modal v-model:is-shown="isWithdrawModalShown" />
</template>

<script setup lang="ts">
import {
  AppButton,
  AppGradientBorderCard,
  AppIcon,
  CopyButton,
  Pagination,
} from '@/common'
import { abbrCenter, humanizeTime } from '@/helpers'
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

defineOptions({
  inheritAttrs: true,
})

const route = useRoute()

const isWithdrawModalShown = ref(false)
const stakersCurrentPage = ref(1)

const stakers = ref<GetBuildersProjectUsersQuery['buildersUsers']>([])
const buildersProject = ref<GetBuildersProjectQuery['buildersProject']>()
const buildersProjectUserAccount =
  ref<GetUserAccountBuildersProjectQuery['buildersUsers'][0]>()

const { provider } = useWeb3ProvidersStore()

const isUserAccountAdmin = computed(
  () => provider.selectedAddress === buildersProject.value?.admin,
)

const load = async () => {
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

  buildersProject.value = buildersProjectsResponse.buildersProject
  buildersProjectUserAccount.value = userAccountInProject.buildersUsers?.[0]
}

const loadStakers = async (limit = DEFAULT_PAGE_LIMIT) => {
  const { data } = await config.testnetBuildersApolloClient.query<
    GetBuildersProjectUsersQuery,
    GetBuildersProjectUsersQueryVariables
  >({
    query: GetBuildersProjectUsers,
    fetchPolicy: 'network-only',
    variables: {
      first: limit,
      skip: stakersCurrentPage.value * limit - limit,
      buildersProjectId: buildersProject.value?.id,
    },
  })

  stakers.value = data.buildersUsers
}

watch(
  [() => route.query.user, () => route.query.network],
  () => {
    load()
  },
  {
    immediate: true,
  },
)

watch(
  [
    () => route.query.user,
    () => route.query.network,
    buildersProject,
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
