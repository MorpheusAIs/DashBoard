<template>
  <basic-modal
    :is-shown="isShown"
    @update:is-shown="emit('update:is-shown', $event)"
    :title="$t('builders-stake-modal.modal-title')"
    :is-close-by-click-outside="!isSubmitting"
    :has-close-button="!isSubmitting"
  >
    <form @submit.prevent="submit" class="max-h-[80dvh] overflow-auto">
      <div class="mt-8 flex flex-col gap-5">
        <div class="flex flex-col items-end gap-3">
          <input-field
            v-model="form.stakeAmount"
            :placeholder="$t('builders-stake-modal.stake-amount-plh')"
            :error-message="getFieldErrorMessage('stakeAmount')"
            @blur="touchField('stakeAmount')"
            :disabled="isSubmitting"
          >
            <template #nodeRight>
              <button
                type="button"
                class="stake-modal__inputs-max-btn"
                @click="setMaxAmount"
                :disabled="isSubmitting"
              >
                {{ $t('builders-stake-modal.stake-amount-max-btn') }}
              </button>
            </template>
          </input-field>

          <input-field
            v-model="form.claimLockEnd"
            :placeholder="$t('builders-stake-modal.claim-lock-end-plh')"
            :note="
              currentClaimLockEnd.isAfter(time())
                ? $t('builders-stake-modal.claim-lock-end-note', {
                    date: currentClaimLockEnd.format(DOT_TIME_FORMAT),
                  })
                : ''
            "
            :error-message="getFieldErrorMessage('claimLockEnd')"
            @blur="touchField('claimLockEnd')"
            :disabled="isSubmitting"
          />

          <div class="flex items-center justify-between gap-2">
            <span class="stake-modal__details-label">
              {{ $t('builders-stake-modal.available-to-stake-balance') }}
            </span>
            <span class="stake-modal__details-value">
              {{
                $t('builders-stake-modal.available-to-stake-balance-value', {
                  amount: formatEther(balances.rewardsToken ?? 0),
                })
              }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-col gap-3 bg-backdropModal px-6 py-4">
        <div
          v-if="chainDetails?.chainName"
          class="flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <span class="text-textSecondaryMain typography-body3">
              {{ $t('builders-stake-modal.power-factor-lbl') }}
            </span>
            <v-dropdown class="size-6">
              <!-- This will be the popover target (for the events and position) -->
              <button type="button" class="text-textSecondaryMain">
                <app-icon
                  :name="$icons.info"
                  class="color-textSecondaryMain size-4"
                />
              </button>
              <!-- This will be the content of the popover -->
              <template #popper>
                <span class="typography-body3">
                  {{ $t('builders-stake-modal.power-factor-tooltip') }}
                </span>
              </template>
            </v-dropdown>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-textSecondaryMain typography-body3">
              {{
                $t('builders-stake-modal.power-factor-value', {
                  powerFactor: formatAmount(powerFactor, 25),
                })
              }}
            </span>
          </div>
        </div>

        <div class="my-2 h-[1px] w-full bg-backgroundPrimaryMain opacity-20" />

        <div
          v-if="chainDetails?.chainName"
          class="flex items-center justify-between"
        >
          <span class="text-textSecondaryMain typography-body3">
            {{ $t('builders-stake-modal.network-lbl') }}
          </span>
          <div class="flex items-center gap-2">
            <img
              class="size-5"
              :src="chainDetails.iconUrls?.[0]"
              :alt="chainDetails?.chainName"
            />

            <span class="font-bold text-textSecondaryMain typography-body3">
              {{ chainDetails?.chainName }}
            </span>
          </div>
        </div>

        <div
          class="flex items-center justify-between"
          v-for="(el, i) in builderDetails.slice(0, 3)"
          :key="i"
        >
          <span class="text-textSecondaryMain typography-body3">
            {{ el.label }}
          </span>
          <span class="font-bold text-textSecondaryMain typography-body3">
            {{ el.value }}
          </span>
        </div>

        <div class="my-2 h-[1px] w-full bg-backgroundPrimaryMain opacity-20" />

        <div
          class="flex items-center justify-between"
          v-for="(el, i) in builderDetails.slice(3)"
          :key="i"
        >
          <span class="text-textSecondaryMain typography-body3">
            {{ el.label }}
          </span>
          <span class="font-bold text-textSecondaryMain typography-body3">
            {{ el.value }}
          </span>
        </div>
      </div>

      <div class="mt-10 flex items-center justify-center gap-4">
        <app-button
          scheme="filled"
          color="secondary"
          @click="emit('update:is-shown', false)"
          :disabled="isSubmitting"
        >
          {{ $t('builders-stake-modal.cancel-btn') }}
        </app-button>
        <app-button type="submit" :disabled="!isFieldsValid || isSubmitting">
          {{ $t('builders-stake-modal.submit-btn') }}
        </app-button>
      </div>
    </form>
  </basic-modal>
</template>

<script setup lang="ts">
import { AppButton, AppIcon, BasicModal } from '@/common'
import { InputField } from '@/fields'
import { useFormValidation, useI18n, useLoad } from '@/composables'
import { storeToRefs, useWeb3ProvidersStore } from '@/store'
import { computed, reactive, ref } from 'vue'
import { maxValue, minValue, numeric, required } from '@/validators'
import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  formatAmount,
  getEthExplorerTxUrl,
  humanizeTime,
  sleep,
} from '@/helpers'
import { formatEther, parseUnits } from '@/utils'
import {
  BuilderSubnetDefaultFragment,
  GetUserAccountBuilderSubnets,
  GetUserAccountBuilderSubnetsQuery,
  GetUserAccountBuilderSubnetsQueryVariables,
} from '@/types/graphql'
import { duration, time } from '@distributedlab/tools'
import { DEFAULT_TIME_FORMAT, DOT_TIME_FORMAT } from '@/const'
import { useSecondApolloClient } from '@/composables/use-second-apollo-client'
import { config, getEthereumChainsName } from '@config'
import { helpers } from '@vuelidate/validators'

const props = withDefaults(
  defineProps<{
    builderSubnet: BuilderSubnetDefaultFragment
    isShown?: boolean
    chain?: string
  }>(),
  {
    isShown: true,
    chain: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
  (e: 'staked'): void
}>()

const { t } = useI18n()

const {
  provider,
  rewardsContract,
  builderSubnetsContract,
  builderSubnetsContractDetails,
  balances,
} = storeToRefs(useWeb3ProvidersStore())

const { client: buildersApolloClient } = useSecondApolloClient()

const { data: buildersSubnetUserAccount } = useLoad<
  GetUserAccountBuilderSubnetsQuery['builderUsers'][0]
>(
  {} as GetUserAccountBuilderSubnetsQuery['builderUsers'][0],
  async () => {
    if (!props.isShown)
      return {} as GetUserAccountBuilderSubnetsQuery['builderUsers'][0]

    const { data: userAccountInSubnet } =
      await buildersApolloClient.value.query<
        GetUserAccountBuilderSubnetsQuery,
        GetUserAccountBuilderSubnetsQueryVariables
      >({
        query: GetUserAccountBuilderSubnets,
        fetchPolicy: 'network-only',
        variables: {
          address: provider.value.selectedAddress,
          builder_subnet_id: props.builderSubnet?.id,
        },
      })

    return userAccountInSubnet.builderUsers?.[0]
  },
  {
    reloadArgs: [() => props.isShown, () => provider.value.selectedAddress],
  },
)

const { data: powerFactor } = useLoad(
  '',
  async () => {
    const pfBN =
      await builderSubnetsContract.value.providerBased.value.getStakerPowerFactor(
        props.builderSubnet.id,
        provider.value.selectedAddress,
      )

    return pfBN.toString()
  },
  {
    reloadArgs: [buildersSubnetUserAccount],
  },
)

const currentClaimLockEnd = computed(() => {
  return time(
    +buildersSubnetUserAccount.value?.claimLockEnd ||
      +props.builderSubnet.minClaimLockEnd,
  )
})

const chainDetails = computed(() => {
  if (!props.chain) return undefined

  return config.chainsMap[getEthereumChainsName(props.chain)]
})

const isSubmitting = ref(false)

const form = reactive({
  stakeAmount: '',
  claimLockEnd: '',
})

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(
    form,
    computed(() => ({
      stakeAmount: {
        required,
        numeric,
        maxValue: maxValue(+formatEther(balances.value.rewardsToken || 0)),
      },
      claimLockEnd: {
        minValue: helpers.withMessage(
          t('builders-stake-modal.claim-lock-end-validation-msg', {
            data: currentClaimLockEnd.value.format(DOT_TIME_FORMAT),
          }),
          minValue(
            Number(
              buildersSubnetUserAccount.value.claimLockEnd ||
                props.builderSubnet.minClaimLockEnd,
            ),
          ),
        ),
      },
    })),
  )

const builderDetails = computed(() => [
  {
    label: t('builders-stake-modal.builder-lbl'),
    value: props.builderSubnet?.name,
  },
  {
    label: t('builders-stake-modal.min-deposit-lbl'),
    value: `${formatEther(props.builderSubnet?.minStake)} MOR`,
  },
  {
    label: t('builders-stake-modal.lock-period-lbl'),
    value: humanizeTime(+props.builderSubnet?.withdrawLockPeriodAfterStake),
  },
  {
    label: t('builders-stake-modal.new-stake-amount-lbl'),
    value: `${+formatEther(buildersSubnetUserAccount.value?.staked || 0) + +form.stakeAmount} MOR`,
  },
  {
    label: t('builders-stake-modal.new-unlock-date-lbl'),
    value: props.builderSubnet
      ? time()
          .add(
            duration(
              +props.builderSubnet?.withdrawLockPeriodAfterStake,
              'seconds',
            ).asSeconds,
            'seconds',
          )
          .format(DEFAULT_TIME_FORMAT)
      : '',
  },
])

const setMaxAmount = () => {
  form.stakeAmount = formatEther(balances.value.rewardsToken ?? 0)
}

const clearForm = () => {
  form.stakeAmount = ''
}

const submit = async () => {
  if (!isFormValid()) return

  isSubmitting.value = true

  try {
    if (
      provider.value.chainId !==
      (props.chain ?? builderSubnetsContractDetails.value.targetChainId)
    ) {
      provider.value.selectChain(
        props.chain ?? builderSubnetsContractDetails.value.targetChainId,
      )
      await sleep(1_500)
    }

    const allowance = await rewardsContract.value.providerBased.value.allowance(
      provider.value.selectedAddress,
      builderSubnetsContract.value.signerBased.value.address,
    )

    if (allowance.lt(parseUnits(form.stakeAmount))) {
      const approveTx = await rewardsContract.value.signerBased.value.approve(
        builderSubnetsContract.value.signerBased.value.address,
        parseUnits(form.stakeAmount),
      )

      await approveTx.wait()
    }

    const tx = await builderSubnetsContract.value.signerBased.value.stake(
      props.builderSubnet?.id,
      provider.value.selectedAddress,
      parseUnits(form.stakeAmount),
      form.claimLockEnd ? Number(form.claimLockEnd) : 0,
    )

    const txReceipt = await tx.wait()

    if (!txReceipt) throw new TypeError('Transaction is not defined')

    const explorerTxUrl = getEthExplorerTxUrl(
      builderSubnetsContractDetails.value.explorerUrl,
      txReceipt.transactionHash,
    )

    bus.emit(
      BUS_EVENTS.success,
      t('builders-stake-modal.stake-success-msg', { explorerTxUrl }),
    )

    emit('staked')
    clearForm()
  } catch (error) {
    ErrorHandler.process(error)
  }

  isSubmitting.value = false
}
</script>

<style lang="scss">
.stake-modal__details-label {
  font-size: toRem(16);
  line-height: toRem(24);
}

.stake-modal__details-value {
  font-size: toRem(16);
  font-weight: 700;
  line-height: toRem(24);
}

.stake-modal__callout-text {
  font-size: toRem(20);
  line-height: toRem(30);
}

.stake-modal__inputs-max-btn {
  color: var(--primary-main);
  font-size: toRem(18);
  font-weight: 700;
  line-height: toRem(24);

  @include square(48);
}

.v-popper--theme-dropdown .v-popper__inner {
  @apply max-w-[270px] border-none bg-[#030807] p-4;
}
</style>
