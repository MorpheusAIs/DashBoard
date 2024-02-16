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
import { useContext, useContract, useFormValidation } from '@/composables'
import {
  ETHEREUM_EXPLORER_URLS,
  ETHEREUM_RPC_URLS,
  LAYER_ZERO_ENDPOINTS,
} from '@/enums'
import { InputField } from '@/fields'
import { getEthExplorerTxUrl, bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
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

const { $t } = useContext()

const { contractWithProvider: erc1967ProxyWithProvider } = useContract(
  'ERC1967Proxy__factory',
  config.ERC1967_PROXY_CONTRACT_ADDRESS,
  config.IS_MAINNET ? ETHEREUM_RPC_URLS.ethereum : ETHEREUM_RPC_URLS.sepolia,
)

const { contractWithSigner: erc1967ProxyWithSigner } = useContract(
  'ERC1967Proxy__factory',
  config.ERC1967_PROXY_CONTRACT_ADDRESS,
)

const { contractWithProvider: endpoint } = useContract(
  'Endpoint__factory',
  config.ENDPOINT_CONTRACT_ADDRESS,
  config.IS_MAINNET ? ETHEREUM_RPC_URLS.ethereum : ETHEREUM_RPC_URLS.sepolia,
)

const submit = async (): Promise<void> => {
  if (!isFormValid()) return
  isSubmitting.value = true

  try {
    const fees = await endpoint.value.estimateFees(
      config.IS_MAINNET
        ? LAYER_ZERO_ENDPOINTS.arbitrum
        : LAYER_ZERO_ENDPOINTS.arbitrumSepolia,
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
      config.IS_MAINNET
        ? ETHEREUM_EXPLORER_URLS.ethereum
        : ETHEREUM_EXPLORER_URLS.sepolia,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.info,
      $t('claim-form.tx-sent-message', { explorerTxUrl }),
    )

    emit('tx-sent')

    await tx.wait()

    bus.emit(
      BUS_EVENTS.success,
      $t('claim-form.success-message', { explorerTxUrl }),
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
