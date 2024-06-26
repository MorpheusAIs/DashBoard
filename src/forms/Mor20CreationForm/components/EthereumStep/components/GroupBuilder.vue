<template>
  <div class="group-builder">
    <checkbox-field
      v-model="group.isPublic"
      :label="$t(`${I18N_KEY_PREFIX}.is-public-label`)"
      :disabled="disabled"
    />
    <div class="group-builder__fields">
      <datetime-field
        v-model="group.payoutStartAt"
        :placeholder="$t(`${I18N_KEY_PREFIX}.payout-start-placeholder`)"
        :error-message="groupValidation.getFieldErrorMessage('payoutStartAt')"
        :disabled="disabled"
        @blur="groupValidation.touchField('payoutStartAt')"
      />
      <input-field
        v-model="group.decreaseInterval"
        :placeholder="$t(`${I18N_KEY_PREFIX}.decrease-interval-placeholder`)"
        :error-message="
          groupValidation.getFieldErrorMessage('decreaseInterval')
        "
        :disabled="disabled"
        @blur="groupValidation.touchField('decreaseInterval')"
      />
      <input-field
        v-if="group.isPublic"
        v-model="group.withdrawLockPeriod"
        :placeholder="$t(`${I18N_KEY_PREFIX}.withdraw-lock-period-placeholder`)"
        :error-message="
          groupValidation.getFieldErrorMessage('withdrawLockPeriod')
        "
        :disabled="disabled"
        @blur="groupValidation.touchField('withdrawLockPeriod')"
      />
      <input-field
        v-model="group.claimLockPeriod"
        :placeholder="$t(`${I18N_KEY_PREFIX}.claim-lock-period-placeholder`)"
        :error-message="groupValidation.getFieldErrorMessage('claimLockPeriod')"
        :disabled="disabled"
        @blur="groupValidation.touchField('claimLockPeriod')"
      />
      <input-field
        v-if="group.isPublic"
        v-model="group.withdrawLockPeriodAfterStake"
        :placeholder="
          $t(`${I18N_KEY_PREFIX}.withdraw-lock-period-after-stake-placeholder`)
        "
        :error-message="
          groupValidation.getFieldErrorMessage('withdrawLockPeriodAfterStake')
        "
        :disabled="disabled"
        @blur="groupValidation.touchField('withdrawLockPeriodAfterStake')"
      />
      <input-field
        v-model="group.initialReward"
        :placeholder="$t(`${I18N_KEY_PREFIX}.initial-reward-placeholder`)"
        :error-message="groupValidation.getFieldErrorMessage('initialReward')"
        :disabled="disabled"
        @blur="groupValidation.touchField('initialReward')"
      />
      <input-field
        v-model="group.rewardDecrease"
        :placeholder="$t(`${I18N_KEY_PREFIX}.reward-decrease-placeholder`)"
        :error-message="groupValidation.getFieldErrorMessage('rewardDecrease')"
        :disabled="disabled"
        @blur="groupValidation.touchField('rewardDecrease')"
      />
      <input-field
        v-if="group.isPublic"
        v-model="group.minimalStake"
        :placeholder="$t(`${I18N_KEY_PREFIX}.minimal-stake-placeholder`)"
        :error-message="groupValidation.getFieldErrorMessage('minimalStake')"
        :disabled="disabled"
        @blur="groupValidation.touchField('minimalStake')"
      />
      <app-button
        class="group-builder__build-btn"
        scheme="link"
        :text="$t(`${I18N_KEY_PREFIX}.build-btn`)"
        :icon-left="$icons.save"
        :disabled="!groupValidation.isFieldsValid.value || disabled"
        @click="build"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { CheckboxField, DatetimeField, InputField } from '@/fields'
import { Time } from '@/utils'
import { ether, integer, minValue, numeric, required } from '@/validators'
import { computed, reactive, watch } from 'vue'
import { type EthereumConfigGroup } from '../../../types'

const I18N_KEY_PREFIX = 'mor20-creation-form.ethereum-step.group-builder'

const DEFAULT_PRESET: Readonly<EthereumConfigGroup> = Object.freeze({
  isPublic: true,
  payoutStartAt: '',
  decreaseInterval: '',
  withdrawLockPeriod: '',
  claimLockPeriod: '',
  withdrawLockPeriodAfterStake: '',
  initialReward: '',
  rewardDecrease: '',
  minimalStake: '',
})

const emit = defineEmits<{
  (event: 'build', value: EthereumConfigGroup): void
}>()

const props = withDefaults(
  defineProps<{
    preset?: EthereumConfigGroup | null
    disabled?: boolean
  }>(),
  {
    preset: null,
    disabled: false,
  },
)

const group = reactive<EthereumConfigGroup>({
  ...(props.preset || DEFAULT_PRESET),
})

const groupValidation = useFormValidation(
  group,
  computed(() => ({
    payoutStartAt: { required, minValue: minValue(new Time().timestamp) },
    decreaseInterval: { required, integer },
    claimLockPeriod: { required, numeric },
    initialReward: { required, ether },
    rewardDecrease: { required, ether },
    ...(group.isPublic && {
      withdrawLockPeriod: { required, numeric },
      withdrawLockPeriodAfterStake: { required, numeric },
      minimalStake: { required, ether },
    }),
  })),
  { $scope: false },
)

const build = () => {
  if (!groupValidation.isFormValid()) {
    return
  }

  emit('build', { ...group })
  Object.assign(group, DEFAULT_PRESET)
  groupValidation.reset()
}

watch(
  () => props.preset,
  newPreset => {
    if (newPreset) Object.assign(group, newPreset)
  },
)
</script>

<style lang="scss" scoped>
.group-builder__fields {
  margin-top: toRem(16);
  display: grid;
  grid-gap: toRem(16);
}

.group-builder__build-btn {
  margin-left: auto;

  @include body-3-semi-bold;
}
</style>
