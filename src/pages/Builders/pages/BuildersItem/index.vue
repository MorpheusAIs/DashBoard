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
        <chain-network-badge
          v-if="route.query.chain"
          :chain="route.query.chain as EthereumChains"
        />

        <span
          v-if="!!buildersData.builderSubnetUserAccount?.staked"
          :class="
            cn(
              'mt-2 self-start px-3 py-1 text-[#15151D]',
              'bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-dark)]',
            )
          "
        >
          {{ $t('builders-item.your-builder-lbl') }}
        </span>
        <template v-if="isLoaded">
          <div :class="cn('flex flex-col items-start gap-8', 'md:flex-row')">
            <div class="flex items-center gap-4">
              <template v-if="buildersData.builderSubnet?.image">
                <img
                  :src="buildersData.builderSubnet?.image"
                  class="aspect-square size-10 min-w-10 object-cover object-center"
                />
              </template>
              <template v-else>
                <div
                  class="flex size-12 items-center justify-center bg-backgroundSecondaryMain p-2"
                >
                  <span class="text-white typography-h2">
                    {{ buildersData?.builderSubnet?.name[0] }}
                  </span>
                </div>
              </template>

              <span class="typography-h1">
                {{ buildersData.builderSubnet?.name }}
              </span>
            </div>

            <button
              v-if="isOwner"
              class="ml-auto flex items-center gap-2"
              @click="
                $router.push({
                  name: $routes.appBuildersFormUpdate,
                  params: { id: buildersData.builderSubnet?.id },
                })
              "
            >
              <span class="text-primaryMain">
                {{ $t('builders-item.edit-btn') }}
              </span>
              <app-icon :name="$icons.edit" class="size-6 text-primaryMain" />
            </button>
          </div>

          <span class="max-w-[715px] text-textTertiaryMain">
            {{ buildersData.builderSubnet?.slug }}
          </span>
        </template>

        <skeleton class="my-4 h-[80px] w-[250px]" v-else />

        <div v-if="isLoaded" class="mt-6 flex items-center gap-8">
          <div class="flex items-center gap-2">
            <span class="text-textSecondaryMain">
              {{ abbrCenter(buildersData.builderSubnet?.owner) }}
            </span>
            <copy-button
              :content="buildersData.builderSubnet?.owner"
              message="copied"
            />
          </div>
          <a
            v-if="buildersData.builderSubnet?.website"
            class="flex items-center gap-2"
            :href="buildersData.builderSubnet?.website"
            target="_blank"
          >
            <span class="text-textSecondaryMain">
              {{ beautifyLink(buildersData.builderSubnet?.website) }}
            </span>
            <app-icon class="h-6 w-6 text-primaryMain" :name="$icons.link" />
          </a>
        </div>
        <skeleton class="w-[350px]" v-else />
      </div>

      <div class="my-12 flex items-center">
        <template v-if="isLoaded">
          <div
            v-for="(item, idx) in [
              {
                label: $t('builders-item.starts-at-lbl'),
                value: time(+buildersData.builderSubnet?.startsAt).format(
                  DOT_TIME_FORMAT,
                ),
              },
              {
                label: $t('builders-item.total-claimed-lbl'),
                value: formatEther(
                  buildersData.builderSubnet?.totalClaimed ?? 0,
                ),
              },
              {
                label: $t('builders-item.total-staked-lbl'),
                value: formatEther(
                  buildersData.builderSubnet?.totalStaked ?? 0,
                ),
              },
            ]"
            :key="idx"
            :class="
              cn(
                'flex flex-col gap-1',
                idx !== 0 &&
                  'ml-5 border-l-[1px] border-solid border-textTertiaryMain pl-5',
              )
            "
          >
            <span class="text-textTertiaryMain">{{ item.label }}</span>
            <span class="text-textSecondaryMain typography-h4">{{
              item.value
            }}</span>
          </div>
        </template>
        <template v-else>
          <div class="flex gap-2">
            <skeleton class="h-[100px] w-[200px]" />
            <skeleton class="h-[100px] w-[200px]" />
            <skeleton class="h-[100px] w-[200px]" />
          </div>
        </template>
      </div>

      <div
        :class="cn('mt-6 flex flex-wrap gap-[18px]', 'lg:grid lg:grid-cols-4')"
      >
        <template v-if="isLoaded">
          <app-gradient-border-card
            v-if="isLoaded"
            :class="cn('min-h-[150px] flex-1')"
          >
            <div class="flex flex-col gap-8 p-6">
              <div class="flex items-center gap-2">
                <span class="text-textSecondaryMain typography-h2">
                  {{
                    time(+buildersData.builderSubnet?.maxClaimLockEnd).format(
                      DOT_TIME_FORMAT,
                    )
                  }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-textTertiaryMain typography-body3">
                  {{ $t('builders-item.claim-lock-ends-lbl') }}
                </span>
              </div>
            </div>
          </app-gradient-border-card>
          <app-gradient-border-card class="flex-1">
            <div class="flex flex-col gap-8 overflow-hidden p-6">
              <span
                class="w-full overflow-hidden text-ellipsis text-textSecondaryMain typography-h2"
              >
                {{ formatEther(buildersData.builderSubnet?.minStake) }}
              </span>
              <span class="text-textTertiaryMain typography-body3">
                {{ $t('builders-item.min-deposit-lbl') }}
              </span>
            </div>
          </app-gradient-border-card>
          <app-gradient-border-card class="flex-1">
            <div class="flex flex-col gap-8 p-6">
              <span class="whitespace-pre text-textSecondaryMain typography-h2">
                {{
                  humanizeTime(
                    +buildersData.builderSubnet?.withdrawLockPeriodAfterStake,
                  )
                }}</span
              >
              <span class="text-textTertiaryMain typography-body3">
                {{ $t('builders-item.lock-period-lbl') }}
              </span>
            </div>
          </app-gradient-border-card>
          <app-gradient-border-card class="flex-1">
            <div class="flex flex-col gap-8 p-6">
              <span class="whitespace-pre text-textSecondaryMain typography-h2">
                {{
                  `${formatAmount(buildersData.builderSubnet?.fee ?? 0, 23)}%`
                }}
              </span>
              <span class="text-textTertiaryMain typography-body3">
                {{ $t('builders-item.fee-emissions-lbl') }}
              </span>
            </div>
          </app-gradient-border-card>
        </template>
        <template v-else>
          <skeleton class="h-[160px]" />
          <skeleton class="h-[160px]" />
          <skeleton class="h-[160px]" />
          <skeleton class="h-[160px]" />
        </template>
      </div>

      <div :class="cn('mt-14 flex flex-col gap-[18px]', 'md:flex-row')">
        <div class="flex flex-[0.34] flex-col gap-[18px]">
          <template v-if="isLoaded">
            <app-gradient-border-card>
              <div class="flex flex-col gap-8 p-6">
                <div class="flex items-center justify-between">
                  <span class="text-textSecondaryMain typography-body3">
                    {{ $t('builders-item.available-for-withdrawal-lbl') }}
                  </span>

                  <app-button
                    size="small"
                    @click="isWithdrawModalShown = true"
                    :disabled="
                      !buildersData.builderSubnetUserAccount?.staked ||
                      withdrawalUnlockTime?.isAfter(time()) ||
                      isClaimSubmitting
                    "
                  >
                    {{ $t('builders-item.withdraw-btn') }}
                  </app-button>
                </div>
                <div class="flex items-center gap-8">
                  <span class="text-textSecondaryMain typography-h2">
                    {{
                      formatEther(
                        buildersData.builderSubnetUserAccount?.staked ?? 0,
                      )
                    }}
                  </span>
                </div>
                <div
                  v-if="withdrawalUnlockTime?.isAfter(time())"
                  class="flex items-center gap-2"
                >
                  <span class="text-textSecondary">
                    {{ $t('builders-item.withdraw-unlock-time-lbl') }}
                  </span>
                  <div class="flex items-center gap-2">
                    <span class="text-textSecondaryMain">
                      {{ withdrawalUnlockTime?.format(DOT_TIME_FORMAT) }}
                    </span>
                  </div>
                </div>
              </div>
            </app-gradient-border-card>
            <app-gradient-border-card>
              <div class="flex flex-col gap-8 p-6">
                <div class="flex items-center justify-between">
                  <span class="text-textSecondaryMain typography-body3">
                    {{ $t('builders-item.available-to-claim-lbl') }}
                  </span>

                  <app-button
                    size="small"
                    @click="isClaimModalShown = true"
                    :disabled="
                      isClaimSubmitting ||
                      !+buildersData.builderSubnetUserAccount?.staked ||
                      claimLockUntil.isAfter(time())
                    "
                  >
                    {{ $t('builders-item.claim-btn') }}
                  </app-button>
                </div>
                <div class="flex items-center gap-8">
                  <span
                    class="whitespace-pre text-textSecondaryMain typography-h2"
                  >
                    {{
                      formatAmount(stakerRewards.toString(), 18, {
                        decimals: 4,
                      })
                    }}
                  </span>
                </div>
                <div
                  v-if="
                    !+buildersData.builderSubnetUserAccount?.staked ||
                    claimLockUntil.isAfter(time())
                  "
                  class="flex items-center gap-2"
                >
                  <span class="text-textSecondary">
                    {{ $t('builders-item.claim-unlock-time-lbl') }}
                  </span>
                  <div class="flex items-center gap-2">
                    <span class="text-textSecondaryMain">
                      {{ claimLockUntil?.format(DOT_TIME_FORMAT) }}
                    </span>
                  </div>
                </div>
              </div>
            </app-gradient-border-card>

            <div class="flex flex-col">
              <span class="text-textSecondaryMain typography-h3">
                {{ $t('builders-item.desc-title') }}
              </span>
              <p class="text-textSecondaryMain typography-body3">
                {{ buildersData.builderSubnet?.description }}
              </p>
            </div>
          </template>
          <template v-else>
            <skeleton class="h-[160px]" />
            <skeleton class="h-[160px]" />
            <skeleton class="h-[320px]" />
          </template>
        </div>

        <div
          :class="cn('col-span-2 flex flex-[0.65] flex-col gap-6', 'md:pl-12')"
        >
          <div class="flex items-center justify-between">
            <div v-if="isStakersLoaded" class="flex items-center gap-4">
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
                {{ buildersData?.builderSubnet?.totalUsers }}
              </app-gradient-border-card>
            </div>
            <div v-else class="flex items-center gap-4">
              <skeleton class="w-[160px]" />
              <skeleton class="w-[35px]" />
            </div>

            <app-button
              :disabled="
                !isStakersLoaded ||
                balances.rewardsToken?.isZero() ||
                isClaimSubmitting ||
                time(+buildersData?.builderSubnet?.startsAt).isAfter(time())
              "
              @click="isStakeModalShown = true"
            >
              {{ $t('builders-item.stake-btn') }}
            </app-button>
          </div>

          <div class="flex flex-1 flex-col">
            <template v-if="isStakersLoaded">
              <template v-if="stakers?.length">
                <div
                  :class="
                    cn(
                      'mb-2 grid grid-cols-[1fr,1fr,1fr,100px]',
                      'items-center justify-between gap-2 px-10',
                    )
                  "
                >
                  <div class="">
                    <span class="text-textTertiaryMain">
                      {{ $t('builders-item.staker-addr-name-th') }}
                    </span>
                  </div>

                  <sorting-icon-button
                    class="justify-self-end"
                    :label="$t('builders-item.staked-th')"
                    :order-by="BuilderUser_OrderBy.Staked"
                    v-model:order-by-model="stakersOrderBy"
                    v-model:order-direction-model="stakersOrderDirection"
                  />

                  <sorting-icon-button
                    class="justify-self-end"
                    :label="$t('builders-item.date-th')"
                    :order-by="BuilderUser_OrderBy.ClaimLockEnd"
                    v-model:order-by-model="stakersOrderBy"
                    v-model:order-direction-model="stakersOrderDirection"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <app-gradient-border-card v-for="el in stakers" :key="el.id">
                    <div class="grid grid-cols-[1fr,1fr,1fr,100px] gap-2 px-10">
                      <div class="flex items-center gap-2 py-8">
                        <span class="text-textSecondaryMain">
                          {{ abbrCenter(el.address) }}
                        </span>
                        <copy-button
                          :content="el.address"
                          :message="'copied'"
                        />
                      </div>
                      <div class="flex items-center justify-end gap-2 py-8">
                        <span class="text-textSecondaryMain">
                          {{ formatEther(el.staked ?? 0) }}
                        </span>
                      </div>
                      <div class="py-8 text-end">
                        <span class="text-textSecondaryMain">
                          {{ time(+el.lastStake).format(DOT_TIME_FORMAT) }}
                        </span>
                      </div>
                      <div class="flex items-center justify-end">
                        <app-button
                          color="primary"
                          size="small"
                          @click="
                            () => {
                              selectedClaimReceiver = el.address
                              isClaimModalShown = true
                            }
                          "
                          :disabled="!el.availableToClaim"
                        >
                          {{ $t('builders-item.claim-btn') }}
                        </app-button>
                      </div>
                    </div>
                  </app-gradient-border-card>
                </div>

                <pagination
                  v-if="
                    isStakersLoaded &&
                    !isStakersLoadFailed &&
                    buildersData.builderSubnet?.totalUsers >= STAKERS_PAGE_LIMIT
                  "
                  v-model:current-page="stakersCurrentPage"
                  :page-limit="STAKERS_PAGE_LIMIT"
                  :total-items="buildersData.builderSubnet?.totalUsers"
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
                <skeleton
                  v-for="i in STAKERS_PAGE_LIMIT"
                  :key="i"
                  class="h-16 animate-pulse"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>

  <builder-withdraw-modal
    v-if="buildersData.builderSubnet && buildersData.builderSubnetUserAccount"
    v-model:is-shown="isWithdrawModalShown"
    :builder-subnet="buildersData.builderSubnet"
    :builders-subnet-user-account="buildersData.builderSubnetUserAccount"
    @submitted="handleWithdrawalSubmitted"
  />
  <builders-stake-modal
    v-model:is-shown="isStakeModalShown"
    v-if="buildersData.builderSubnet"
    :builder-subnet="buildersData.builderSubnet"
    :chain="provider.chainId"
    @staked="handleStaked"
  />
  <builders-claim-modal
    v-if="buildersData.builderSubnet && selectedClaimReceiverRewards"
    v-model:is-shown="isClaimModalShown"
    :builder-subnet="buildersData.builderSubnet"
    :chain="provider.chainId"
    :claim-receiver="selectedClaimReceiver"
    :staker-rewards="selectedClaimReceiverRewards"
    @claimed="handleClaimed"
  />
</template>

<script setup lang="ts">
import {
  AppButton,
  AppGradientBorderCard,
  AppIcon,
  ChainNetworkBadge,
  CopyButton,
  ErrorMessage,
  NoDataMessage,
  Pagination,
  Skeleton,
} from '@/common'
import {
  abbrCenter,
  humanizeTime,
  sleep,
  beautifyLink,
  formatAmount,
} from '@/helpers'
import BuilderWithdrawModal from '@/pages/Builders/pages/BuildersItem/components/BuilderWithdrawModal.vue'
import { computed, ref, onBeforeMount } from 'vue'
import {
  BuilderSubnetDefaultFragment,
  BuilderUser_OrderBy,
  BuilderUserDefaultFragment,
  GetBuilderSubnet,
  GetBuilderSubnetQuery,
  GetBuilderSubnetQueryVariables,
  GetBuilderSubnetUsers,
  GetBuilderSubnetUsersQuery,
  GetBuilderSubnetUsersQueryVariables,
  GetUserAccountBuilderSubnets,
  GetUserAccountBuilderSubnetsQuery,
  GetUserAccountBuilderSubnetsQueryVariables,
  OrderDirection,
} from '@/types/graphql'
import { useRoute } from 'vue-router'
import { formatEther } from '@/utils'
import { time } from '@distributedlab/tools'
import { DOT_TIME_FORMAT } from '@/const'
import { useWeb3ProvidersStore } from '@/store'
import { cn } from '@/theme/utils'
import { useLoad } from '@/composables'
import BuildersStakeModal from '@/pages/Builders/components/BuildersStakeModal.vue'
import { storeToRefs } from 'pinia'
import { useSecondApolloClient } from '@/composables/use-second-apollo-client'
import { EthereumChains } from '@config'
import SortingIconButton from '@/pages/Builders/components/SortingIconButton.vue'
import BuildersClaimModal from './components/BuildersClaimModal.vue'
import predefinedBuildersMeta from '@/assets/predefined-builders-meta.json'

defineOptions({
  inheritAttrs: true,
})

const route = useRoute()
const { provider, balances, builderSubnetsContract } = storeToRefs(
  useWeb3ProvidersStore(),
)

const { client: buildersApolloClient, clients } = useSecondApolloClient()

const isWithdrawModalShown = ref(false)
const isStakeModalShown = ref(false)
const isClaimModalShown = ref(false)

const isClaimSubmitting = ref(false)

const stakersCurrentPage = ref(1)

const currentClient = computed(() => {
  const client = Object.entries(clients.value).find(
    item => item[0] === route.query.chain,
  )?.[1]

  return client || buildersApolloClient.value
})

const STAKERS_PAGE_LIMIT = 5

const stakersOrderBy = ref<BuilderUser_OrderBy>(
  BuilderUser_OrderBy.ClaimLockEnd,
)
const stakersOrderDirection = ref<OrderDirection>(OrderDirection.Asc)

const selectedClaimReceiver = ref(provider.value.selectedAddress)

const {
  data: buildersData,
  isLoaded,
  isLoadFailed,
  update,
} = useLoad<{
  builderSubnet: BuilderSubnetDefaultFragment | null
  builderSubnetUserAccount: BuilderUserDefaultFragment | null
}>(
  { builderSubnet: null, builderSubnetUserAccount: null },
  async () => {
    const [{ data: builderSubnetsResponse }] = await Promise.all([
      currentClient.value.query<
        GetBuilderSubnetQuery,
        GetBuilderSubnetQueryVariables
      >({
        query: GetBuilderSubnet,
        fetchPolicy: 'network-only',
        variables: {
          id: route.params.id as string,
        },
      }),
    ])

    const { data: userAccountInBuilderSubnet } =
      await currentClient.value.query<
        GetUserAccountBuilderSubnetsQuery,
        GetUserAccountBuilderSubnetsQueryVariables
      >({
        query: GetUserAccountBuilderSubnets,
        fetchPolicy: 'network-only',
        variables: {
          address: provider.value.selectedAddress,
          builder_subnet_id: builderSubnetsResponse.builderSubnet?.id,
        },
      })

    const predefinedBuilderSubnet = predefinedBuildersMeta.find(
      item =>
        item.name?.toLowerCase() ===
        builderSubnetsResponse.builderSubnet?.name.toLowerCase(),
    )

    return {
      builderSubnet: {
        ...builderSubnetsResponse.builderSubnet,
        description:
          builderSubnetsResponse.builderSubnet?.description ||
          predefinedBuilderSubnet?.description ||
          '',
        website:
          builderSubnetsResponse.builderSubnet?.website ||
          predefinedBuilderSubnet?.website ||
          '',
        image:
          builderSubnetsResponse.builderSubnet?.image ||
          predefinedBuilderSubnet?.localImage ||
          predefinedBuilderSubnet?.image ||
          '',
      } as BuilderSubnetDefaultFragment,
      builderSubnetUserAccount:
        userAccountInBuilderSubnet.builderUsers[0] ?? null,
    }
  },
  {
    isLoadOnMount: true,
  },
)

const {
  data: stakers,
  isLoaded: isStakersLoaded,
  isLoadFailed: isStakersLoadFailed,
} = useLoad(
  [],
  async () => {
    const { data } = await currentClient.value.query<
      GetBuilderSubnetUsersQuery,
      GetBuilderSubnetUsersQueryVariables
    >({
      query: GetBuilderSubnetUsers,
      fetchPolicy: 'network-only',
      variables: {
        first: STAKERS_PAGE_LIMIT,
        skip:
          stakersCurrentPage.value * STAKERS_PAGE_LIMIT - STAKERS_PAGE_LIMIT,
        builderSubnetId: buildersData.value.builderSubnet?.id,
        orderBy: stakersOrderBy.value,
        orderDirection: stakersOrderDirection.value,
      },
    })

    const stakersWithRewards = await Promise.all(
      data.builderUsers.map(async user => {
        const res =
          await builderSubnetsContract.value.providerBased.value.getStakerRewards(
            buildersData.value.builderSubnet?.id ?? '',
            user.address,
          )

        return {
          ...user,
          availableToClaim: res.toString(),
        }
      }),
    )

    return stakersWithRewards
  },
  {
    reloadArgs: [
      stakersCurrentPage,
      buildersData,
      stakersOrderBy,
      stakersOrderDirection,
    ],
  },
)

const { data: stakerRewards } = useLoad(
  '',
  async () => {
    if (
      !buildersData.value.builderSubnet?.id ||
      !provider.value.selectedAddress
    )
      return ''

    const res =
      await builderSubnetsContract.value.providerBased.value.getStakerRewards(
        buildersData.value.builderSubnet?.id ?? '',
        provider.value.selectedAddress,
      )

    return res.toString()
  },
  {
    reloadArgs: [buildersData, provider.value.selectedAddress],
  },
)

const selectedClaimReceiverRewards = computed(() => {
  if (
    selectedClaimReceiver.value.toLowerCase() ===
    provider.value.selectedAddress.toLowerCase()
  ) {
    return stakerRewards.value
  }

  return stakers.value.find(
    el =>
      el.address.toLowerCase() === selectedClaimReceiver.value.toLowerCase(),
  )?.availableToClaim
})

const isOwner = computed(
  () =>
    provider.value.selectedAddress?.toLowerCase() ===
    buildersData.value.builderSubnet?.owner?.toLowerCase(),
)

const withdrawalUnlockTime = computed(() => {
  if (
    !buildersData.value.builderSubnetUserAccount ||
    !buildersData.value.builderSubnet
  )
    return

  if (!+buildersData.value.builderSubnetUserAccount.lastStake) return

  return time(+buildersData.value.builderSubnetUserAccount.lastStake).add(
    buildersData.value.builderSubnet.withdrawLockPeriodAfterStake,
    'seconds',
  )
})

const claimLockUntil = computed(() => {
  if (!buildersData.value) return time()

  return time(
    +buildersData.value?.builderSubnetUserAccount?.claimLockEnd ||
      +buildersData.value?.builderSubnet?.maxClaimLockEnd,
  )
})

const handleStaked = async () => {
  isStakeModalShown.value = false
  await sleep(1000)
  await update()
}

const handleClaimed = async () => {
  isClaimModalShown.value = false
  await sleep(1000)
  await update()
}

const handleWithdrawalSubmitted = async () => {
  isWithdrawModalShown.value = false
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
