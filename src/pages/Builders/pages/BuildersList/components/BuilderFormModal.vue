<template>
  <basic-modal
    :is-shown="isShown"
    @update:is-shown="emit('update:is-shown', $event)"
    title="Become a Builder"
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
          :disabled="!isFieldsValid"
        >
          {{ $t('builder-form-modal.cancel-btn') }}
        </app-button>
        <app-button type="submit">
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
  createBuildersContract,
  ErrorHandler,
  getEthExplorerTxUrl,
} from '@/helpers'
import { computed, reactive, ref } from 'vue'
import { useFormValidation, useI18n } from '@/composables'
import { required } from '@/validators'
import { config } from '@config'
import { Provider } from '@/types'
import type { BigNumberish } from 'ethers'

withDefaults(
  defineProps<{
    isShown?: boolean
  }>(),
  {
    isShown: true,
  },
)

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

const { t } = useI18n()

const { networkId, provider } = storeToRefs(useWeb3ProvidersStore())

const isSubmitting = ref(false)

const form = reactive({
  name: '',
  depositAmount: '',
  lockPeriodAfterStake: '',
  startAt: '',
  claimLockEndTime: '',
})

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, {
    name: { required },
    depositAmount: { required },
    lockPeriodAfterStake: { required },
    startAt: { required },
    claimLockEndTime: { required },
  })

const buildersContract = computed(() => {
  if (!provider.value.rawProvider) return

  return createBuildersContract(
    config.networksMap[networkId.value].contractAddressesMap.builders,
    provider.value.rawProvider as unknown as Provider,
  )
})

const submit = async () => {
  if (!isFormValid()) return

  isSubmitting.value = true

  try {
    const tx = await buildersContract.value?.contractInstance.createBuilderPool(
      {
        name: '' as string,
        admin: '' as string,
        poolStart: '' as BigNumberish,
        withdrawLockPeriodAfterDeposit: '' as BigNumberish,
        claimLockEnd: '' as BigNumberish,
        minimalDeposit: '' as BigNumberish,
      },
    )

    if (!tx) throw new TypeError('Transaction is not defined')

    const explorerTxUrl = getEthExplorerTxUrl(
      config.networksMap[networkId.value].l1.explorerUrl,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.success,
      t('builder-form-modal.creation-success-msg', { explorerTxUrl }),
    )
  } catch (error) {
    ErrorHandler.process(error)
  }

  isSubmitting.value = false
}
</script>

<style scoped lang="scss"></style>
