<template>
  <form
    class="deposit-form"
    :class="{ 'deposit-form--loading': isInitializing }"
    @submit.prevent
  >
    <div class="deposit-form__select-field-wrp">
      <label class="deposit-form__label" :for="`select-field--${uid}`">
        {{ $t('deposit-form.available-label') }}
      </label>
      <select-field
        :model-value="formAvailable"
        :uid="`select-field--${uid}`"
        :value-options="availableOptions"
        :error-message="getFieldErrorMessage('availableOptionIdx')"
        :is-loading="isInitializing"
        :disabled="isSubmitting"
        @update:model-value="
          form.availableOptionIdx = availableOptions.indexOf($event)
        "
        @blur="touchField('availableOptionIdx')"
      />
    </div>
    <input-field
      v-model="form.amount"
      class="deposit-form__input-field"
      :placeholder="
        $t('deposit-form.amount-placeholder', {
          currency: formAvailable?.value.currency || AVAILABLE_CURRENCIES.stEth,
        })
      "
      :error-message="getFieldErrorMessage('amount')"
      :is-loading="isInitializing"
      :disabled="isSubmitting"
      @blur="touchField('amount')"
    >
      <template #nodeRight>
        <app-button
          class="deposit-form__input-field-btn"
          scheme="link"
          text="max"
          :disabled="isSubmitting"
          @click="form.amount = formAvailable?.value.amount || ''"
        />
      </template>
    </input-field>
    <div class="deposit-form__buttons-wrp">
      <app-button
        class="deposit-form__btn"
        color="secondary"
        :text="$t('deposit-form.cancel-btn')"
        :is-loading="isInitializing"
        @click="emit('cancel')"
      />
      <app-button
        class="deposit-form__btn"
        :text="submitBtnText"
        :disabled="isSubmitting || !isFieldsValid"
        :is-loading="isInitializing"
        @click="submit"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { useContext, useContract, useFormValidation } from '@/composables'
import { MAX_UINT_256 } from '@/const'
import { ETHEREUM_EXPLORER_URLS, ETHEREUM_RPC_URLS } from '@/enums'
import { InputField, SelectField } from '@/fields'
import { getEthExplorerTxUrl, bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { type FieldOption } from '@/types'
import { BigNumber, formatEther, parseUnits, toEther } from '@/utils'
import { ether, maxEther, required } from '@/validators'
import { config } from '@config'
import { v4 as uuidv4 } from 'uuid'
import { computed, onMounted, reactive, ref } from 'vue'

enum SUBMIT_ACTIONS {
  approve = 'approve',
  stake = 'stake',
}

enum AVAILABLE_CURRENCIES {
  stEth = 'stETH',
}

type AvailableOptionValue = {
  amount: string
  currency: AVAILABLE_CURRENCIES
}

const emit = defineEmits<{
  (e: 'cancel', v: void): void
  (e: 'stake-tx-sent', v: void): void
}>()

const props = defineProps<{ poolId: number }>()

const uid = uuidv4()
const isInitializing = ref(true)
const isSubmitting = ref(false)

const allowances = reactive<Record<AVAILABLE_CURRENCIES, BigNumber | null>>({
  [AVAILABLE_CURRENCIES.stEth]: null,
})

const { contractWithSigner: erc1967Proxy } = useContract(
  'ERC1967Proxy__factory',
  config.ERC1967_PROXY_CONTRACT_ADDRESS,
)

const { contractWithProvider: stEthWithProvider } = useContract(
  'ERC20__factory',
  config.STETH_CONTRACT_ADDRESS,
  config.IS_MAINNET ? ETHEREUM_RPC_URLS.ethereum : ETHEREUM_RPC_URLS.sepolia,
)

const { contractWithSigner: stEthWithSigner } = useContract(
  'ERC20__factory',
  config.STETH_CONTRACT_ADDRESS,
)

const { $t } = useContext()
const web3ProvidersStore = useWeb3ProvidersStore()

const submitAction = computed<SUBMIT_ACTIONS>(() => {
  if (isFieldsValid.value) {
    const amountInDecimals = parseUnits(form.amount, 'ether')
    const allowance = formAvailable.value
      ? allowances[formAvailable.value.value.currency]
      : null

    if (allowance && amountInDecimals.gt(allowance)) {
      return SUBMIT_ACTIONS.approve
    }
  }

  return SUBMIT_ACTIONS.stake
})

const availableOptions = computed<FieldOption<AvailableOptionValue>[]>(() => [
  ...(web3ProvidersStore.balances.stEth
    ? [
        {
          title: `${formatEther(web3ProvidersStore.balances.stEth)} stETH`,
          value: {
            amount: toEther(web3ProvidersStore.balances.stEth),
            currency: AVAILABLE_CURRENCIES.stEth,
          },
        },
      ]
    : []),
])

const form = reactive({
  availableOptionIdx: 0,
  amount: '',
})

const formAvailable = computed<FieldOption<AvailableOptionValue> | null>(
  () => availableOptions.value[form.availableOptionIdx] || null,
)

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, {
    availableOptionIdx: { required },
    amount: {
      required,
      ether,
      ...(formAvailable.value?.value && {
        maxEther: maxEther(formAvailable.value.value.amount),
      }),
    },
  })

const submitBtnText = computed<string>(() =>
  submitAction.value === SUBMIT_ACTIONS.approve
    ? $t('deposit-form.submit-btn.approve')
    : $t('deposit-form.submit-btn.deposit'),
)

const fetchAllowanceByCurrency = async (
  currency: AVAILABLE_CURRENCIES,
): Promise<BigNumber> => {
  let contract
  switch (currency) {
    case AVAILABLE_CURRENCIES.stEth:
      contract = stEthWithProvider.value
      break
    default:
      throw new Error('unknown currency')
  }

  return contract.allowance(
    web3ProvidersStore.provider.selectedAddress,
    config.ERC1967_PROXY_CONTRACT_ADDRESS,
  )
}

const approveByCurrency = async (currency: AVAILABLE_CURRENCIES) => {
  let contract
  switch (currency) {
    case AVAILABLE_CURRENCIES.stEth:
      contract = stEthWithSigner.value
      break
    default:
      throw new Error('unknown currency')
  }

  return contract.approve(config.ERC1967_PROXY_CONTRACT_ADDRESS, MAX_UINT_256)
}

const submit = async (): Promise<void> => {
  if (!isFormValid()) return
  isSubmitting.value = true

  try {
    let tx
    if (submitAction.value === SUBMIT_ACTIONS.approve && formAvailable.value) {
      tx = await approveByCurrency(formAvailable.value.value.currency)
    } else {
      const amountInDecimals = parseUnits(form.amount, 'ether')
      tx = await erc1967Proxy.value.stake(props.poolId, amountInDecimals)
      emit('stake-tx-sent')
    }

    const explorerTxUrl = getEthExplorerTxUrl(
      config.IS_MAINNET
        ? ETHEREUM_EXPLORER_URLS.ethereum
        : ETHEREUM_EXPLORER_URLS.sepolia,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.info,
      $t('deposit-form.tx-sent-message', { explorerTxUrl }),
    )

    await tx.wait()

    bus.emit(
      BUS_EVENTS.success,
      $t('deposit-form.success-message', { explorerTxUrl }),
    )

    bus.emit(BUS_EVENTS.changedPoolData)

    if (formAvailable.value)
      allowances[formAvailable.value.value.currency] =
        await fetchAllowanceByCurrency(formAvailable.value.value.currency)
  } catch (error) {
    ErrorHandler.process(error)
  } finally {
    isSubmitting.value = false
  }
}

const init = async (): Promise<void> => {
  isInitializing.value = true

  try {
    allowances[AVAILABLE_CURRENCIES.stEth] = await fetchAllowanceByCurrency(
      AVAILABLE_CURRENCIES.stEth,
    )
  } catch (error) {
    emit('cancel')
    ErrorHandler.process(error)
  }

  isInitializing.value = false
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.deposit-form__select-field-wrp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(16);

  @include respond-to(medium) {
    flex-direction: column;
    align-items: start;
    gap: toRem(4);
  }
}

.deposit-form__label {
  .deposit-form--loading & {
    @include skeleton;
  }

  @include body-1-regular;
}

.deposit-form .deposit-form__input-field {
  margin-top: toRem(40);

  @include respond-to(medium) {
    margin-top: toRem(20);
  }
}

.deposit-form .deposit-form__input-field-btn {
  @include body-3-semi-bold;
}

.deposit-form__buttons-wrp {
  margin-top: toRem(40);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(16);

  @include respond-to(medium) {
    margin-top: toRem(36);
  }
}

.deposit-form .deposit-form__btn {
  min-width: toRem(200);

  @include respond-to(medium) {
    min-width: min-content;
    width: 100%;
  }
}
</style>
