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
import { AppButton, BasicModal } from '@/common'
import { InputField } from '@/fields'
import { useFormValidation, useI18n, useLoad } from '@/composables'
import { storeToRefs, useWeb3ProvidersStore } from '@/store'
import { computed, reactive, ref } from 'vue'
import { maxValue, numeric, required } from '@/validators'
import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  getEthExplorerTxUrl,
  humanizeTime,
  sleep,
} from '@/helpers'
import { formatEther, parseUnits } from '@/utils'
import {
  GetBuildersProjectQuery,
  GetUserAccountBuildersProject,
  GetUserAccountBuildersProjectQuery,
  GetUserAccountBuildersProjectQueryVariables,
} from '@/types/graphql'
import { duration, time } from '@distributedlab/tools'
import { DEFAULT_TIME_FORMAT } from '@/const'
import { useSecondApolloClient } from '@/composables/use-second-apollo-client'
import { EthereumChains } from '@config'

const props = withDefaults(
  defineProps<{
    builderProject: GetBuildersProjectQuery['buildersProject']
    isShown?: boolean
    chain?: EthereumChains
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
  buildersContract,
  buildersContractDetails,
  balances,
} = storeToRefs(useWeb3ProvidersStore())

const { client: buildersApolloClient } = useSecondApolloClient()

const { data: buildersProjectUserAccount } = useLoad<
  GetUserAccountBuildersProjectQuery['buildersUsers'][0]
>(
  {} as GetUserAccountBuildersProjectQuery['buildersUsers'][0],
  async () => {
    if (!props.isShown)
      return {} as GetUserAccountBuildersProjectQuery['buildersUsers'][0]

    const { data: userAccountInProject } =
      await buildersApolloClient.value.query<
        GetUserAccountBuildersProjectQuery,
        GetUserAccountBuildersProjectQueryVariables
      >({
        query: GetUserAccountBuildersProject,
        fetchPolicy: 'network-only',
        variables: {
          address: provider.value.selectedAddress,
          project_id: props.builderProject?.id,
        },
      })

    return userAccountInProject.buildersUsers?.[0]
  },
  {
    reloadArgs: [() => props.isShown, () => provider.value.selectedAddress],
  },
)

const isSubmitting = ref(false)

const form = reactive({
  stakeAmount: '',
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
    })),
  )

const builderDetails = computed(() => [
  {
    label: t('builders-stake-modal.builder-lbl'),
    value: props.builderProject?.name,
  },
  {
    label: t('builders-stake-modal.min-deposit-lbl'),
    value: `${formatEther(props.builderProject?.minimalDeposit)} MOR`,
  },
  {
    label: t('builders-stake-modal.lock-period-lbl'),
    value: humanizeTime(+props.builderProject?.withdrawLockPeriodAfterDeposit),
  },
  {
    label: t('builders-stake-modal.new-stake-amount-lbl'),
    value: `${+formatEther(buildersProjectUserAccount.value?.staked || 0) + +form.stakeAmount} MOR`,
  },
  {
    label: t('builders-stake-modal.new-unlock-date-lbl'),
    value: props.builderProject
      ? time()
          .add(
            duration(
              +props.builderProject?.withdrawLockPeriodAfterDeposit,
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
      (props.chain ?? buildersContractDetails.value.targetChainId)
    ) {
      provider.value.selectChain(
        props.chain ?? buildersContractDetails.value.targetChainId,
      )
      await sleep(1_500)
    }

    const allowance = await rewardsContract.value.providerBased.value.allowance(
      provider.value.selectedAddress,
      buildersContract.value.signerBased.value.address,
    )

    if (allowance.lt(parseUnits(form.stakeAmount))) {
      const approveTx = await rewardsContract.value.signerBased.value.approve(
        buildersContract.value.signerBased.value.address,
        parseUnits(form.stakeAmount),
      )

      await approveTx.wait()
    }

    const tx = await buildersContract.value.signerBased.value.deposit(
      props.builderProject?.id,
      parseUnits(form.stakeAmount),
    )

    const txReceipt = await tx.wait()

    if (!txReceipt) throw new TypeError('Transaction is not defined')

    const explorerTxUrl = getEthExplorerTxUrl(
      buildersContractDetails.value.explorerUrl,
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

<style scoped lang="scss">
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
</style>
