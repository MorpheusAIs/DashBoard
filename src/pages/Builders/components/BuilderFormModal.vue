<template>
  <basic-modal
    class="builder-form-modal"
    :is-shown="isShown"
    @update:is-shown="emit('update:is-shown', $event)"
    :title="
      buildersProject
        ? $t('builder-form-modal.update-title', {
            name: buildersProject.name,
          })
        : $t('builder-form-modal.create-title')
    "
    :is-close-by-click-outside="!isSubmitting"
    :has-close-button="!isSubmitting"
  >
    <form @submit.prevent="submit" class="max-h-[80dvh] overflow-auto px-10">
      <div class="mt-8 flex flex-col gap-5">
        <input-field
          v-model="form.name"
          :placeholder="$t('builder-form-modal.name-plh')"
          :note="$t('builder-form-modal.name-note')"
          :error-message="getFieldErrorMessage('name')"
          @blur="touchField('name')"
          :disabled="isSubmitting || !!buildersProject"
        />
        <input-field
          v-model="form.depositAmount"
          :placeholder="$t('builder-form-modal.min-deposit-plh')"
          :note="$t('builder-form-modal.min-deposit-note')"
          :error-message="getFieldErrorMessage('depositAmount')"
          @blur="touchField('depositAmount')"
          :disabled="isSubmitting"
        />
        <input-field
          v-model="form.lockPeriodAfterStake"
          :placeholder="$t('builder-form-modal.lock-period-after-stake-plh')"
          :note="$t('builder-form-modal.lock-period-after-stake-note')"
          :error-message="getFieldErrorMessage('lockPeriodAfterStake')"
          @blur="touchField('lockPeriodAfterStake')"
          :disabled="isSubmitting"
          :min="minimalWithdrawLockPeriod"
          type="number"
        />
        <datetime-field
          v-model="form.startAt"
          :placeholder="$t('builder-form-modal.start-at-plh')"
          :note="$t('builder-form-modal.start-at-note')"
          :error-message="getFieldErrorMessage('startAt')"
          @blur="touchField('startAt')"
          :disabled="isSubmitting"
        />
        <datetime-field
          v-model="form.claimLockEndTime"
          :placeholder="$t('builder-form-modal.claim-lock-end-plh')"
          :note="$t('builder-form-modal.claim-lock-end-note')"
          :error-message="getFieldErrorMessage('claimLockEndTime')"
          @blur="touchField('claimLockEndTime')"
          :disabled="isSubmitting"
        />
      </div>

      <div class="mt-10 flex items-center justify-center gap-4">
        <app-button
          scheme="filled"
          color="secondary"
          @click="emit('update:is-shown', false)"
          :disabled="isSubmitting"
        >
          {{ $t('builder-form-modal.cancel-btn') }}
        </app-button>
        <app-button type="submit" :disabled="!isFieldsValid || isSubmitting">
          {{ $t('builder-form-modal.submit-btn') }}
        </app-button>
      </div>
    </form>
  </basic-modal>
</template>

<script setup lang="ts">
import { AppButton, BasicModal } from '@/common'
import { InputField, DatetimeField } from '@/fields'
import { storeToRefs, useWeb3ProvidersStore } from '@/store'
import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  getEthExplorerTxUrl,
  sleep,
} from '@/helpers'
import { computed, reactive, ref } from 'vue'
import { useFormValidation, useI18n, useLoad } from '@/composables'
import { minValue, required } from '@/validators'
import { GetBuildersProjectQuery } from '@/types/graphql'
import { formatEther, parseUnits } from '@/utils'
import { helpers } from '@vuelidate/validators'
import { time } from '@distributedlab/tools'
import { DOT_TIME_FORMAT } from '@/const'

const props = withDefaults(
  defineProps<{
    isShown?: boolean
    buildersProject?: GetBuildersProjectQuery['buildersProject']
  }>(),
  {
    isShown: true,
    buildersProject: null,
  },
)

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
  (e: 'submitted', poolId: string): void
}>()

const { t } = useI18n()

const { provider, buildersContract, buildersContractDetails } = storeToRefs(
  useWeb3ProvidersStore(),
)

const { data: minimalWithdrawLockPeriod } = useLoad(
  0,
  async () => {
    return (
      await buildersContract.value.providerBased.value.minimalWithdrawLockPeriod()
    ).toNumber()
  },
  {},
)

const isSubmitting = ref(false)

const form = reactive<{
  name: string
  depositAmount: string
  lockPeriodAfterStake: string
  startAt: string
  claimLockEndTime: string
}>({
  name: props.buildersProject?.name ?? '',
  depositAmount: formatEther(props.buildersProject?.minimalDeposit ?? 0),
  lockPeriodAfterStake: props.buildersProject?.withdrawLockPeriodAfterDeposit,
  startAt: props.buildersProject?.startsAt,
  claimLockEndTime: +props.buildersProject?.claimLockEnd
    ? props.buildersProject?.claimLockEnd
    : '',
})

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(
    form,
    computed(() => ({
      name: { required },
      depositAmount: { required },
      lockPeriodAfterStake: {
        required,
      },
      startAt: { required },
      claimLockEndTime: {
        required,
        minValue: helpers.withMessage(
          t('builder-form-modal.min-end-time-validation-err-msg', {
            time: time(+form.startAt).format(DOT_TIME_FORMAT),
          }),
          minValue(Number(form.startAt)),
        ),
      },
    })),
  )

const clearForm = () => {
  form.name = ''
  form.depositAmount = ''
  form.lockPeriodAfterStake = ''
  form.startAt = ''
  form.claimLockEndTime = ''
}

const submit = async () => {
  if (!isFormValid()) return

  isSubmitting.value = true

  try {
    if (
      provider.value.chainId !== buildersContractDetails.value.targetChainId
    ) {
      provider.value.selectChain(buildersContractDetails.value.targetChainId)
      await sleep(1_000)
    }

    const tx = props.buildersProject
      ? await buildersContract.value?.signerBased.value.editBuilderPool({
          name: form.name,
          admin: provider.value.selectedAddress,
          poolStart: +form.startAt,
          withdrawLockPeriodAfterDeposit: +form.lockPeriodAfterStake,
          claimLockEnd: +form.claimLockEndTime,
          minimalDeposit: parseUnits(form.depositAmount),
        })
      : await buildersContract.value?.signerBased.value.createBuilderPool({
          name: form.name,
          admin: provider.value.selectedAddress,
          poolStart: +form.startAt,
          withdrawLockPeriodAfterDeposit: +form.lockPeriodAfterStake,
          claimLockEnd: +form.claimLockEndTime,
          minimalDeposit: parseUnits(form.depositAmount),
        })

    const txReceipt = await tx.wait()

    if (!txReceipt) throw new TypeError('Transaction is not defined')

    const explorerTxUrl = getEthExplorerTxUrl(
      buildersContractDetails.value.explorerUrl,
      txReceipt.transactionHash,
    )

    const poolId = await buildersContract.value?.signerBased.value.getPoolId(
      form.name,
    )

    await sleep(2000)

    bus.emit(
      BUS_EVENTS.success,
      t('builder-form-modal.confirm-success-msg', { explorerTxUrl }),
    )

    emit('submitted', poolId)
    clearForm()
  } catch (error) {
    ErrorHandler.process(error)
  }

  isSubmitting.value = false
}
</script>

<style lang="scss">
.builder-form-modal {
  .basic-modal__pane {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
