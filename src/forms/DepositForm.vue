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
        scheme="text"
        @update:model-value="
          form.balanceOptionIdx = balanceOptions.indexOf($event)
        "
        @blur="touchField('balanceOptionIdx')"
      />
    </div>
    <div v-if="isMultiplierShown" class="deposit-form__multiplier-wrp">
      <span class="deposit-form__label">
        {{ $t('deposit-form.expected-multiplier-lbl') }}
      </span>
      <span class="deposit-form__value">
        {{ `x${expectedRewardsMultiplier}` }}
      </span>
    </div>
    <div class="deposit-form__form-data">
      <input-field
        v-model="form.amount"
        class="deposit-form__input-field"
        :placeholder="
          $t('deposit-form.amount-placeholder', {
            currency: balanceOfForm?.value.currency || CURRENCIES.depositToken,
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
      <datetime-field
        v-if="isMultiplierShown"
        v-model="form.lockPeriod"
        position="top"
        :placeholder="$t(`deposit-form.lock-period-placeholder`)"
        :error-message="getFieldErrorMessage('lockPeriod')"
        :is-loading="isInitializing"
        :disabled="isSubmitting"
        @blur="touchField('payoutStartAt')"
      />
    </div>
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
        @click="onSubmit"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { useFormValidation, useI18n, usePool } from '@/composables'
import { MAX_UINT_256 } from '@/const'
import { DatetimeField, InputField, SelectField } from '@/fields'
import { getEthExplorerTxUrl, bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { type FieldOption } from '@/types'
import { BigNumber, formatEther, parseUnits, Time, toEther } from '@/utils'
import { ether, maxEther, minEther, minValue, required } from '@/validators'
import { config } from '@config'
import { v4 as uuidv4 } from 'uuid'
import { computed, reactive, ref, toRef, watch } from 'vue'
import { ROUTE_NAMES } from '@/enums'
import { useRoute } from 'vue-router'
import { errors } from '@/errors'

enum ACTIONS {
  approve = 'approve',
  stake = 'stake',
}

enum CURRENCIES {
  depositToken = 'depositToken',
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
  [CURRENCIES.depositToken]: null,
})

const { t } = useI18n()
const route = useRoute()

const { expectedRewardsMultiplier, fetchExpectedMultiplier, userPoolData } =
  usePool(toRef(props.poolId))
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
  ...(web3ProvidersStore.balances.depositToken
    ? [
        {
          title: `${formatEther(web3ProvidersStore.balances.depositToken)} ${
            web3ProvidersStore.depositTokenSymbol
          }`,
          value: {
            amount: toEther(web3ProvidersStore.balances.depositToken),
            currency: CURRENCIES.depositToken,
          },
        },
      ]
    : []),
])

const form = reactive({
  balanceOptionIdx: 0,
  amount: '',
  lockPeriod: '',
})

const isMultiplierShown = computed(
  () => route.name !== ROUTE_NAMES.appDashboardCapital,
)

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
  lockPeriod: {
    minValue: minValue(new Time().timestamp),
  },
}))

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, validationRules)

const submissionBtnText = computed<string>(() =>
  action.value === ACTIONS.approve
    ? t('deposit-form.submit-btn.approve')
    : t('deposit-form.submit-btn.deposit'),
)

const fetchAllowanceByCurrency = async (
  currency: CURRENCIES,
): Promise<BigNumber> => {
  let contract
  switch (currency) {
    case CURRENCIES.depositToken:
      contract = web3ProvidersStore.depositContract
      break
    default:
      throw new errors.UnknownCurrencyError()
  }

  return contract.providerBased.value.allowance(
    web3ProvidersStore.provider.selectedAddress,
    web3ProvidersStore.erc1967ProxyContract.providerBased.value.address,
  )
}

const approveByCurrency = async (currency: CURRENCIES) => {
  let contract
  switch (currency) {
    case CURRENCIES.depositToken:
      contract = web3ProvidersStore.depositContract
      break
    default:
      throw new errors.UnknownCurrencyError()
  }

  return contract.signerBased.value.approve(
    web3ProvidersStore.erc1967ProxyContract.providerBased.value.address,
    MAX_UINT_256,
  )
}

const submit = async (action: ACTIONS): Promise<void> => {
  if (!isFormValid()) return
  isSubmitting.value = true

  try {
    await web3ProvidersStore.provider.selectChain(
      config.networksMap[web3ProvidersStore.networkId].l1.chainId,
    )

    let tx
    if (action === ACTIONS.approve && balanceOfForm.value) {
      tx = await approveByCurrency(balanceOfForm.value.value.currency)
    } else {
      const amountInDecimals = parseUnits(form.amount, 'ether')

      tx =
        await web3ProvidersStore.erc1967ProxyContract.signerBased.value.stake(
          props.poolId,
          amountInDecimals,
          ...(isMultiplierShown.value ? [form.lockPeriod || 0] : []),
        )
      emit('stake-tx-sent')
    }

    const explorerTxUrl = getEthExplorerTxUrl(
      config.networksMap[web3ProvidersStore.networkId].l1.explorerUrl,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.info,
      t('deposit-form.tx-sent-message', { explorerTxUrl }),
    )

    await tx.wait()

    bus.emit(
      BUS_EVENTS.success,
      t('deposit-form.success-message', { explorerTxUrl }),
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

// FIXME: simplify flow
const onSubmit = async () => {
  if (action.value === ACTIONS.approve) await submit(ACTIONS.approve)
  if (action.value == ACTIONS.stake) await submit(ACTIONS.stake)
}

const init = async (): Promise<void> => {
  isInitializing.value = true

  try {
    allowances[CURRENCIES.depositToken] = await fetchAllowanceByCurrency(
      CURRENCIES.depositToken,
    )
  } catch (error) {
    emit('cancel')
    ErrorHandler.process(error)
  }

  form.lockPeriod = String(userPoolData.value?.claimLockEnd?.toNumber() || '')

  isInitializing.value = false
}

watch(
  () => [
    props.poolId,
    web3ProvidersStore.provider.selectedAddress,
    form.lockPeriod,
    userPoolData.value?.claimLockEnd,
  ],
  async () => {
    if (!form.lockPeriod) {
      form.lockPeriod = String(
        userPoolData.value?.claimLockEnd?.toNumber() || '',
      )
    }
    if (isMultiplierShown.value) {
      await fetchExpectedMultiplier(form.lockPeriod)
    }
  },
)

init()
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

.deposit-form__form-data {
  display: flex;
  flex-direction: column;
  gap: toRem(16);
}

.deposit-form .deposit-form__input-field {
  margin-top: toRem(40);

  @include respond-to(medium) {
    margin-top: toRem(20);
  }
}

.deposit-form__multiplier-wrp {
  display: flex;
  justify-content: space-between;
  margin-top: toRem(16);

  @include respond-to(medium) {
    flex-direction: column;
    gap: toRem(4);
  }
}

.deposit-form__value {
  font-size: toRem(22);
  font-weight: 600;
  padding-right: toRem(28);

  @include respond-to(medium) {
    font-size: toRem(18);
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
