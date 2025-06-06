<template>
  <basic-modal
    class="change-lock-modal"
    :is-shown="isShown"
    :is-close-by-click-outside="isCloseByClickOutside"
    :title="$t('change-lock-modal.title')"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <template #subtitle>
      <span class="change-lock-modal__subtitle">
        {{ $t('change-lock-modal.subtitle') }}
      </span>
      <div class="change-lock-modal__expected-multiplier-wrapper">
        <span class="change-lock-modal__expected-multiplier-text">
          {{ $t('change-lock-modal.expected-multiplier-title') }}
        </span>
        <p class="change-lock-modal__expected-multiplier">
          {{ `x${userMultiplier}` }}
        </p>
      </div>
    </template>
    <template #default>
      <div class="change-lock-modal__fields-wrapper">
        <datetime-field
          v-model="form.lockPeriod"
          position="center-higher"
          :placeholder="$t(`change-lock-modal.lock-period-placeholder`)"
          :error-message="getFieldErrorMessage('lockPeriod')"
          :disabled="isSubmitting"
          @blur="touchField('payoutStartAt')"
        />
      </div>
      <div class="change-lock-modal__buttons-wrp">
        <app-button
          class="change-lock-modal__btn"
          color="secondary"
          :text="$t('change-lock-modal.cancel-btn')"
          :disabled="isSubmitting"
          @click="cancel"
        />
        <app-button
          class="change-lock-modal__btn"
          :text="$t('change-lock-modal.submit-btn')"
          :disabled="!isFieldsValid || isSubmitting || !form.lockPeriod"
          @click="submit"
        />
      </div>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
import BasicModal from '../BasicModal.vue'
import { DatetimeField } from '@/fields'
import { computed, reactive, ref, toRef, watch } from 'vue'
import { minValue } from '@/validators'
import { useFormValidation, useI18n, usePool } from '@/composables'
import { AppButton } from '@/common'
import { useWeb3ProvidersStore } from '@/store'
import { bus, BUS_EVENTS, ErrorHandler, getEthExplorerTxUrl } from '@/helpers'
import { sleep } from '@/helpers'
import { time } from '@distributedlab/tools'

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    isShown: boolean
    poolId: number
    isCloseByClickOutside?: boolean
  }>(),
  {
    isCloseByClickOutside: true,
  },
)

const { t } = useI18n()
const {
  rewardsMultiplier,
  expectedRewardsMultiplier,
  userPoolData,
  fetchExpectedMultiplier,
} = usePool(toRef(props.poolId))

const web3ProvidersStore = useWeb3ProvidersStore()

const isSubmitting = ref(false)

const form = reactive({
  lockPeriod: '',
})

const userMultiplier = computed(() =>
  Number(rewardsMultiplier.value) > Number(expectedRewardsMultiplier.value)
    ? rewardsMultiplier.value
    : expectedRewardsMultiplier.value,
)

const minLockTime = computed(() => {
  const claimLockTimestamp = userPoolData.value?.claimLockEnd?.toNumber() ?? 0
  const timeNow = time().timestamp
  return claimLockTimestamp > timeNow ? claimLockTimestamp : timeNow
})

const validationRules = computed(() => ({
  lockPeriod: {
    minValue: minValue(minLockTime.value),
  },
}))

const { getFieldErrorMessage, isFieldsValid, touchField } = useFormValidation(
  form,
  validationRules,
)

const submit = async () => {
  isSubmitting.value = true

  if (!isFieldsValid.value) {
    return
  }
  try {
    await web3ProvidersStore.provider.switchChain(
      web3ProvidersStore.erc1967ProxyContractDetails.targetChainId,
    )
    await sleep(500)
    const tx =
      // TODO: fix types (wrong abi?)
      // eslint-disable-next-line
      // @ts-ignore
      await web3ProvidersStore.erc1967ProxyContract.signerBased.value.lockClaim(
        props.poolId,
        form.lockPeriod,
      )

    const explorerTxUrl = getEthExplorerTxUrl(
      web3ProvidersStore.erc1967ProxyContractDetails.explorerUrl,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.info,
      t('change-lock-modal.tx-sent-message', { explorerTxUrl }),
    )

    emit('update:is-shown', false)
    form.lockPeriod = ''

    await tx.wait()

    bus.emit(
      BUS_EVENTS.success,
      t('claim-form.success-message', { explorerTxUrl }),
    )

    bus.emit(BUS_EVENTS.changedPoolData)
  } catch (e) {
    ErrorHandler.process(e)
  }
  isSubmitting.value = false
}

const cancel = () => {
  clearFields()
  emit('update:is-shown', false)
}

const clearFields = () => {
  form.lockPeriod = ''
}

watch(
  () => [
    props.poolId,
    form.lockPeriod,
    web3ProvidersStore.provider.selectedAddress,
    web3ProvidersStore.provider.chainId,
    userPoolData.value?.claimLockEnd,
  ],
  () => fetchExpectedMultiplier(form.lockPeriod),
  { immediate: true },
)

watch(
  () => [props.isShown, userPoolData.value?.claimLockEnd],
  () => {
    if (!props.isShown) return

    const usersLockEnd = time(userPoolData.value?.claimLockEnd?.toNumber())

    if (usersLockEnd.isAfter(time())) {
      form.lockPeriod = String(userPoolData.value?.claimLockEnd?.toNumber())

      return
    }

    form.lockPeriod = String(time().add(1, 'minute').timestamp)
  },
)
</script>

<style lang="scss" scoped>
.change-lock-modal__subtitle {
  font: inherit;
}

.change-lock-modal__fields-wrapper {
  margin-top: toRem(40);
}

.change-lock-modal__reward {
  white-space: nowrap;

  @include body-1-semi-bold;
}

.change-lock-modal__form {
  margin-top: toRem(40);

  @include respond-to(medium) {
    margin-top: toRem(20);
  }
}

.change-lock-modal__buttons-wrp {
  margin-top: toRem(40);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(16);

  @include respond-to(medium) {
    margin-top: toRem(36);
  }
}

.change-lock-modal .change-lock-modal__btn {
  min-width: toRem(200);

  @include respond-to(medium) {
    min-width: min-content;
    width: 100%;
  }
}

.change-lock-modal__expected-multiplier-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: toRem(40);

  @include respond-to(medium) {
    flex-direction: column;
    gap: toRem(4);
  }
}

.change-lock-modal__expected-multiplier-text,
.change-lock-modal__expected-multiplier {
  font-size: toRem(22);

  @include respond-to(medium) {
    font-size: toRem(18);
  }
}

.change-lock-modal__expected-multiplier {
  font-weight: 600;
}
</style>
