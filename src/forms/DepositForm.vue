<template>
  <form
    class="deposit-form"
    :class="{ 'deposit-form--loading': isInitializing }"
    @submit.prevent
  >
    <div class="deposit-form__select-field-wrp">
      <label class="deposit-form__label" :for="`select-field--${uid}`">
        {{ $t('deposit-form.balance-label') }}
      </label>
      <select-field
        :model-value="balanceOfForm"
        :uid="`select-field--${uid}`"
        :value-options="balanceOptions"
        :error-message="getFieldErrorMessage('balanceOptionIdx')"
        :is-loading="isInitializing"
        :disabled="isSubmitting"
        @update:model-value="
          form.balanceOptionIdx = balanceOptions.indexOf($event)
        "
        @blur="touchField('balanceOptionIdx')"
      />
    </div>
    <input-field
      v-model="form.amount"
      class="deposit-form__input-field"
      :placeholder="
        $t('deposit-form.amount-placeholder', {
          currency: balanceOfForm?.value.currency || CURRENCIES.stEth,
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
          :disabled="isSubmitting || !balanceOfForm"
          @click="form.amount = balanceOfForm?.value.amount || ''"
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
        :text="submissionBtnText"
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
import { ether, maxEther, minEther, required } from '@/validators'
import { config } from '@config'
import { v4 as uuidv4 } from 'uuid'
import { computed, onMounted, reactive, ref } from 'vue'

enum ACTIONS {
  approve = 'approve',
  stake = 'stake',
}

enum CURRENCIES {
  stEth = 'stETH',
}

type BalanceOptionValue = {
  amount: string
  currency: CURRENCIES
}

const emit = defineEmits<{
  (e: 'cancel', v: void): void
  (e: 'stake-tx-sent', v: void): void
}>()

const props = defineProps<{
  poolId: number
  minStake: BigNumber
}>()

const uid = uuidv4()
const isInitializing = ref(true)
const isSubmitting = ref(false)

const allowances = reactive<Record<CURRENCIES, BigNumber | null>>({
  [CURRENCIES.stEth]: null,
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

const action = computed<ACTIONS>(() => {
  if (isFieldsValid.value) {
    const amountInDecimals = parseUnits(form.amount, 'ether')
    const allowance = balanceOfForm.value
      ? allowances[balanceOfForm.value.value.currency]
      : null

    if (allowance && amountInDecimals.gt(allowance)) {
      return ACTIONS.approve
    }
  }

  return ACTIONS.stake
})

const balanceOptions = computed<FieldOption<BalanceOptionValue>[]>(() => [
  ...(web3ProvidersStore.balances.stEth
    ? [
        {
          title: `${formatEther(web3ProvidersStore.balances.stEth)} stETH`,
          value: {
            amount: toEther(web3ProvidersStore.balances.stEth),
            currency: CURRENCIES.stEth,
          },
        },
      ]
    : []),
])

const form = reactive({
  balanceOptionIdx: 0,
  amount: '',
})

const balanceOfForm = computed<FieldOption<BalanceOptionValue> | null>(
  () => balanceOptions.value[form.balanceOptionIdx] || null,
)

const validationRules = computed(() => ({
  balanceOptionIdx: { required },
  amount: {
    required,
    ether,
    minEther: minEther(props.minStake.add(parseUnits('0.001', 'ether'))),
    ...(balanceOfForm.value?.value && {
      maxEther: maxEther(balanceOfForm.value.value.amount),
    }),
  },
}))

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, validationRules)

const submissionBtnText = computed<string>(() =>
  action.value === ACTIONS.approve
    ? $t('deposit-form.submit-btn.approve')
    : $t('deposit-form.submit-btn.deposit'),
)

const fetchAllowanceByCurrency = async (
  currency: CURRENCIES,
): Promise<BigNumber> => {
  let contract
  switch (currency) {
    case CURRENCIES.stEth:
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

const approveByCurrency = async (currency: CURRENCIES) => {
  let contract
  switch (currency) {
    case CURRENCIES.stEth:
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
    if (action.value === ACTIONS.approve && balanceOfForm.value) {
      tx = await approveByCurrency(balanceOfForm.value.value.currency)
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

    if (balanceOfForm.value)
      allowances[balanceOfForm.value.value.currency] =
        await fetchAllowanceByCurrency(balanceOfForm.value.value.currency)
  } catch (error) {
    ErrorHandler.process(error)
  } finally {
    isSubmitting.value = false
  }
}

const init = async (): Promise<void> => {
  isInitializing.value = true

  try {
    allowances[CURRENCIES.stEth] = await fetchAllowanceByCurrency(
      CURRENCIES.stEth,
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
