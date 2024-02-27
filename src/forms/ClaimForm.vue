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
import { useContract, useFormValidation, useI18n } from '@/composables'
import { InputField } from '@/fields'
import { getEthExplorerTxUrl, bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { address, required } from '@/validators'
import { config } from '@config'
import { computed, reactive, ref } from 'vue'

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
const web3ProvidersStore = useWeb3ProvidersStore()

const {
  contractWithProvider: erc1967ProxyWithProvider,
  contractWithSigner: erc1967ProxyWithSigner,
} = useContract(
  'ERC1967Proxy__factory',
  computed(() => web3ProvidersStore.contractAddressesMap.erc1967Proxy),
)

const { contractWithProvider: endpoint } = useContract(
  'Endpoint__factory',
  computed(() => web3ProvidersStore.contractAddressesMap.endpoint),
)

const submit = async (): Promise<void> => {
  if (!isFormValid()) return
  isSubmitting.value = true

  try {
    const fees = await endpoint.value.estimateFees(
      config.networks[web3ProvidersStore.networkId]
        .extendedChainLayerZeroEndpoint,
      await erc1967ProxyWithProvider.value.l1Sender(),
      '0x'.concat('00'.repeat(64)),
      false,
      '0x',
    )

    const tx = await erc1967ProxyWithSigner.value.claim(
      props.poolId,
      form.address,
      { value: fees.nativeFee },
    )

    const explorerTxUrl = getEthExplorerTxUrl(
      config.networks[web3ProvidersStore.networkId].explorerUrl,
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
