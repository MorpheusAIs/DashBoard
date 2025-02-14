<template>
  <basic-modal
    :is-shown="isShown"
    @update:is-shown="emit('update:is-shown', $event)"
    :title="$t('builder-withdraw-modal.modal-title')"
    :is-close-by-click-outside="!isSubmitting"
    :has-close-button="!isSubmitting"
  >
    <form @submit.prevent="submit" class="max-h-[80dvh] overflow-auto">
      <div class="mt-8 flex flex-col gap-5">
        <div class="flex flex-col items-end gap-3">
          <input-field
            v-model="form.withdrawAmount"
            :placeholder="$t('builder-withdraw-modal.withdraw-amount-plh')"
            :error-message="getFieldErrorMessage('withdrawAmount')"
            @blur="touchField('withdrawAmount')"
            :disabled="isSubmitting"
          >
            <template #nodeRight>
              <button
                type="button"
                class="stake-modal__inputs-max-btn"
                @click="setMaxAmount"
                :disabled="isSubmitting"
              >
                {{ $t('builder-withdraw-modal.withdraw-amount-max-btn') }}
              </button>
            </template>
          </input-field>

          <div class="flex items-center justify-between gap-2">
            <span class="stake-modal__details-label">
              {{ $t('builder-withdraw-modal.available-to-withdraw-balance') }}
            </span>
            <span class="stake-modal__details-value">
              {{
                $t('builder-withdraw-modal.available-to-withdraw-amount', {
                  amount: formatAmount(
                    buildersSubnetUserAccount?.staked ?? 0,
                    18,
                    {
                      decimals: 18,
                    },
                  ),
                })
              }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-col gap-3 bg-backdropModal px-6 py-4">
        <div
          class="flex items-center justify-between"
          v-for="(el, i) in builderDetails.slice(0, 1)"
          :key="i"
        >
          <span class="text-textSecondaryMain typography-body3">
            {{ el.label }}
          </span>
          <span class="font-bold text-textSecondaryMain typography-body3">
            {{ el.value }}
          </span>
        </div>

        <div class="my-2 h-[1px] w-full bg-backgroundPrimaryMain opacity-20" />

        <div
          class="flex items-center justify-between"
          v-for="(el, i) in builderDetails.slice(1)"
          :key="i"
        >
          <span class="text-textSecondaryMain typography-body3">
            {{ el.label }}
          </span>
          <span class="font-bold text-textSecondaryMain typography-body3">
            {{ el.value }}
          </span>
        </div>
      </div>

      <div class="mt-10 flex items-center justify-center gap-4">
        <app-button
          scheme="filled"
          color="secondary"
          @click="emit('update:is-shown', false)"
          :disabled="isSubmitting"
        >
          {{ $t('builder-withdraw-modal.cancel-btn') }}
        </app-button>
        <app-button type="submit" :disabled="!isFieldsValid || isSubmitting">
          {{ $t('builder-withdraw-modal.submit-btn') }}
        </app-button>
      </div>
    </form>
  </basic-modal>
</template>

<script setup lang="ts">
import { AppButton, BasicModal } from '@/common'
import { InputField } from '@/fields'
import { useFormValidation, useI18n, useLoad } from '@/composables'
import { storeToRefs, useWeb3ProvidersStore } from '@/store'
import { computed, reactive, ref } from 'vue'
import {
  BuilderSubnetDefaultFragment,
  BuilderUserDefaultFragment,
} from '@/types/graphql'
import { maxValue, numeric, required } from '@/validators'
import { formatEther, parseUnits } from '@/utils'
import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  formatAmount,
  getEthExplorerTxUrl,
  sleep,
} from '@/helpers'
import { BigNumber } from 'ethers'
import { helpers } from '@vuelidate/validators'
import { time } from '@distributedlab/tools'

const props = withDefaults(
  defineProps<{
    builderSubnet: BuilderSubnetDefaultFragment
    buildersSubnetUserAccount: BuilderUserDefaultFragment
    isShown?: boolean
  }>(),
  {
    isShown: true,
  },
)

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
  (e: 'submitted'): void
}>()

const maxAmountToWithdraw = computed(() => {
  if (!props.buildersSubnetUserAccount.staked) return '0'

  return formatAmount(props.buildersSubnetUserAccount.staked, 18, {
    decimals: 18,
  })
})

const { t } = useI18n()

const { provider, builderSubnetsContractDetails, builderSubnetsContract } =
  storeToRefs(useWeb3ProvidersStore())

const isSubmitting = ref(false)

const { data: potentialPowerFactor } = useLoad(
  '',
  async () => {
    if (!props.buildersSubnetUserAccount) return ''

    let to = 1
    if (+props.buildersSubnetUserAccount.claimLockEnd) {
      const usersClaimLockEnd = time(
        +props.buildersSubnetUserAccount.claimLockEnd,
      )

      if (usersClaimLockEnd.isAfter(time())) {
        to = usersClaimLockEnd.timestamp
      }
    }

    const pfBN =
      await builderSubnetsContract.value.providerBased.value.getPowerFactor(
        time().timestamp,
        to,
      )

    return pfBN.toString()
  },
  {
    reloadArgs: [() => props.buildersSubnetUserAccount],
  },
)

const form = reactive({
  withdrawAmount: '',
})

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, {
    withdrawAmount: {
      required,
      numeric,
      notEmpty: helpers.withMessage(
        t('builder-withdraw-modal.not-empty-validation-msg'),
        (val: string | number) => {
          return Boolean(Number(val))
        },
      ),
      maxValue: maxValue(+maxAmountToWithdraw.value),
    },
  })

const builderDetails = computed(() => {
  const balanceAfterWithdrawal = BigNumber.from(
    props.buildersSubnetUserAccount.staked ?? 0,
  ).sub(parseUnits(form.withdrawAmount || '0'))

  return [
    {
      label: t('builder-withdraw-modal.power-factor-lbl'),
      value: `${formatAmount(potentialPowerFactor.value, 25, {
        decimals: 25,
      })}x`,
    },
    {
      label: t('builder-withdraw-modal.builder-lbl'),
      value: props.builderSubnet?.name,
    },
    {
      label: t('builder-withdraw-modal.current-withdraw-lbl'),
      value: t('builder-withdraw-modal.available-to-withdraw-amount', {
        amount: formatEther(props.buildersSubnetUserAccount.staked || 0),
      }),
    },
    {
      label: t('builder-withdraw-modal.balance-after-withdrawal-lbl'),
      value: t('builder-withdraw-modal.balance-after-withdrawal-value', {
        amount: balanceAfterWithdrawal.isNegative()
          ? '-'
          : formatEther(balanceAfterWithdrawal),
      }),
    },
  ]
})

const setMaxAmount = () => {
  form.withdrawAmount = maxAmountToWithdraw.value
}

const clearForm = () => {
  form.withdrawAmount = ''
}

const submit = async () => {
  if (!isFormValid()) return

  isSubmitting.value = true

  try {
    if (
      provider.value.chainId !==
      builderSubnetsContractDetails.value.targetChainId
    ) {
      provider.value.selectChain(
        builderSubnetsContractDetails.value.targetChainId,
      )
      await sleep(1_000)
    }

    const tx = await builderSubnetsContract.value?.signerBased.value.withdraw(
      props.builderSubnet?.id,
      parseUnits(form.withdrawAmount),
    )

    if (!tx) throw new TypeError('Transaction is not defined')

    const explorerTxUrl = getEthExplorerTxUrl(
      builderSubnetsContractDetails.value.explorerUrl,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.success,
      t('builder-withdraw-modal.withdraw-success-msg', { explorerTxUrl }),
    )
    emit('submitted')
    clearForm()
  } catch (error) {
    ErrorHandler.process(error)
  }

  isSubmitting.value = false
}
</script>

<style scoped lang="scss">
.stake-modal__details-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stake-modal__details-label {
  font-size: toRem(16);
  line-height: toRem(24);
}

.stake-modal__details-value {
  font-size: toRem(16);
  line-height: toRem(24);
  font-weight: 700;
}

.stake-modal__inputs-max-btn {
  color: var(--primary-main);
  font-size: toRem(18);
  font-weight: 700;
  line-height: toRem(24);

  @include square(48);
}
</style>
