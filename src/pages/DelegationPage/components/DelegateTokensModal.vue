<template>
  <basic-modal
    class="delegate-tokens-modal"
    :is-shown="isShown"
    :is-close-by-click-outside="isCloseByClickOutside"
    :title="$t('delegate-tokens-modal.title')"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <div class="delegate-tokens-modal__content-wrp">
      <div class="delegate-tokens-modal__inputs-wrp">
        <input-field
          v-model="form.address"
          class="delegate-tokens-modal__input-field"
          :placeholder="$t('delegate-tokens-modal.wallet-input-placeholder')"
          :error-message="formValidationData.getFieldErrorMessage('address')"
          :disabled="isSubmitting || Boolean(delegateAddress)"
          @blur="addressBlur"
        />
        <input-field
          v-model="form.amount"
          class="delegate-tokens-modal__input-field"
          :placeholder="
            $t('delegate-tokens-modal.mor-input-placeholder', {
              asset: web3ProvidersStore.rewardsTokenSymbol,
            })
          "
          :error-message="formValidationData.getFieldErrorMessage('amount')"
          :disabled="isSubmitting"
          @blur="formValidationData.touchField('amount')"
        >
          <template #nodeRight>
            <app-button
              class="delegate-tokens-modal__input-field-btn"
              scheme="link"
              text="max"
              :disabled="isSubmitting || !Number(rewardsTokenBalance)"
              @click="inputMaxTokensAmount"
            />
          </template>
        </input-field>
      </div>

      <div class="delegate-tokens-modal__available-wrp">
        <p class="delegate-tokens-modal__available-text">
          {{ $t('delegate-tokens-modal.delegate-text') }}
          <span class="delegate-tokens-modal__available-amount">
            {{
              `${rewardsTokenBalance} ${web3ProvidersStore.rewardsTokenSymbol}`
            }}
          </span>
        </p>
      </div>

      <div class="delegate-tokens-modal__info-wrp">
        <p class="delegate-tokens-modal__info-text">
          {{ $t('delegate-tokens-modal.description-1') }}
          <span
            v-if="!!deregistrationDateShown"
            class="delegate-tokens-modal__info-text"
          >
            {{
              $t('delegate-tokens-modal.description-2', {
                date: deregistrationDateShown,
              })
            }}
          </span>
        </p>
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
          :disabled="isSubmitting || !formValidationData.isFieldsValid"
          @click="submit"
        />
      </div>
    </div>
  </basic-modal>
</template>

<script lang="ts" setup>
import { AppButton, BasicModal } from '@/common'
import { InputField } from '@/fields'

import { computed, reactive, ref, watch } from 'vue'
import { useContract, useFormValidation, useI18n } from '@/composables'
import { address, required, minEther, maxEther } from '@/validators'
import { useWeb3ProvidersStore } from '@/store'
import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  fetchSubnet,
  getEthExplorerTxUrl,
  trimStringNumber,
} from '@/helpers'
import { parseUnits } from '@/utils'
import { BN, Time } from '@distributedlab/tools'
import { useSecondApolloClient } from '@/composables/use-second-apollo-client'

const MIN_DELEGATION_AMOUNT = '0.000001'

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    isShown: boolean
    delegateAddress?: string
    isCloseByClickOutside?: boolean
    deregistrationDate?: string | null
  }>(),
  {
    delegateAddress: '',
    isCloseByClickOutside: true,
    deregistrationDate: null,
  },
)

const { t } = useI18n()

const web3ProvidersStore = useWeb3ProvidersStore()

const isSubmitting = ref(false)
const deregistrationDateLocal = ref<number | null>(null)
const formValidationData = ref<ReturnType<typeof useFormValidation>>({
  isFormValid: () => false,
  // eslint-disable-next-line
  // @ts-ignore
  isFieldsValid: false,
  getFieldErrorMessage: () => '',
  touchField: () => {
    return
  },
  resetValidation: () => {
    return
  },
})

const { client: apolloClient } = useSecondApolloClient()

const form = reactive({
  address: '',
  amount: '',
})

const rewardsTokenBalance = computed(() =>
  trimStringNumber(
    BN.fromRaw(web3ProvidersStore.balances.rewardsToken?.toString() || '0')
      .div(BN.fromRaw(10).pow(18))
      .toString(),
  ),
)

const validationRules = computed(() => ({
  address: { required, address },
  amount: {
    minEther: minEther(parseUnits(MIN_DELEGATION_AMOUNT, 'ether')),
    maxEther: maxEther(rewardsTokenBalance.value),
  },
}))

const date = computed(() =>
  Number(props.deregistrationDate || deregistrationDateLocal.value),
)

const isDeregistrationDateShown = computed(
  () => date.value && new Time(date.value).timestamp > new Time().timestamp,
)

const deregistrationDateShown = computed(() => {
  if (!isDeregistrationDateShown.value) return ''

  return new Time(date.value).format('MMM D, YYYY')
})

formValidationData.value = useFormValidation(form, validationRules)

const submit = async (): Promise<void> => {
  if (!formValidationData.value.isFormValid()) return
  isSubmitting.value = true

  try {
    await web3ProvidersStore.provider.selectChain(
      web3ProvidersStore.rewardsContractDetails.targetChainId,
    )

    const subnetContract = useContract(
      'Subnet__factory',
      form.address as string,
      web3ProvidersStore.wrappedEthProvider,
    )

    const allowance =
      await web3ProvidersStore.rewardsContract.signerBased.value.allowance(
        web3ProvidersStore.address,
        form.address,
      )

    if (allowance.lt(parseUnits(rewardsTokenBalance.value, 'ether'))) {
      const contract = web3ProvidersStore.rewardsContract.signerBased.value

      const allowanceTx = await contract.increaseAllowance(
        form.address,
        parseUnits(rewardsTokenBalance.value, 'ether'),
      )

      await allowanceTx.wait()
    }

    const tx = await subnetContract.signerBased.value.stake(
      parseUnits(form.amount, 'ether'),
    )

    const explorerTxUrl = getEthExplorerTxUrl(
      web3ProvidersStore.rewardsContractDetails.explorerUrl,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.info,
      t('delegate-tokens-modal.tx-sent-message', { explorerTxUrl }),
    )

    closeModal()

    await tx.wait()

    bus.emit(
      BUS_EVENTS.success,
      t('delegate-tokens-modal.success-message', { explorerTxUrl }),
    )

    bus.emit(BUS_EVENTS.changedDelegation)
  } catch (error) {
    ErrorHandler.process(error)
  }

  isSubmitting.value = false
}

const addressBlur = async () => {
  formValidationData.value.touchField('address')

  if (!formValidationData.value.getFieldErrorMessage('address')) {
    const data = await fetchSubnet(apolloClient.value, form.address)

    deregistrationDateLocal.value = Number(
      data.subnets[0].deregistrationOpensAt,
    )
  }
}

const closeModal = (): void => {
  clearFields()
  emit('update:is-shown', false)
}

const clearFields = () => {
  form.address = props.delegateAddress || ''
  form.amount = ''
}

const inputMaxTokensAmount = () => {
  form.amount = rewardsTokenBalance.value
}

const init = async () => {
  if (props.delegateAddress) {
    form.address = props.delegateAddress
  }
}

watch(
  () => web3ProvidersStore.balances.rewardsToken,
  () => {
    formValidationData.value = useFormValidation(form, validationRules)
  },
)

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
  justify-content: flex-end;
  align-items: center;
  margin: toRem(16) 0;
  font-size: toRem(16);
}

.delegate-tokens-modal__available-amount {
  font-weight: 700;
}

.delegate-tokens-modal__info-text {
  @include field-error;

  color: var(--text-tertiary-main);
}

.delegate-tokens-modal__inputs-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  margin-top: toRem(32);
}
</style>
