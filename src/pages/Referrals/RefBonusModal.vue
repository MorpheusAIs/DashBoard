<template>
  <basic-modal
    class="ref-bonus-modal"
    :is-shown="isShown"
    :is-close-by-click-outside="isCloseByClickOutside"
    :title="$t('ref-bonus-modal.title')"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <div class="ref-bonus-modal__content-wrp">
      <div class="ref-bonus-modal__text-wrp">
        <i18n-t
          class="ref-bonus-modal__text"
          keypath="ref-bonus-modal.text-1"
          tag="p"
        >
          <template #reward>
            <span class="ref-bonus-modal__text ref-bonus-modal__text--bold">
              {{ calculatedReward }}
            </span>
          </template>
        </i18n-t>
        <p class="ref-bonus-modal__text">
          {{ $t('ref-bonus-modal.text-2') }}
        </p>
      </div>
      <input-field
        v-model="form.address"
        class="ref-bonus-modal__input-field"
        :placeholder="$t('ref-bonus-modal.input-placeholder')"
        :error-message="getFieldErrorMessage('address')"
        :disabled="isSubmitting"
        @blur="touchField('address')"
      />
      <div class="ref-bonus-modal__buttons-wrp">
        <app-button
          class="ref-bonus-modal__btn"
          color="secondary"
          :text="$t('ref-bonus-modal.cancel-button')"
          @click="closeModal"
        />
        <app-button
          class="ref-bonus-modal__btn"
          :text="$t('ref-bonus-modal.claim-button')"
          :disabled="isSubmitting || !isFieldsValid"
          @click="submit"
        />
      </div>
    </div>
  </basic-modal>
</template>

<script lang="ts" setup>
import { AppButton, BasicModal } from '@/common'
import { computed, reactive, ref } from 'vue'
import { config } from '@config'
import { InputField } from '@/fields'
import { useFormValidation, useI18n } from '@/composables'
import { address, required } from '@/validators'
import { useWeb3ProvidersStore } from '@/store'
import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  getEthExplorerTxUrl,
  roundNumber,
} from '@/helpers'
import { ethers } from 'ethers'
import { ERC1967Proxy } from '@/types'

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    isShown: boolean
    poolId: number
    currentReward?: ethers.BigNumber
    isCloseByClickOutside?: boolean
  }>(),
  {
    currentReward: ethers.BigNumber.from('0'),
    isCloseByClickOutside: true,
  },
)

const { t } = useI18n()

const web3ProvidersStore = useWeb3ProvidersStore()
const isSubmitting = ref(false)

const form = reactive({
  address: '',
})

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, {
    address: { required, address },
  })

const calculatedReward = computed(() => {
  const currentReward = props.currentReward
    ? roundNumber(ethers.utils.formatUnits(props.currentReward))
    : 0
  return `${currentReward} ${web3ProvidersStore.rewardsTokenSymbol}`
})

const submit = async (): Promise<void> => {
  if (!isFormValid()) return
  isSubmitting.value = true

  try {
    const fees =
      // eslint-disable-next-line max-len
      await web3ProvidersStore.endpointContract.providerBased.value.estimateFees(
        config.networksMap[web3ProvidersStore.networkId].l2.layerZeroEndpointId,
        // eslint-disable-next-line max-len
        await web3ProvidersStore.erc1967ProxyContract.providerBased.value.l1Sender(),
        '0x'.concat('00'.repeat(64)),
        false,
        '0x',
      )

    const tx = await (
      web3ProvidersStore.erc1967ProxyContract.signerBased.value as ERC1967Proxy
    ).claimReferrerTier(props.poolId, form.address, { value: fees.nativeFee })

    const explorerTxUrl = getEthExplorerTxUrl(
      config.networksMap[web3ProvidersStore.networkId].l1.explorerUrl,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.info,
      t('ref-bonus-modal.tx-sent-message', { explorerTxUrl }),
    )

    closeModal()

    await tx.wait()

    bus.emit(
      BUS_EVENTS.success,
      t('ref-bonus-modal.success-message', { explorerTxUrl }),
    )

    bus.emit(BUS_EVENTS.changedCurrentUserRefReward)
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
</script>

<style lang="scss" scoped>
.ref-bonus-modal__form {
  margin-top: toRem(24);

  @include respond-to(medium) {
    margin-top: toRem(28);
  }
}

.ref-bonus-modal__buttons-wrp {
  margin-top: toRem(40);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(16);

  @include respond-to(medium) {
    margin-top: toRem(36);
  }
}

.ref-bonus-modal__btn {
  min-width: toRem(200);

  @include respond-to(medium) {
    min-width: min-content;
    width: 100%;
  }
}

.ref-bonus-modal__text-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(16);
  max-width: toRem(506);
  margin: toRem(32) 0;
}

.ref-bonus-modal__text {
  text-align: center;
  font-size: toRem(22);
  line-height: toRem(33);

  &--bold {
    font-weight: 600;
  }
}
</style>
