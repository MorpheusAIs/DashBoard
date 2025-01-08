<template>
  <div class="flex flex-col overflow-y-auto">
    <button class="flex items-center gap-2" @click="$router.go(-1)">
      <app-icon
        :name="$icons.arrowLeft"
        class="size-4 text-textSecondaryLight"
      />
      <span class="text-textPrimary">Back</span>
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
        <span class="text-textPrimary">
          {{ buildersProject && abbrCenter(buildersProject.admin) }}
        </span>
        <copy-button content="asdfasdf" message="aasdfasdf" />
      </div>
    </div>

    <div class="mt-6 grid grid-cols-3 gap-[18px]">
      <app-gradient-border-card class="flex-1">
        <div class="flex flex-col gap-8 p-6">
          <div class="flex items-center justify-between">
            <span class="text-textPrimary"> Start time </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-textPrimary">
              {{
                buildersProject && humanizeTime(buildersProject.startsAt / 1000)
              }}
            </span>

            <!--            <span class="text-textPrimary"> 01.01.2024 </span>-->
            <!--            <span class="text-textPrimary"> 05:12 </span>-->
          </div>
        </div>
      </app-gradient-border-card>
      <app-gradient-border-card class="flex-1">
        <div class="flex flex-col gap-8 p-6">
          <span class="text-textPrimary"> Min MOR Deposit </span>
          <span class="text-textPrimary">
            {{ buildersProject && formatEther(buildersProject.minimalDeposit) }}
          </span>
        </div>
      </app-gradient-border-card>
      <app-gradient-border-card class="flex-1">
        <div class="flex flex-col gap-8 p-6">
          <span class="text-textPrimary"> Lock Period After Stake </span>
          <span class="text-textPrimary">
            {{
              buildersProject &&
              humanizeTime(buildersProject.claimLockEnd / 1000)
            }}</span
          >
        </div>
      </app-gradient-border-card>
    </div>

    <div class="mt-14 flex gap-[18px]">
      <div class="flex flex-[0.34] flex-col gap-[18px]">
        <app-gradient-border-card class="">
          <div class="flex flex-col gap-8 p-6">
            <div class="flex justify-between">
              <span class="text-textPrimary">
                Available MOR for Withdrawal
              </span>

              <app-button size="small" disabled> Withdraw </app-button>
            </div>
            <div class="flex items-center gap-8">
              <span class="text-textPrimary"> 3.9719 </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-textSecondary"> Unlock Time: </span>
              <div class="flex items-center gap-2">
                <span class="text-textPrimary"> 01.01.2024 </span>
                <span class="text-textPrimary"> 05:12 </span>
              </div>
            </div>
          </div>
        </app-gradient-border-card>
        <app-gradient-border-card class="">
          <div class="flex flex-col gap-8 p-6">
            <span class="text-textPrimary"> Total MOR Claimed </span>
            <span class="text-textPrimary">
              {{ buildersProject && formatEther(buildersProject.totalClaimed) }}
            </span>
          </div>
        </app-gradient-border-card>
        <app-gradient-border-card class="">
          <div class="flex flex-col gap-8 p-6">
            <span class="text-textPrimary"> Total MOR Staked </span>
            <span class="text-textPrimary">
              {{ buildersProject && formatEther(buildersProject.totalStaked) }}
            </span>
          </div>
        </app-gradient-border-card>
        <app-gradient-border-card class="">
          <div class="flex flex-col gap-8 p-6">
            <div class="flex justify-between">
              <span class="text-textPrimary"> Claim lock ends </span>

              <app-button size="small" disabled> Claim </app-button>
            </div>
            <div class="flex items-center gap-8">
              <span class="text-textPrimary">
                {{
                  buildersProject &&
                  humanizeTime(buildersProject.claimLockEnd / 1000)
                }}
              </span>
              <!--              <span class="text-textPrimary"> 01.01.2024 </span>-->
              <!--              <span class="text-textPrimary"> 05:12 </span>-->
            </div>
            <div class="flex items-center gap-2">
              <span class="text-textSecondary"> Admin address: </span>
              <div class="flex items-center gap-2">
                <span class="text-textPrimary">
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
            <span class="span text-textPrimary">Stakers</span>
            <app-gradient-border-card
              class="text-textPrimary bg-transparent p-2"
            >
              {{ stakers.length }}
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
                  <span class="text-textPrimary">
                    {{ abbrCenter(el.address) }}
                  </span>
                </div>
                <div class="px-20 py-8 text-end">
                  <span class="text-textPrimary">
                    {{ formatEther(el.staked) }}
                  </span>
                </div>
              </div>
            </app-gradient-border-card>
          </div>

          <pagination
            class="mt-6 self-center"
            :total-items="100"
            :current-page="0"
          />
        </div>
      </div>
    </div>
  </div>

  <builder-withdraw-modal :is-shown="false" />
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
import { ref, watch } from 'vue'
import {
  GetBuildersProject,
  GetBuildersProjectQuery,
  GetBuildersProjectQueryVariables,
  GetBuildersProjectUsers,
  GetBuildersProjectUsersQuery,
  GetBuildersProjectUsersQueryVariables,
} from '@/types/graphql'
import { config } from '@config'
import { useRoute } from 'vue-router'
import { formatEther } from '@/utils'

defineOptions({
  inheritAttrs: true,
})

const route = useRoute()

const buildersProject = ref<GetBuildersProjectQuery['buildersProject']>()
const stakers = ref<GetBuildersProjectUsersQuery['buildersUsers']>([])

const loadProjects = async () => {
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

  const { data: usersResponse } =
    await config.testnetBuildersApolloClient.query<
      GetBuildersProjectUsersQuery,
      GetBuildersProjectUsersQueryVariables
    >({
      query: GetBuildersProjectUsers,
      fetchPolicy: 'network-only',
      variables: {
        buildersProjectId: buildersProjectsResponse.buildersProject
          ?.id as string,
      },
    })

  buildersProject.value = buildersProjectsResponse.buildersProject
  stakers.value = usersResponse.buildersUsers
}

watch(
  [() => route.query.user, () => route.query.network],
  () => loadProjects(),
  { immediate: true },
)
</script>

<style lang="scss">
main {
  padding-top: toRem(24);
}
</style>
