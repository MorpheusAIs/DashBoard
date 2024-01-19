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
        v-model="form.available"
        :uid="`select-field--${uid}`"
        :value-options="availableOptions"
        :error-message="getFieldErrorMessage('available')"
        :is-loading="isInitializing"
        :disabled="isSubmitting"
        @blur="touchField('available')"
      />
    </div>
    <input-field
      v-model="form.amount"
      class="deposit-form__input-field"
      :placeholder="
        $t('deposit-form.amount-placeholder', {
          currency: form.available.value.currency,
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
          @click="form.amount = form.available.value.amount"
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
import { ETHEREUM_RPC_URLS } from '@/enums'
import { InputField, SelectField } from '@/fields'
import { bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { type FieldOption } from '@/types'
import { BigNumber, formatEther, parseUnits } from '@/utils'
import { ether, maxEther, required } from '@/validators'
import { config } from '@config'
import { v4 as uuidv4 } from 'uuid'
import { computed, onMounted, reactive, ref } from 'vue'

enum AVAILABLE_CURRENCIES {
  stEth = 'stEth',
}

type AvailableOptionValue = {
  amount: string
  currency: AVAILABLE_CURRENCIES
}

const emit = defineEmits<{
  (e: 'cancel', v: void): void
}>()

const props = defineProps<{ poolId: number }>()

const { contractWithSigner: erc1967Proxy } = useContract(
  'ERC1967Proxy__factory',
  config.ERC1967_PROXY_CONTRACT_ADDRESS,
)

const { contractWithProvider: stEthWithProvider } = useContract(
  'ERC20__factory',
  config.STETH_CONTRACT_ADDRESS,
  !config.IS_TESTNET ? ETHEREUM_RPC_URLS.ethereum : ETHEREUM_RPC_URLS.sepolia,
)

const { contractWithSigner: stEthWithSigner } = useContract(
  'ERC20__factory',
  config.STETH_CONTRACT_ADDRESS,
)

const { $t } = useContext()
const web3ProvidersStore = useWeb3ProvidersStore()

const allowances = reactive<Record<AVAILABLE_CURRENCIES, BigNumber | null>>({
  [AVAILABLE_CURRENCIES.stEth]: null,
})

const availableOptions = computed<FieldOption<AvailableOptionValue>[]>(() => [
  ...(web3ProvidersStore.balances.stEth
    ? [
        {
          title: `${formatEther(web3ProvidersStore.balances.stEth)} stETH`,
          value: {
            amount: formatEther(web3ProvidersStore.balances.stEth),
            currency: AVAILABLE_CURRENCIES.stEth,
          },
        },
      ]
    : []),
])

const uid = uuidv4()

const form = reactive({
  available: availableOptions.value[0] || null,
  amount: '',
})

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, {
    available: { required },
    amount: {
      required,
      ether,
      maxEther: maxEther(form.available.value.amount),
    },
  })

const submitBtnText = computed<string>(() => {
  if (isFieldsValid.value) {
    const amountInDecimals = parseUnits(form.amount, 18)
    const allowance = allowances[form.available.value.currency]

    if (allowance && amountInDecimals.gt(allowance)) {
      return $t('deposit-form.submit-btn.approve')
    }
  }

  return $t('deposit-form.submit-btn.deposit')
})

const fetchAllowanceByCurrency = async (
  currency: AVAILABLE_CURRENCIES,
): Promise<BigNumber> => {
  let contract
  switch (currency) {
    case 'stEth':
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
    case 'stEth':
      contract = stEthWithSigner.value
      break
    default:
      throw new Error('unknown currency')
  }

  return contract.approve(config.ERC1967_PROXY_CONTRACT_ADDRESS, MAX_UINT_256)
}

const isSubmitting = ref(false)
const submit = async (): Promise<void> => {
  if (!isFormValid()) return
  isSubmitting.value = true

  try {
    const amountInDecimals = parseUnits(form.amount, 18)
    const allowance = allowances[form.available.value.currency]

    if (allowance && amountInDecimals.gt(allowance)) {
      const tx = await approveByCurrency(form.available.value.currency)
      await tx.wait()
      await fetchAllowanceByCurrency(form.available.value.currency)

      bus.emit(BUS_EVENTS.success)
      bus.emit(BUS_EVENTS.updatedUserAllowance)
      return
    }

    const tx = await erc1967Proxy.value.stake(props.poolId, amountInDecimals)
    await tx.wait()

    bus.emit(BUS_EVENTS.success)
    bus.emit(BUS_EVENTS.updatedUserDeposit)
    emit('cancel')
  } catch (error) {
    ErrorHandler.process(error)
  } finally {
    isSubmitting.value = false
  }
}

const isInitializing = ref(true)
const init = async (): Promise<void> => {
  isInitializing.value = true

  try {
    allowances.stEth = await fetchAllowanceByCurrency(
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
