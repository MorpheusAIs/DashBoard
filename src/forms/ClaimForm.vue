<template>
  <form class="claim-form" @submit.prevent>
    <input-field
      v-model="form.address"
      class="claim-form__input-field"
      :placeholder="$t('claim-form.address-placeholder')"
      :error-message="getFieldErrorMessage('address')"
      :disabled="isSubmitting"
      @blur="touchField('address')"
    />
    <div class="claim-form__buttons-wrp">
      <app-button
        class="claim-form__btn"
        color="secondary"
        :text="$t('claim-form.cancel-btn')"
        @click="emit('cancel')"
      />
      <app-button
        class="claim-form__btn"
        :text="$t('claim-form.submit-btn')"
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
import { storeToRefs, useWeb3ProvidersStore } from '@/store'
import { address, required } from '@/validators'
import { config } from '@config'
import { reactive, ref } from 'vue'

const emit = defineEmits<{
  (e: 'cancel', v: void): void
  (e: 'tx-sent', v: void): void
}>()

const props = defineProps<{
  poolId: number
}>()

const isSubmitting = ref(false)

const form = reactive({
  address: '',
})

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, {
    address: { required, address },
  })

const { t } = useI18n()

const { endpointContract, erc1967ProxyContract, networkId, provider } =
  storeToRefs(useWeb3ProvidersStore())

const submit = async (): Promise<void> => {
  if (!isFormValid()) return
  isSubmitting.value = true

  try {
    await provider.value.selectChain(
      config.networksMap[networkId.value].l1.chainId,
    )

    const fees = await endpointContract.value.providerBased.value.estimateFees(
      config.networksMap[networkId.value].l2.layerZeroEndpointId,
      await erc1967ProxyContract.value.providerBased.value.l1Sender(),
      '0x'.concat('00'.repeat(64)),
      false,
      '0x',
    )

    const tx = await erc1967ProxyContract.value.signerBased.value.claim(
      props.poolId,
      form.address,
      { value: fees.nativeFee },
    )

    const explorerTxUrl = getEthExplorerTxUrl(
      config.networksMap[networkId.value].l1.explorerUrl,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.info,
      t('claim-form.tx-sent-message', { explorerTxUrl }),
    )

    emit('tx-sent')

    await tx.wait()

    bus.emit(
      BUS_EVENTS.success,
      t('claim-form.success-message', { explorerTxUrl }),
    )

    bus.emit(BUS_EVENTS.changedCurrentUserReward)
  } catch (error) {
    ErrorHandler.process(error)
  }

  isSubmitting.value = false
}
</script>

<style lang="scss" scoped>
.claim-form__buttons-wrp {
  margin-top: toRem(40);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(16);

  @include respond-to(medium) {
    margin-top: toRem(36);
  }
}

.claim-form .claim-form__btn {
  min-width: toRem(200);

  @include respond-to(medium) {
    min-width: min-content;
    width: 100%;
  }
}
</style>
