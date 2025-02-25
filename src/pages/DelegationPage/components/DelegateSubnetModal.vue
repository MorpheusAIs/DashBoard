<template>
  <basic-modal
    class="delegate-subnet-modal"
    :is-shown="isShown"
    :is-close-by-click-outside="isCloseByClickOutside"
    :title="$t('delegate-subnet-modal.title')"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <div class="delegate-subnet-modal__content-wrp">
      <div class="delegate-subnet-modal__inputs-wrp">
        <input-field
          v-model="form.name"
          class="delegate-subnet-modal__input-field"
          :placeholder="$t('delegate-subnet-modal.name-placeholder')"
          :error-message="getFieldErrorMessage('name')"
          :disabled="isSubmitting"
          @blur="touchField('name')"
        />
        <input-field
          v-model="form.link"
          class="delegate-subnet-modal__input-field"
          :placeholder="$t('delegate-subnet-modal.link-placeholder')"
          :error-message="getFieldErrorMessage('link')"
          :disabled="isSubmitting"
          @blur="touchField('link')"
        />
        <input-field
          v-model="form.fee"
          class="delegate-subnet-modal__input-field"
          :placeholder="$t('delegate-subnet-modal.fee-placeholder')"
          :note="$t('delegate-subnet-modal.fee-note')"
          :error-message="getFieldErrorMessage('fee')"
          :disabled="isSubmitting"
          @blur="touchField('fee')"
        />
        <input-field
          v-model="form.address"
          class="delegate-subnet-modal__input-field"
          :placeholder="$t('delegate-subnet-modal.address-placeholder')"
          :error-message="getFieldErrorMessage('address')"
          :disabled="isSubmitting"
          @blur="touchField('address')"
        />
        <datetime-field
          v-model="form.deregistrationDate"
          class="delegate-subnet-modal__input-field"
          position="top"
          :placeholder="
            $t('delegate-subnet-modal.deregistration-date-placeholder')
          "
          :error-message="getFieldErrorMessage('deregistrationDate')"
          :disabled="isSubmitting"
          @blur="touchField('deregistrationDate')"
        />
      </div>
      <div class="delegate-subnet-modal__buttons-wrp">
        <app-button
          class="delegate-subnet-modal__btn"
          color="secondary"
          :text="$t('delegate-subnet-modal.cancel-button')"
          @click="closeModal"
        />
        <app-button
          class="delegate-subnet-modal__btn"
          :text="$t('delegate-subnet-modal.confirm-button')"
          :disabled="isSubmitting || !isFieldsValid"
          @click="submit"
        />
      </div>
    </div>
  </basic-modal>
</template>

<script lang="ts" setup>
import { AppButton, BasicModal } from '@/common'
import { InputField, DatetimeField } from '@/fields'

import { computed, reactive, ref } from 'vue'
import { useFormValidation, useI18n } from '@/composables'
import { address, required, maxValue, minValue } from '@/validators'
import { useWeb3ProvidersStore } from '@/store'
import { bus, BUS_EVENTS, ErrorHandler, getEthExplorerTxUrl } from '@/helpers'
import { BigNumber } from '@/utils'

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    isShown: boolean
    isCloseByClickOutside?: boolean
    delegateAddress?: string
  }>(),
  {
    isCloseByClickOutside: true,
    delegateAddress: '',
  },
)

const { t } = useI18n()

const web3ProvidersStore = useWeb3ProvidersStore()

const isSubmitting = ref(false)

const form = reactive({
  name: '',
  link: '',
  fee: '',
  address: '',
  deregistrationDate: '',
})

const validationRules = computed(() => ({
  name: { required },
  link: { required },
  fee: { required, minValue: minValue(0), maxValue: maxValue(100) },
  address: { required, address },
  deregistrationDate: {
    required,
    minValue: minValue(new Date().getTime() / 1000),
  },
}))

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, validationRules)

const submit = async (): Promise<void> => {
  if (!isFormValid()) return
  isSubmitting.value = true

  try {
    await web3ProvidersStore.provider.selectChain(
      web3ProvidersStore.subnetFactoryContractDetails.targetChainId,
    )

    /* eslint-disable */
    const tx =
      await web3ProvidersStore.subnetFactoryContract.signerBased.value.deployProxy(
        form.address,
        BigNumber.from(form.fee).mul(BigNumber.from(10).pow(23)).toString(),
        form.name,
        form.link,
        form.deregistrationDate,
      )

    /* eslint-enable */

    const explorerTxUrl = getEthExplorerTxUrl(
      web3ProvidersStore.subnetFactoryContractDetails.explorerUrl,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.info,
      t('delegate-subnet-modal.tx-sent-message', { explorerTxUrl }),
    )

    closeModal()

    await tx.wait()

    bus.emit(
      BUS_EVENTS.success,
      t('delegate-subnet-modal.success-message', { explorerTxUrl }),
    )

    bus.emit(BUS_EVENTS.changedDelegation)
  } catch (error) {
    ErrorHandler.process(error)
  }

  isSubmitting.value = false
}

const closeModal = (): void => {
  clearFields()
  emit('update:is-shown', false)
}

const clearFields = () => {
  form.address = ''
}

const init = () => {
  if (props.delegateAddress) {
    form.address = props.delegateAddress
  }

  form.address = web3ProvidersStore.address
}

init()
</script>

<style lang="scss" scoped>
.delegate-subnet-modal__buttons-wrp {
  margin-top: toRem(40);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(16);

  @include respond-to(medium) {
    margin-top: toRem(36);
  }
}

.delegate-subnet-modal__btn {
  min-width: toRem(200);

  @include respond-to(medium) {
    min-width: min-content;
    width: 100%;
  }
}

.deposit-form__input-field-btn {
  @include body-3-semi-bold;
}

.delegate-subnet-modal__available-wrp {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: toRem(32) 0;
}

.delegate-subnet-modal__available-amount {
  font-weight: 700;
}

.delegate-subnet-modal__inputs-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  margin-top: toRem(40);
}
</style>
