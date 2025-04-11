<template>
  <div :class="cn('flex flex-col overflow-y-auto')">
    <template v-if="isLoadFailed">
      <div
        class="flex h-[100dvh] w-full flex-col items-center justify-center gap-4 self-center"
      >
        <error-message
          :message="$t('builders-item.page-err-msg')"
          class="!gap-10"
        />
        <app-button :route="{ name: $routes.appBuildersList }">
          {{ $t('builders-item.page-err-btn') }}
        </app-button>
      </div>
    </template>
    <template v-else>
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
          v-if="!!buildersData.buildersProjectUserAccount?.staked"
          :class="
            cn(
              'self-start px-3 py-1 text-[#15151D]',
              'bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-dark)]',
            )
          "
        >
          {{ $t('builders-item.your-builder-lbl') }}
        </span>
        <template v-if="isLoaded">
          <div
            :class="
              cn(
                'flex flex-col items-start gap-8',
                'md:flex-row md:items-center',
              )
            "
          >
            <div class="flex items-center gap-4">
              <template v-if="builderMeta?.localImage">
                <img
                  :src="builderMeta?.localImage"
                  class="aspect-square size-10 min-w-10"
                />
              </template>

              <span class="typography-h1">
                {{ buildersData.buildersProject?.name }}
              </span>
            </div>

            <button
              v-if="isUserAccountAdmin"
              class="flex items-center gap-2"
              @click="isEditModalShown = true"
              :disabled="
                time(+buildersData.buildersProject?.startsAt)
                  .subtract(editPoolDeadline?.toNumber() ?? 0, 'seconds')
                  .isBefore(time()) || isClaimSubmitting
              "
            >
              <span class="text-primaryMain">
                {{ $t('builders-item.edit-btn') }}
              </span>
              <app-icon :name="$icons.edit" class="size-6 text-primaryMain" />
            </button>
          </div>

          <span class="text-textTertiaryMain">
            {{ builderMeta?.description }}
          </span>
        </template>

        <skeleton class="my-4 h-[80px] w-[250px]" v-else />

        <div v-if="isLoaded" class="mt-6 flex items-center gap-8">
          <div class="flex items-center gap-2">
            <span class="text-textSecondaryMain">
              {{ abbrCenter(buildersData.buildersProject?.admin) }}
            </span>
            <copy-button
              :content="buildersData.buildersProject?.admin"
              message="copied"
            />
          </div>
          <a
            v-if="builderMeta?.website"
            class="flex items-center gap-2"
            :href="builderMeta.website"
            target="_blank"
          >
            <span class="text-textSecondaryMain">
              {{ beautifyLink(builderMeta?.website) }}
            </span>
            <app-icon class="h-6 w-6 text-primaryMain" :name="$icons.link" />
          </a>
        </div>
        <skeleton class="w-[350px]" v-else />
      </div>

      <div
        :class="cn('mt-6 flex flex-wrap gap-[18px]', 'lg:grid lg:grid-cols-3')"
      >
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
              <span class="whitespace-pre text-textSecondaryMain typography-h2">
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
          <div class="flex flex-col gap-8 overflow-hidden p-6">
            <span class="text-textSecondaryMain typography-body3">
              {{ $t('builders-item.min-deposit-lbl') }}
            </span>
            <span
              class="w-full overflow-hidden text-ellipsis text-textSecondaryMain typography-h2"
            >
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
            <span class="whitespace-pre text-textSecondaryMain typography-h2">
              {{
                humanizeTime(
                  +buildersData.buildersProject?.withdrawLockPeriodAfterDeposit,
                )
              }}</span
            >
          </div>
        </app-gradient-border-card>
        <skeleton class="h-[160px]" v-else />
      </div>

      <div :class="cn('mt-14 flex flex-col gap-[18px]', 'md:flex-row')">
        <div class="flex flex-[0.34] flex-col gap-[18px]">
          <app-gradient-border-card v-if="isLoaded">
            <div class="flex flex-col gap-8 p-6">
              <div class="flex justify-between">
                <span class="text-textSecondaryMain typography-body3">
                  {{ $t('builders-item.available-for-withdrawal-lbl') }}
                </span>

                <app-button
                  v-if="
                    !!buildersData.buildersProjectUserAccount?.staked &&
                    !(
                      withdrawalUnlockTime?.isAfter(time()) || isClaimSubmitting
                    )
                  "
                  size="small"
                  @click="isWithdrawModalShown = true"
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
              <div
                class="flex items-center gap-2"
                v-if="time(withdrawalUnlockTime).isAfter(time())"
              >
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
                  v-if="
                    isUserAccountAdmin &&
                    (!buildersData.buildersProject ||
                      !buildersData.buildersProject.claimLockEnd ||
                      time(+buildersData.buildersProject.claimLockEnd).isAfter(
                        time(),
                      ) ||
                      isClaimSubmitting)
                  "
                  size="small"
                  @click="claim"
                >
                  {{ $t('builders-item.claim-btn') }}
                </app-button>
              </div>
              <div class="flex items-center gap-8">
                <span
                  class="whitespace-pre text-textSecondaryMain typography-h2"
                >
                  {{
                    +buildersData.buildersProject?.claimLockEnd
                      ? time(
                          +buildersData.buildersProject?.claimLockEnd,
                        ).format(DOT_TIME_FORMAT)
                      : $t('builders-item.empty-dash')
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
        <div
          :class="cn('col-span-2 flex flex-[0.65] flex-col gap-6', 'md:pl-12')"
        >
          <div class="flex items-center justify-between">
            <div v-if="isLoaded" class="flex items-center gap-4">
              <span class="span text-textSecondaryMain">
                {{ $t('builders-item.stakers-lbl') }}
              </span>
              <app-gradient-border-card
                :class="
                  cn(
                    'flex items-center justify-center bg-transparent p-2 text-textSecondaryMain',
                    'size-10 min-w-10',
                  )
                "
              >
                {{ buildersData?.buildersProject?.totalUsers }}
              </app-gradient-border-card>
            </div>
            <div v-else class="flex items-center gap-4">
              <skeleton class="w-[160px]" />
              <skeleton class="w-[35px]" />
            </div>

            <app-button
              :disabled="
                !isLoaded ||
                balances.rewardsToken?.isZero() ||
                isClaimSubmitting ||
                time(+buildersData?.buildersProject?.startsAt).isAfter(time())
              "
              @click="isStakeModalShown = true"
            >
              {{ $t('builders-item.stake-btn') }}
            </app-button>
          </div>

          <div class="flex flex-1 flex-col">
            <template v-if="isLoaded">
              <template v-if="stakers?.length">
                <div
                  class="mb-2 grid grid-cols-3 items-center justify-between gap-2 px-10"
                >
                  <div class="">
                    <span class="text-textTertiaryMain">
                      {{ $t('builders-item.staker-addr-name-th') }}
                    </span>
                  </div>

                  <button class="flex items-center justify-end gap-2">
                    <span class="text-textTertiaryMain">
                      {{ $t('builders-item.staked-th') }}
                    </span>
                    <app-icon :name="$icons.sort" class="size-6" />
                  </button>

                  <button class="flex items-center justify-end gap-2">
                    <span class="text-textTertiaryMain">
                      {{ $t('builders-item.date-th') }}
                    </span>
                    <app-icon :name="$icons.sort" class="size-6" />
                  </button>
                </div>

                <div class="flex flex-col gap-2">
                  <app-gradient-border-card v-for="el in stakers" :key="el.id">
                    <div class="grid grid-cols-3 gap-2 px-10">
                      <div class="flex items-center gap-2 py-8">
                        <span class="text-textSecondaryMain">
                          {{ abbrCenter(el.address) }}
                        </span>
                        <copy-button
                          :content="el.address"
                          :message="'copied'"
                        />
                      </div>
                      <div class="py-8 text-end">
                        <span class="text-textSecondaryMain">
                          {{ formatEther(el.staked) }}
                        </span>
                      </div>
                      <div class="py-8 text-end">
                        <span class="text-textSecondaryMain">
                          {{ time(+el.lastStake).format(DOT_TIME_FORMAT) }}
                        </span>
                        <!-- Commented out Claim button as requested -->
                        <!-- <app-button
                          size="small"
                          class="ml-2">
                          {{ $t('builders-item.claim-btn') }}
                        </app-button> -->
                      </div>
                    </div>
                  </app-gradient-border-card>
                </div>

                <pagination
                  v-if="
                    isLoaded &&
                    !isLoadFailed &&
                    buildersData.buildersProject?.totalUsers >=
                      DEFAULT_PAGE_LIMIT
                  "
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
    </template>
  </div>

  <builder-withdraw-modal
    v-if="
      buildersData.buildersProject && buildersData.buildersProjectUserAccount
    "
    v-model:is-shown="isWithdrawModalShown"
    :builder-project="buildersData.buildersProject"
    :builders-project-user-account="buildersData.buildersProjectUserAccount"
    @submitted="handleWithdrawalSubmitted"
  />
  <builder-form-modal
    v-if="buildersData.buildersProject"
    v-model:is-shown="isEditModalShown"
    :builders-project="buildersData.buildersProject"
    @submitted="handleBuilderPoolUpdated"
  />
  <builders-stake-modal
    v-model:is-shown="isStakeModalShown"
    v-if="buildersData.buildersProject"
    :builder-project="buildersData.buildersProject"
    @staked="handleStaked"
  />
</template>

<script setup lang="ts">
import {
  AppButton,
  AppGradientBorderCard,
  AppIcon,
  CopyButton,
  ErrorMessage,
  NoDataMessage,
  Pagination,
  Skeleton,
} from '@/common'
import {
  abbrCenter,
  bus,
  BUS_EVENTS,
  ErrorHandler,
  getEthExplorerTxUrl,
  humanizeTime,
  sleep,
  beautifyLink,
} from '@/helpers'
import BuilderWithdrawModal from '@/pages/Builders/pages/BuildersItem/components/BuilderWithdrawModal.vue'
import { computed, ref, watch, onBeforeMount } from 'vue'
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
import { useRoute } from 'vue-router'
import { formatEther } from '@/utils'
import { time } from '@distributedlab/tools'
import { DEFAULT_PAGE_LIMIT, DOT_TIME_FORMAT } from '@/const'
import { useWeb3ProvidersStore } from '@/store'
import { cn } from '@/theme/utils'
import { useI18n, useLoad } from '@/composables'
import BuilderFormModal from '@/pages/Builders/components/BuilderFormModal.vue'
import BuildersStakeModal from '@/pages/Builders/components/BuildersStakeModal.vue'
import { storeToRefs } from 'pinia'
import { useSecondApolloClient } from '@/composables/use-second-apollo-client'
import predefinedBuildersMeta from '@/assets/predefined-builders-meta.json'

defineOptions({
  inheritAttrs: true,
})

const route = useRoute()
const { provider, buildersContract, buildersContractDetails, balances } =
  storeToRefs(useWeb3ProvidersStore())

const { client: buildersApolloClient, clients } = useSecondApolloClient()

const { t } = useI18n()

const isWithdrawModalShown = ref(false)
const isEditModalShown = ref(false)
const isStakeModalShown = ref(false)

const isClaimSubmitting = ref(false)

const stakersCurrentPage = ref(1)

const stakers = ref<GetBuildersProjectUsersQuery['buildersUsers']>([])

const { data: editPoolDeadline } = useLoad(undefined, async () =>
  buildersContract.value.providerBased.value.editPoolDeadline(),
)

const currentClient = computed(() => {
  const client = Object.entries(clients.value).find(
    item => item[0] === route.query.chain,
  )?.[1]

  return client || buildersApolloClient.value
})

const {
  data: buildersData,
  isLoaded,
  isLoadFailed,
  update,
} = useLoad<{
  buildersProject: GetBuildersProjectQuery['buildersProject'] | null
  buildersProjectUserAccount:
    | GetUserAccountBuildersProjectQuery['buildersUsers'][0]
    | null
}>(
  { buildersProject: null, buildersProjectUserAccount: null },
  async () => {
    const [{ data: buildersProjectsResponse }] = await Promise.all([
      currentClient.value.query<
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

    const { data: userAccountInProject } = await currentClient.value.query<
      GetUserAccountBuildersProjectQuery,
      GetUserAccountBuildersProjectQueryVariables
    >({
      query: GetUserAccountBuildersProject,
      fetchPolicy: 'network-only',
      variables: {
        address: provider.value.selectedAddress,
        // eslint-disable-next-line
        // @ts-ignore
        project_id: buildersProjectsResponse.buildersProject?.id,
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

const builderMeta = computed(() => {
  if (!buildersData.value.buildersProject) return

  return predefinedBuildersMeta.find(
    el =>
      el.name.toLowerCase() ===
      buildersData.value.buildersProject?.name.toLowerCase(),
  )
})

const isUserAccountAdmin = computed(
  () =>
    provider.value.selectedAddress?.toLowerCase() ===
    buildersData.value.buildersProject?.admin?.toLowerCase(),
)

const withdrawalUnlockTime = computed(() => {
  if (
    !buildersData.value.buildersProjectUserAccount ||
    !buildersData.value.buildersProject
  )
    return

  if (!+buildersData.value.buildersProjectUserAccount.lastStake) return

  return time(+buildersData.value.buildersProjectUserAccount.lastStake).add(
    buildersData.value.buildersProject.withdrawLockPeriodAfterDeposit,
    'seconds',
  )
})

const loadStakers = async (limit = DEFAULT_PAGE_LIMIT) => {
  try {
    const { data } = await currentClient.value.query<
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
    () => route.query.chain,
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

const handleStaked = async () => {
  isStakeModalShown.value = false
  await sleep(1000)
  await update()
}

const handleWithdrawalSubmitted = async () => {
  isWithdrawModalShown.value = false
  await sleep(1000)
  await update()
}

const claim = async () => {
  isClaimSubmitting.value = true
  try {
    if (
      provider.value.chainId !== buildersContractDetails.value.targetChainId
    ) {
      provider.value.selectChain(buildersContractDetails.value.targetChainId)
      await sleep(1_000)
    }

    const tx = await buildersContract.value.signerBased.value.claim(
      buildersData.value.buildersProject?.id,
      provider.value.selectedAddress,
    )

    const txReceipt = await tx.wait()

    if (!txReceipt) throw new TypeError('Transaction receipt is not defined')

    const explorerTxUrl = getEthExplorerTxUrl(
      buildersContractDetails.value.explorerUrl,
      txReceipt.transactionHash,
    )

    bus.emit(
      BUS_EVENTS.success,
      t('builders-item.claim-success-msg', { explorerTxUrl }),
    )
  } catch (error) {
    ErrorHandler.process(error)
  }
  isClaimSubmitting.value = false
}

const handleBuilderPoolUpdated = async () => {
  isEditModalShown.value = false
  await sleep(1000)
  await update()
}

onBeforeMount(() => {
  if (provider.value.chainId === route.query.chain) return

  provider.value.selectChain(route.query.chain as string)
})
</script>

<style lang="scss">
main {
  padding-top: toRem(24);
}
</style>
