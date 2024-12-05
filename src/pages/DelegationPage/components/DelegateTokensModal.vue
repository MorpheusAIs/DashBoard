<template>
  <basic-modal
    class="delegate-tokens-modal"
    :is-shown="isShown"
    :is-close-by-click-outside="isCloseByClickOutside"
    :title="$t('delegate-tokens-modal.title')"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <div class="delegate-tokens-modal__content-wrp">
      <div class="delegate-tokens-modal__available-wrp">
        <p class="delegate-tokens-modal__available-text">
          {{ $t('delegate-tokens-modal.delegate-text') }}
        </p>
        <p class="delegate-tokens-modal__available-amount">
          {{ `${MOCKED_MOR_AMOUNT} ${web3ProvidersStore.rewardsTokenSymbol}` }}
        </p>
      </div>
      <div class="delegate-tokens-modal__inputs-wrp">
        <input-field
          v-model="form.address"
          class="delegate-tokens-modal__input-field"
          :placeholder="$t('delegate-tokens-modal.wallet-input-placeholder')"
          :error-message="getFieldErrorMessage('address')"
          :disabled="isSubmitting || Boolean(delegateAddress)"
          @blur="touchField('address')"
        />
        <input-field
          v-model="form.amount"
          class="delegate-tokens-modal__input-field"
          :placeholder="
            $t('delegate-tokens-modal.mor-input-placeholder', {
              asset: web3ProvidersStore.rewardsTokenSymbol,
            })
          "
          :error-message="getFieldErrorMessage('amount')"
          :disabled="isSubmitting"
          @blur="touchField('amount')"
        >
          <template #nodeRight>
            <app-button
              class="delegate-tokens-modal__input-field-btn"
              scheme="link"
              text="max"
              :disabled="isSubmitting || !Number(depositTokenBalance)"
              @click="inputMaxTokensAmount"
            />
          </template>
        </input-field>
        <select-field
          v-model="form.delegationRights"
          class="delegate-tokens-modal__input-field"
          :value-options="delegationOptions"
          :placeholder="$t('delegate-tokens-modal.rights-input-placeholder')"
          :error-message="getFieldErrorMessage('delegationRights')"
          :disabled="isSubmitting"
          @blur="touchField('delegationRights')"
        />
      </div>
      <div class="delegate-tokens-modal__buttons-wrp">
        <app-button
          class="delegate-tokens-modal__btn"
          color="secondary"
          :text="$t('delegate-tokens-modal.cancel-button')"
          @click="closeModal"
        />
        <app-button
          class="delegate-tokens-modal__btn"
          :text="$t('delegate-tokens-modal.confirm-button')"
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
import { InputField, SelectField } from '@/fields'
import { useFormValidation, useI18n } from '@/composables'
import { address, required, minEther, maxEther } from '@/validators'
import { useWeb3ProvidersStore } from '@/store'
import { bus, BUS_EVENTS, ErrorHandler, getEthExplorerTxUrl } from '@/helpers'
import { DELEGATION_RIGHTS } from '@/enums'

const MIN_DELEGATION_AMOUNT = 0.000001
const MOCKED_MOR_AMOUNT = 100

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    isShown: boolean
    delegateAddress?: string
    isCloseByClickOutside?: boolean
  }>(),
  {
    delegateAddress: '',
    isCloseByClickOutside: true,
  },
)

const { t } = useI18n()

const web3ProvidersStore = useWeb3ProvidersStore()

const isSubmitting = ref(false)
const depositTokenBalance = ref('0')

const form = reactive({
  address: '',
  amount: '',
  delegationRights: DELEGATION_RIGHTS,
})

const validationRules = computed(() => ({
  address: { required, address },
  amount: {
    minEther: minEther(MIN_DELEGATION_AMOUNT),
    maxEther: maxEther(depositTokenBalance.value),
  },
  delegationRights: {
    required,
  },
}))

const delegationOptions = computed(() => [
  {
    title: t('delegate-tokens-modal.full-rights-lbl'),
    value: DELEGATION_RIGHTS.fullRights,
  },
  {
    title: t('delegate-tokens-modal.provider-rights-lbl'),
    value: DELEGATION_RIGHTS.providerRights,
  },
  {
    title: t('delegate-tokens-modal.model-rights-lbl'),
    value: DELEGATION_RIGHTS.modelRights,
  },
  {
    title: t('delegate-tokens-modal.session-rights-lbl'),
    value: DELEGATION_RIGHTS.sessionRights,
  },
  {
    title: t('delegate-tokens-modal.marketplace-rights-lbl'),
    value: DELEGATION_RIGHTS.marketplaceRights,
  },
])

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, validationRules)

const submit = async (): Promise<void> => {
  if (!isFormValid()) return
  isSubmitting.value = true

  try {
    // TODO: ADD FUNCTIONALITY
    // const tx = await

    const explorerTxUrl = getEthExplorerTxUrl(
      config.networksMap[web3ProvidersStore.networkId].l1.explorerUrl,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.info,
      t('delegate-tokens-modal.tx-sent-message', { explorerTxUrl }),
    )

    closeModal()

    // TODO: ADD FUNCTIONALITY
    // await tx.wait()

    bus.emit(
      BUS_EVENTS.success,
      t('delegate-tokens-modal.success-message', { explorerTxUrl }),
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
  form.delegationRights = DELEGATION_RIGHTS.fullRights
  form.amount = ''
  depositTokenBalance.value = '0'
}

const inputMaxTokensAmount = () => {
  form.amount = depositTokenBalance.value
}

const init = async () => {
  const amount =
    await web3ProvidersStore.rewardsContract.providerBased.value.balanceOf(
      web3ProvidersStore.address,
    )
  depositTokenBalance.value = amount.toString()
  if (props.delegateAddress) {
    form.address = props.delegateAddress
  }
}

init()
</script>

<style lang="scss" scoped>
.delegate-tokens-modal__buttons-wrp {
  margin-top: toRem(40);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(16);

  @include respond-to(medium) {
    margin-top: toRem(36);
  }
}

.delegate-tokens-modal__btn {
  min-width: toRem(200);

  @include respond-to(medium) {
    min-width: min-content;
    width: 100%;
  }
}

.deposit-form__input-field-btn {
  @include body-3-semi-bold;
}

.delegate-tokens-modal__available-wrp {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: toRem(32) 0;
}

.delegate-tokens-modal__available-amount {
  font-weight: 700;
}

.delegate-tokens-modal__inputs-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}
</style>
