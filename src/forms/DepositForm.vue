<template>
  <form
    class="deposit-form"
    :class="{ 'deposit-form--loading': isInitializing }"
    @submit.prevent
  >
    <div class="deposit-form__balance-wrp">
      <label class="deposit-form__label" :for="`select-field--${uid}`">
        {{ $t('deposit-form.balance-label') }}
      </label>
      <span class="deposit-form__value">
        {{ balanceOfForm }}
      </span>
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
            currency:
              web3ProvidersStore.depositTokenSymbol || CURRENCIES.depositToken,
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
            @click="
              form.amount = formatEther(
                web3ProvidersStore.balances.depositToken?._hex ?? 0,
              )
            "
          />
        </template>
      </input-field>
      <datetime-field
        v-if="isMultiplierShown"
        v-model="form.lockPeriod"
        position="top"
        :placeholder="$t('deposit-form.lock-period-placeholder')"
        :error-message="getFieldErrorMessage('lockPeriod')"
        :is-loading="isInitializing"
        :disabled="isSubmitting"
        @blur="touchField('payoutStartAt')"
      />
      <input-field
        v-model="form.referrer"
        :disabled="isReferrerDisabled"
        :placeholder="$t('deposit-form.referrer-placeholder')"
        :error-message="getFieldErrorMessage('referrer')"
        :is-loading="isInitializing"
        :note="$t('deposit-form.referrer-note')"
        @blur="touchField('referrer')"
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
import { DatetimeField, InputField } from '@/fields'
import { getEthExplorerTxUrl, bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { BigNumber, formatEther, parseUnits, Time } from '@/utils'
import {
  ether,
  maxEther,
  minEther,
  minValue,
  required,
  address,
} from '@/validators'
import { config } from '@config'
import { v4 as uuidv4 } from 'uuid'
import { computed, reactive, ref, toRef, watch } from 'vue'
import { ROUTE_NAMES } from '@/enums'
import { useRoute } from 'vue-router'
import { type Erc1967ProxyType } from '@/types'
import { ethers } from 'ethers'

enum ACTIONS {
  approve = 'approve',
  stake = 'stake',
}

enum CURRENCIES {
  depositToken = 'depositToken',
}

const emit = defineEmits<{
  (e: 'cancel', v: void): void
  (e: 'stake-tx-sent', v: void): void
}>()

const props = defineProps<{
  poolId: number
  minStake: BigNumber
}>()

const { t } = useI18n()
const route = useRoute()

const uid = uuidv4()
const isInitializing = ref(true)
const isSubmitting = ref(false)

const depositTokenAllowance = ref('')

const { expectedRewardsMultiplier, fetchExpectedMultiplier, userPoolData } =
  usePool(toRef(props.poolId))
const web3ProvidersStore = useWeb3ProvidersStore()

const isReferrerDisabled = computed(
  () => ethers.utils.isAddress(route.query?.referrer) || isSubmitting.value,
)

const action = computed<ACTIONS>(() => {
  if (isFieldsValid.value) {
    const amountInDecimals = parseUnits(form.amount, 'ether')

    if (
      depositTokenAllowance.value &&
      amountInDecimals.gt(depositTokenAllowance.value)
    ) {
      return ACTIONS.approve
    }
  }

  return ACTIONS.stake
})

const form = reactive({
  amount: '',
  lockPeriod: '',
  referrer: '',
})

const isMultiplierShown = computed(
  () => route.name !== ROUTE_NAMES.appDashboardCapital,
)

const balanceOfForm = computed(
  () =>
    `${formatEther(web3ProvidersStore.balances.depositToken)} ${
      web3ProvidersStore.depositTokenSymbol
    }`,
)

const validationRules = computed(() => ({
  amount: {
    required,
    ether,
    minEther: minEther(props.minStake.add(parseUnits('0.001', 'ether'))),
    ...(balanceOfForm.value && {
      maxEther: maxEther(formatEther(web3ProvidersStore.balances.depositToken)),
    }),
  },
  lockPeriod: {
    minValue: minValue(new Time().timestamp),
  },
  referrer: {
    address,
  },
}))

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, validationRules)

const submissionBtnText = computed<string>(() =>
  action.value === ACTIONS.approve
    ? t('deposit-form.submit-btn.approve')
    : t('deposit-form.submit-btn.deposit'),
)

const fetchAllowance = async (): Promise<BigNumber> =>
  web3ProvidersStore.depositContract.providerBased.value.allowance(
    web3ProvidersStore.provider.selectedAddress,
    web3ProvidersStore.erc1967ProxyContract.providerBased.value.address,
  )

const approveByCurrency = async () =>
  web3ProvidersStore.depositContract.signerBased.value.approve(
    web3ProvidersStore.erc1967ProxyContract.providerBased.value.address,
    MAX_UINT_256,
  )

const submit = async (action: ACTIONS): Promise<void> => {
  if (!isFormValid()) return
  isSubmitting.value = true

  try {
    await web3ProvidersStore.provider.selectChain(
      web3ProvidersStore.selectedNetworkByType.l1.chainId,
    )

    let tx
    if (action === ACTIONS.approve && balanceOfForm.value) {
      tx = await approveByCurrency()
    } else {
      const amountInDecimals = parseUnits(form.amount, 'ether')

      tx =
        await web3ProvidersStore.erc1967ProxyContract.signerBased.value.stake(
          props.poolId,
          amountInDecimals,
          ...(isMultiplierShown.value
            ? [form.lockPeriod || 0, form.referrer || config.DEFAULT_REFEREE]
            : []),
        )
      emit('stake-tx-sent')
    }

    const explorerTxUrl = getEthExplorerTxUrl(
      web3ProvidersStore.selectedNetworkByType.l1.explorerUrl,
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
      depositTokenAllowance.value = await fetchAllowance()
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
    depositTokenAllowance.value = await fetchAllowance()
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
      const claimLockEnd = String(
        userPoolData.value?.claimLockEnd?.toNumber() || '',
      )
      form.lockPeriod = new Time().isAfter(claimLockEnd)
        ? new Time().timestamp.toString()
        : claimLockEnd
    }
    if (isMultiplierShown.value) {
      await fetchExpectedMultiplier(form.lockPeriod)
    }
  },
)

watch(
  [() => route.query?.referrer, userPoolData],
  async () => {
    if (route.query?.referrer) {
      form.referrer = route.query.referrer
      touchField('referrer')
      return
    }
    const contractReferrer = (userPoolData.value as Erc1967ProxyType.UserData)
      ?.referrer
    form.referrer =
      contractReferrer === ethers.constants.AddressZero
        ? config.DEFAULT_REFEREE
        : contractReferrer
    touchField('referrer')
  },
  { immediate: true },
)

init()
</script>

<style lang="scss" scoped>
.deposit-form__balance-wrp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(16);

  @include respond-to(medium) {
    flex-direction: column;
    align-items: center;
    gap: toRem(4);
  }
}

.deposit-form__label {
  .deposit-form--loading & {
    @include skeleton;
  }

  @include body-1-regular;

  @include respond-to(medium) {
    text-align: center;
  }
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
    padding: 0;
    text-align: center;
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
