<template>
  <form
    @submit.prevent="submit"
    class="mx-auto flex w-full max-w-[1030px] flex-col"
  >
    <div class="mx-auto mb-12 flex flex-col gap-6 text-center">
      <h2 class="typography-h1">
        {{
          !!buildersProject
            ? $t('builders-form.update-title')
            : $t('builders-form.create-title')
        }}
      </h2>

      <span class="typography-body3">
        {{ $t('builders-form.subtitle') }}
      </span>
    </div>

    <div class="flex flex-col gap-6">
      <app-gradient-border-card class="grid grid-cols-2 gap-6 p-10">
        <span class="col-span-2 mb-2 typography-h2">
          {{ $t('builders-form.section-1-title') }}
        </span>

        <input-field
          v-model="form.name"
          :placeholder="$t('builders-form.name-plh')"
          :note="$t('builders-form.name-note')"
          :error-message="getFieldErrorMessage('name')"
          @blur="touchField('name')"
          :disabled="isSubmitting || !!buildersProject"
        />
        <input-field
          v-model="form.address"
          :placeholder="$t('builders-form.address-plh')"
          :note="$t('builders-form.address-note')"
          :error-message="getFieldErrorMessage('address')"
          @blur="touchField('address')"
          :disabled="isSubmitting || !!buildersProject"
        />

        <input-field
          v-model="form.website"
          :placeholder="$t('builders-form.website-plh')"
          :note="$t('builders-form.website-note')"
          :error-message="getFieldErrorMessage('website')"
          @blur="touchField('website')"
          :disabled="isSubmitting || !!buildersProject"
        />

        <input-field
          v-model="form.imageUrl"
          :placeholder="$t('builders-form.image-url-plh')"
          :note="$t('builders-form.image-url-note')"
          :error-message="getFieldErrorMessage('imageUrl')"
          @blur="touchField('imageUrl')"
          :disabled="isSubmitting || !!buildersProject"
        />
      </app-gradient-border-card>

      <app-gradient-border-card class="grid grid-cols-2 gap-6 p-10">
        <span class="col-span-2 mb-2 typography-h2">
          {{ $t('builders-form.section-2-title') }}
        </span>

        <datetime-field
          v-model="form.startAt"
          :placeholder="$t('builders-form.start-at-plh')"
          :note="$t('builders-form.start-at-note')"
          :error-message="getFieldErrorMessage('startAt')"
          @blur="touchField('startAt')"
          :disabled="isSubmitting"
        />
        <input-field
          v-model="form.lockPeriodAfterStake"
          :placeholder="$t('builders-form.lock-period-after-stake-plh')"
          :note="$t('builders-form.lock-period-after-stake-note')"
          :error-message="getFieldErrorMessage('lockPeriodAfterStake')"
          @blur="touchField('lockPeriodAfterStake')"
          :disabled="isSubmitting"
          type="number"
        />
        <input-field
          v-model="form.depositAmount"
          :placeholder="$t('builders-form.min-deposit-plh')"
          :note="$t('builders-form.min-deposit-note')"
          :error-message="getFieldErrorMessage('depositAmount')"
          @blur="touchField('depositAmount')"
          :disabled="isSubmitting"
        />
        <datetime-field
          v-model="form.claimLockEndTime"
          :placeholder="$t('builders-form.claim-lock-end-plh')"
          :note="$t('builders-form.claim-lock-end-note')"
          :error-message="getFieldErrorMessage('claimLockEndTime')"
          @blur="touchField('claimLockEndTime')"
          :disabled="isSubmitting"
        />
      </app-gradient-border-card>

      <app-gradient-border-card class="grid grid-cols-2 gap-6 p-10">
        <span class="col-span-2 mb-2 typography-h2">
          {{ $t('builders-form.section-3-title') }}
        </span>

        <input-field
          v-model="form.emissionsFee"
          :placeholder="$t('builders-form.emissions-fee-plh')"
          :note="$t('builders-form.emissions-fee-note')"
          :error-message="getFieldErrorMessage('emissionsFee')"
          @blur="touchField('emissionsFee')"
          :disabled="isSubmitting"
        />
        <input-field
          v-model="form.treasuryFee"
          :placeholder="$t('builders-form.treasury-fee-plh')"
          :note="$t('builders-form.treasury-fee-note')"
          :error-message="getFieldErrorMessage('treasuryFee')"
          @blur="touchField('treasuryFee')"
          :disabled="isSubmitting"
        />
      </app-gradient-border-card>

      <app-gradient-border-card class="grid grid-cols-2 gap-6 p-10">
        <div class="col-span-2 flex gap-5">
          <span class="mb-2 text-textSecondaryMain typography-h2">
            {{ $t('builders-form.section-4-title') }}
          </span>
          <span
            class="col-span-2 mb-2 !font-light text-[#CCCCCC] typography-h2"
          >
            {{ $t('builders-form.optional-mark') }}
          </span>
        </div>

        <input-field
          class="col-span-2"
          v-model="form.slug"
          :placeholder="$t('builders-form.slug-plh')"
          :note="$t('builders-form.slug-note')"
          :error-message="getFieldErrorMessage('slug')"
          @blur="touchField('slug')"
          :disabled="isSubmitting || !!buildersProject"
        />
        <textarea-field
          class="col-span-2"
          v-model="form.description"
          :placeholder="$t('builders-form.description-plh')"
          :note="$t('builders-form.description-note')"
          :error-message="getFieldErrorMessage('description')"
          @blur="touchField('description')"
          :disabled="isSubmitting || !!buildersProject"
        />
      </app-gradient-border-card>
    </div>

    <div class="mt-10 flex items-center justify-center gap-4">
      <app-button scheme="filled" color="secondary" :disabled="isSubmitting">
        {{ $t('builders-form.cancel-btn') }}
      </app-button>
      <app-button type="submit" :disabled="!isFieldsValid || isSubmitting">
        {{ $t('builders-form.submit-btn') }}
      </app-button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { AppGradientBorderCard, AppButton } from '@/common'
import { GetBuildersProjectQuery } from '@/types/graphql'

import { InputField, DatetimeField, TextareaField } from '@/fields'
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
import { maxLength, minValue, required, validUrl } from '@/validators'
import { formatEther, parseUnits } from '@/utils'
import { helpers } from '@vuelidate/validators'
import { time } from '@distributedlab/tools'
import { DOT_TIME_FORMAT } from '@/const'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
  inheritAttrs: false,
})

const route = useRoute()
const router = useRouter()

const props = withDefaults(
  defineProps<{
    buildersProject?: GetBuildersProjectQuery['buildersProject']
  }>(),
  {
    buildersProject: null,
  },
)

const emit = defineEmits<{
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
  address: string
  website: string
  imageUrl: string

  startAt: string
  lockPeriodAfterStake: string
  depositAmount: string
  claimLockEndTime: string

  emissionsFee: string
  treasuryFee: string

  slug: string
  description: string
}>({
  name: props.buildersProject?.name ?? '',
  address: '',
  website: '',
  imageUrl: '',

  startAt: props.buildersProject?.startsAt ?? '',
  lockPeriodAfterStake:
    props.buildersProject?.withdrawLockPeriodAfterDeposit ?? '',
  depositAmount: formatEther(props.buildersProject?.minimalDeposit ?? 0),
  claimLockEndTime: +props.buildersProject?.claimLockEnd
    ? props.buildersProject?.claimLockEnd
    : '',

  emissionsFee: '',
  treasuryFee: '',

  slug: '',
  description: '',
})

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(
    form,
    computed(() => ({
      name: { required },
      address: { required },
      website: { validUrl },
      imageUrl: { validUrl },

      startAt: { required },
      lockPeriodAfterStake: {
        required,
        minValue: minValue(minimalWithdrawLockPeriod.value),
      },
      depositAmount: { required },
      claimLockEndTime: {
        required,
        minValue: helpers.withMessage(
          form.startAt
            ? t('builders-form.min-end-time-validation-err-msg', {
                time: time(+form.startAt).format(DOT_TIME_FORMAT),
              })
            : t('builders-form.min-end-time-validation-need-start-time-msg'),
          minValue(Number(form.startAt)),
        ),
      },

      emissionsFee: { required },
      treasuryFee: { required },

      slug: { maxLength: maxLength(120) },
      description: { maxLength: maxLength(800) },
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
      t('builders-form.confirm-success-msg', { explorerTxUrl }),
    )

    emit('submitted', poolId)
    clearForm()
  } catch (error) {
    ErrorHandler.process(error)
  }

  isSubmitting.value = false
}
</script>

<style lang="scss"></style>
