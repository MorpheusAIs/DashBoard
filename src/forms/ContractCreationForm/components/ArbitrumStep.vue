<template>
  <div class="arbitrum-step">
    <div class="arbitrum-step__fields">
      <input-field
        :model-value="form.arbitrumConfig.tokenName"
        :label="$t('contract-creation-form.arbitrum-step.token-name-label')"
        :placeholder="
          $t('contract-creation-form.arbitrum-step.token-name-placeholder')
        "
        :error-message="
          formValidation.getFieldErrorMessage('arbitrumConfig.tokenName')
        "
        :disabled="isSubmitting"
        @blur="formValidation.touchField('arbitrumConfig.tokenName')"
        @update:model-value="
          emit('update:form', set(form, 'arbitrumConfig.tokenName', $event))
        "
      />
      <input-field
        :model-value="form.arbitrumConfig.tokenSymbol"
        :label="$t('contract-creation-form.arbitrum-step.token-symbol-label')"
        :placeholder="
          $t('contract-creation-form.arbitrum-step.token-symbol-placeholder')
        "
        :error-message="
          formValidation.getFieldErrorMessage('arbitrumConfig.tokenSymbol')
        "
        :disabled="isSubmitting"
        @blur="formValidation.touchField('arbitrumConfig.tokenSymbol')"
        @update:model-value="
          emit('update:form', set(form, 'arbitrumConfig.tokenSymbol', $event))
        "
      />
      <input-field
        :model-value="form.arbitrumConfig.adminContractAddress"
        :label="
          $t(
            'contract-creation-form.arbitrum-step.admin-contract-address-label',
          )
        "
        :placeholder="
          $t(
            // eslint-disable-next-line max-len
            'contract-creation-form.arbitrum-step.admin-contract-address-placeholder',
          )
        "
        :error-message="
          formValidation.getFieldErrorMessage(
            'arbitrumConfig.adminContractAddress',
          )
        "
        :disabled="isSubmitting"
        @blur="formValidation.touchField('arbitrumConfig.adminContractAddress')"
        @update:model-value="
          emit(
            'update:form',
            set(form, 'arbitrumConfig.adminContractAddress', $event),
          )
        "
      />
    </div>
    <div class="arbitrum-step__divider" />
    <div class="arbitrum-step__settings">
      <h5 class="arbitrum-step__settings-title">
        {{ $t('contract-creation-form.arbitrum-step.settings.title') }}
      </h5>
      <div class="arbitrum-step__settings-fields">
        <input-field
          :model-value="form.arbitrumConfig.settings.tokenInAddress"
          :label="
            $t(
              // eslint-disable-next-line max-len
              'contract-creation-form.arbitrum-step.settings.token-in-address-label',
            )
          "
          :placeholder="
            $t(
              // eslint-disable-next-line max-len
              'contract-creation-form.arbitrum-step.settings.token-in-address-placeholder',
            )
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
          @update:model-value="
            emit(
              'update:form',
              set(form, 'arbitrumConfig.settings.tokenInAddress', $event),
            )
          "
        />
        <input-field
          :model-value="form.arbitrumConfig.settings.tokenOutAddress"
          :label="
            $t(
              // eslint-disable-next-line max-len
              'contract-creation-form.arbitrum-step.settings.token-out-address-label',
            )
          "
          :placeholder="
            $t(
              // eslint-disable-next-line max-len
              'contract-creation-form.arbitrum-step.settings.token-out-address-placeholder',
            )
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
          @update:model-value="
            emit(
              'update:form',
              set(form, 'arbitrumConfig.settings.tokenOutAddress', $event),
            )
          "
        />
        <input-field
          :model-value="form.arbitrumConfig.settings.firstSwapFee"
          :label="
            $t(
              // eslint-disable-next-line max-len
              'contract-creation-form.arbitrum-step.settings.first-swap-fee-label',
            )
          "
          :placeholder="
            $t(
              // eslint-disable-next-line max-len
              'contract-creation-form.arbitrum-step.settings.first-swap-fee-placeholder',
            )
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
          @update:model-value="
            emit(
              'update:form',
              set(form, 'arbitrumConfig.settings.firstSwapFee', $event),
            )
          "
        />
        <input-field
          :model-value="form.arbitrumConfig.settings.secondSwapFee"
          :label="
            $t(
              // eslint-disable-next-line max-len
              'contract-creation-form.arbitrum-step.settings.second-swap-fee-label',
            )
          "
          :placeholder="
            $t(
              // eslint-disable-next-line max-len
              'contract-creation-form.arbitrum-step.settings.second-swap-fee-placeholder',
            )
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
          @update:model-value="
            emit(
              'update:form',
              set(form, 'arbitrumConfig.settings.secondSwapFee', $event),
            )
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type FormValidation } from '@/composables'
import { InputField } from '@/fields'
import { type Form } from '../types'
import { set } from 'lodash'

const emit = defineEmits<{
  (event: 'update:form', value: Form): void
}>()

defineProps<{
  form: Form
  formValidation: FormValidation
  isSubmitting: boolean
}>()
</script>

<style lang="scss" scoped>
.arbitrum-step__fields {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(16) toRem(32);
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

.arbitrum-step__settings-fields {
  margin-top: toRem(20);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(16) toRem(32);
}
</style>
