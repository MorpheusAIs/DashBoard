<template>
  <div class="arbitrum-step">
    <div class="arbitrum-step__fields">
      <input-field
        :model-value="form.arbitrumConfig.tokenName"
        :label="$t(`${I18N_KEY_PREFIX}.token-name-label`)"
        :placeholder="$t(`${I18N_KEY_PREFIX}.token-name-placeholder`)"
        :error-message="
          formValidation.getFieldErrorMessage('arbitrumConfig.tokenName')
        "
        :disabled="isSubmitting"
        @blur="formValidation.touchField('arbitrumConfig.tokenName')"
        @update:model-value="emitRootField('tokenName', $event)"
      />
      <input-field
        :model-value="form.arbitrumConfig.tokenSymbol"
        :label="$t(`${I18N_KEY_PREFIX}.token-symbol-label`)"
        :placeholder="$t(`${I18N_KEY_PREFIX}.token-symbol-placeholder`)"
        :error-message="
          formValidation.getFieldErrorMessage('arbitrumConfig.tokenSymbol')
        "
        :disabled="isSubmitting"
        @blur="formValidation.touchField('arbitrumConfig.tokenSymbol')"
        @update:model-value="emitRootField('tokenSymbol', $event)"
      />
      <input-field
        :model-value="form.arbitrumConfig.adminContractAddress"
        :label="$t(`${I18N_KEY_PREFIX}.admin-contract-address-label`)"
        :placeholder="
          $t(`${I18N_KEY_PREFIX}.admin-contract-address-placeholder`)
        "
        :error-message="
          formValidation.getFieldErrorMessage(
            'arbitrumConfig.adminContractAddress',
          )
        "
        :disabled="isSubmitting"
        @blur="formValidation.touchField('arbitrumConfig.adminContractAddress')"
        @update:model-value="emitRootField('adminContractAddress', $event)"
      />
      <checkbox-field
        :model-value="form.arbitrumConfig.isUpgradeable"
        :label="$t(`${I18N_KEY_PREFIX}.is-upgradeable-label`)"
        :disabled="isSubmitting"
        class="arbitrum-step__is-upgradeable-checkbox"
        @update:model-value="emitRootField('isUpgradeable', $event)"
      />
    </div>
    <div class="arbitrum-step__divider" />
    <div class="arbitrum-step__settings">
      <h5 class="arbitrum-step__settings-title">
        {{ $t(`${I18N_KEY_PREFIX}.settings.title`) }}
      </h5>
      <p class="general-step__settings-description">
        {{
          $t(`${I18N_KEY_PREFIX}.settings.description`, {
            token:
              form.arbitrumConfig.tokenSymbol ||
              $t(`${I18N_KEY_PREFIX}.settings.default-token`),
          })
        }}
      </p>
      <div class="arbitrum-step__settings-fields">
        <input-field
          :model-value="form.arbitrumConfig.settings.tokenInAddress"
          :label="$t(`${I18N_KEY_PREFIX}.settings.token-in-address-label`)"
          :placeholder="
            $t(`${I18N_KEY_PREFIX}.settings.token-in-address-placeholder`)
          "
          :error-message="
            formValidation.getFieldErrorMessage(
              'arbitrumConfig.settings.tokenInAddress',
            )
          "
          :disabled="isSubmitting"
          @blur="
            formValidation.touchField('arbitrumConfig.settings.tokenInAddress')
          "
          @update:model-value="emitSettingsField('tokenInAddress', $event)"
        />
        <input-field
          :model-value="form.arbitrumConfig.settings.tokenOutAddress"
          :label="$t(`${I18N_KEY_PREFIX}.settings.token-out-address-label`)"
          :placeholder="
            $t(`${I18N_KEY_PREFIX}.settings.token-out-address-placeholder`)
          "
          :error-message="
            formValidation.getFieldErrorMessage(
              'arbitrumConfig.settings.tokenOutAddress',
            )
          "
          :disabled="isSubmitting"
          @blur="
            formValidation.touchField('arbitrumConfig.settings.tokenOutAddress')
          "
          @update:model-value="emitSettingsField('tokenOutAddress', $event)"
        />
        <select-field
          :model-value="form.arbitrumConfig.settings.firstSwapFee"
          :value-options="UNISWAP_FEE_OPTIONS"
          :label="$t(`${I18N_KEY_PREFIX}.settings.first-swap-fee-label`)"
          :placeholder="
            $t(`${I18N_KEY_PREFIX}.settings.first-swap-fee-placeholder`)
          "
          :error-message="
            formValidation.getFieldErrorMessage(
              'arbitrumConfig.settings.firstSwapFee',
            )
          "
          :disabled="isSubmitting"
          @blur="
            formValidation.touchField('arbitrumConfig.settings.firstSwapFee')
          "
          @update:model-value="emitSettingsField('firstSwapFee', $event)"
        />
        <select-field
          :model-value="form.arbitrumConfig.settings.secondSwapFee"
          :value-options="UNISWAP_FEE_OPTIONS"
          :label="$t(`${I18N_KEY_PREFIX}.settings.second-swap-fee-label`)"
          :placeholder="
            $t(`${I18N_KEY_PREFIX}.settings.second-swap-fee-placeholder`)
          "
          :error-message="
            formValidation.getFieldErrorMessage(
              'arbitrumConfig.settings.secondSwapFee',
            )
          "
          :disabled="isSubmitting"
          @blur="
            formValidation.touchField('arbitrumConfig.settings.secondSwapFee')
          "
          @update:model-value="emitSettingsField('secondSwapFee', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type FormValidation } from '@/composables'
import { CheckboxField, InputField, SelectField } from '@/fields'
import { UNISWAP_FEE_OPTIONS } from '../const'
import { type Form } from '../types'

const I18N_KEY_PREFIX = 'contract-creation-form.arbitrum-step'

const emit = defineEmits<{
  (event: 'update:form', value: Form): void
}>()

const props = defineProps<{
  form: Form
  formValidation: FormValidation
  isSubmitting: boolean
}>()

const emitRootField = (
  field: keyof Form['arbitrumConfig'],
  value: string | number,
) => {
  emit('update:form', {
    ...props.form,
    arbitrumConfig: { ...props.form.arbitrumConfig, [field]: value },
  })
}

const emitSettingsField = (
  field: keyof Form['arbitrumConfig']['settings'],
  value: string | number,
) => {
  emit('update:form', {
    ...props.form,
    arbitrumConfig: {
      ...props.form.arbitrumConfig,
      settings: { ...props.form.arbitrumConfig.settings, [field]: value },
    },
  })
}
</script>

<style lang="scss" scoped>
.arbitrum-step__fields {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(16) toRem(32);
}

.arbitrum-step__is-upgradeable-checkbox {
  grid-column: 1;
}

.arbitrum-step__divider {
  margin-top: toRem(16);
  height: toRem(1);
  background: linear-gradient(
    95.36deg,
    rgba(255, 255, 255, 0.48) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
}

.arbitrum-step__settings {
  margin-top: toRem(16);
}

.arbitrum-step__settings-title {
  @include body-2-semi-bold;
}

.general-step__settings-description {
  margin-top: toRem(8);
}

.arbitrum-step__settings-fields {
  margin-top: toRem(20);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(16) toRem(32);
}
</style>
