<template>
  <basic-modal
    :is-shown="isShown"
    @update:is-shown="emit('update:is-shown', $event)"
    title="Become a Builder"
    :is-close-by-click-outside="!isSubmitting"
    :has-close-button="!isSubmitting"
  >
    <form @submit.prevent="submit" class="max-h-[80dvh] overflow-auto">
      <div class="mt-8 flex flex-col gap-5">
        <input-field
          v-model="form.name"
          :placeholder="$t('builder-form-modal.name-plh')"
          :note="$t('builder-form-modal.name-note')"
          :error-message="getFieldErrorMessage('name')"
          @blur="touchField('name')"
          :disabled="isSubmitting"
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
import { bus, BUS_EVENTS, ErrorHandler, getEthExplorerTxUrl } from '@/helpers'
import { reactive, ref } from 'vue'
import { useFormValidation, useI18n } from '@/composables'
import { required } from '@/validators'
import { config } from '@config'
import { GetBuildersProjectQuery } from '@/types/graphql'
import { parseUnits } from '@/utils'

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
  (e: 'builder-created', poolId: string): void
}>()

const { t } = useI18n()

const { networkId, provider, buildersContract } = storeToRefs(
  useWeb3ProvidersStore(),
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
  depositAmount: props.buildersProject?.minimalDeposit,
  lockPeriodAfterStake: props.buildersProject?.withdrawLockPeriodAfterDeposit,
  startAt: props.buildersProject?.startsAt,
  claimLockEndTime: +props.buildersProject?.claimLockEnd
    ? props.buildersProject?.claimLockEnd
    : '',
})

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, {
    name: { required },
    depositAmount: { required },
    lockPeriodAfterStake: { required },
    startAt: { required },
    claimLockEndTime: { required },
  })

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
    const tx =
      await buildersContract.value?.signerBased.value.createBuilderPool({
        name: form.name,
        admin: provider.value.selectedAddress,
        poolStart: +form.startAt * 1000,
        withdrawLockPeriodAfterDeposit: +form.lockPeriodAfterStake * 1000,
        claimLockEnd: +form.claimLockEndTime * 1000,
        minimalDeposit: parseUnits(form.depositAmount),
      })

    const txReceipt = await tx.wait()

    if (!txReceipt) throw new TypeError('Transaction is not defined')

    const explorerTxUrl = getEthExplorerTxUrl(
      config.networksMap[networkId.value].contractAddressesMap['builders'],
      txReceipt.transactionHash,
    )

    const BuilderPoolCreatedFilter =
      buildersContract.value?.signerBased.value.filters.BuilderPoolCreated()

    const events = await buildersContract.value?.signerBased.value.queryFilter(
      BuilderPoolCreatedFilter,
    )

    const lastEvent = events[events.length - 1]

    const poolId = lastEvent.args[0]

    bus.emit(
      BUS_EVENTS.success,
      t('builder-form-modal.creation-success-msg', { explorerTxUrl }),
    )

    clearForm()
    emit('builder-created', poolId)
  } catch (error) {
    ErrorHandler.process(error)
  }

  isSubmitting.value = false
}
</script>

<style scoped lang="scss"></style>
