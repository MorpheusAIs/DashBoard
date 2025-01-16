<template>
  <form class="withdraw-form" @submit.prevent>
    <input-field
      v-model="form.amount"
      class="withdraw-form__input-field"
      :placeholder="$t('withdraw-form.amount-placeholder')"
      :error-message="getFieldErrorMessage('amount')"
      :disabled="isSubmitting"
      @blur="touchField('amount')"
    >
      <template #nodeRight>
        <app-button
          class="withdraw-form__input-field-btn"
          scheme="link"
          text="max"
          :disabled="isSubmitting"
          @click="form.amount = availableEther"
        />
      </template>
    </input-field>
    <div class="withdraw-form__buttons-wrp">
      <app-button
        class="withdraw-form__btn"
        color="secondary"
        :text="$t('withdraw-form.cancel-btn')"
        @click="cancel"
      />
      <app-button
        class="withdraw-form__btn"
        :text="$t('withdraw-form.submit-btn')"
        :disabled="isSubmitting || !isFieldsValid"
        @click="submit"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { useFormValidation, useI18n } from '@/composables'
import { InputField } from '@/fields'
import { getEthExplorerTxUrl, bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { BigNumber, parseUnits, toEther } from '@/utils'
import { ether, maxEther, required } from '@/validators'
import { computed, reactive, ref } from 'vue'

const emit = defineEmits<{
  (e: 'cancel', v: void): void
  (e: 'tx-sent', v: void): void
}>()

const props = defineProps<{
  poolId: number
  availableAmount: BigNumber
}>()

const isSubmitting = ref(false)

const form = reactive({
  amount: '' as string,
})

const { t } = useI18n()
const web3ProvidersStore = useWeb3ProvidersStore()

const availableEther = computed<string>(() => toEther(props.availableAmount))

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, {
    amount: { required, ether, maxEther: maxEther(availableEther.value) },
  })

const submit = async (): Promise<void> => {
  if (!isFormValid()) return
  isSubmitting.value = true

  try {
    await web3ProvidersStore.provider.selectChain(
      web3ProvidersStore.erc1967ProxyContractDetails.targetChainId,
    )

    const tx =
      await web3ProvidersStore.erc1967ProxyContract.signerBased.value.withdraw(
        props.poolId,
        parseUnits(form.amount, 'ether'),
      )

    const explorerTxUrl = getEthExplorerTxUrl(
      web3ProvidersStore.erc1967ProxyContractDetails.explorerUrl,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.info,
      t('withdraw-form.tx-sent-message', { explorerTxUrl }),
    )

    emit('tx-sent')
    clearFields()

    await tx.wait()

    bus.emit(
      BUS_EVENTS.success,
      t('withdraw-form.success-message', { explorerTxUrl }),
    )

    bus.emit(BUS_EVENTS.changedPoolData)
  } catch (error) {
    ErrorHandler.process(error)
  }

  isSubmitting.value = false
}

const cancel = () => {
  clearFields()
  emit('cancel')
}

const clearFields = () => {
  form.amount = ''
}
</script>

<style lang="scss" scoped>
.withdraw-form .withdraw-form__input-field {
  margin-top: toRem(40);

  @include respond-to(medium) {
    margin-top: toRem(20);
  }
}

.withdraw-form .withdraw-form__input-field-btn {
  @include body-3-semi-bold;
}

.withdraw-form__buttons-wrp {
  margin-top: toRem(40);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(16);

  @include respond-to(medium) {
    margin-top: toRem(36);
  }
}

.withdraw-form .withdraw-form__btn {
  min-width: toRem(200);

  @include respond-to(medium) {
    min-width: min-content;
    width: 100%;
  }
}
</style>
