<template>
  <div class="arbitrum-step">
    <div class="arbitrum-step__fields">
      <input-field
        v-model="form.arbitrumConfig.tokenName"
        :label="$t(`${I18N_KEY_PREFIX}.token-name-label`)"
        :placeholder="$t(`${I18N_KEY_PREFIX}.token-name-placeholder`)"
        :error-message="getFieldErrorMessage('arbitrumConfig.tokenName')"
        :disabled="isSubmitting || isSubmitted"
        @blur="touchField('arbitrumConfig.tokenName')"
      />
      <input-field
        v-model="form.arbitrumConfig.tokenSymbol"
        :label="$t(`${I18N_KEY_PREFIX}.token-symbol-label`)"
        :placeholder="$t(`${I18N_KEY_PREFIX}.token-symbol-placeholder`)"
        :error-message="getFieldErrorMessage('arbitrumConfig.tokenSymbol')"
        :disabled="isSubmitting || isSubmitted"
        @blur="touchField('arbitrumConfig.tokenSymbol')"
      />
      <input-field
        v-model="form.arbitrumConfig.adminContractAddress"
        :label="$t(`${I18N_KEY_PREFIX}.admin-contract-address-label`)"
        :placeholder="
          $t(`${I18N_KEY_PREFIX}.admin-contract-address-placeholder`)
        "
        :error-message="
          getFieldErrorMessage('arbitrumConfig.adminContractAddress')
        "
        :disabled="isSubmitting || isSubmitted"
        @blur="touchField('arbitrumConfig.adminContractAddress')"
      />
      <checkbox-field
        v-model="form.arbitrumConfig.isUpgradeable"
        class="arbitrum-step__is-upgradeable-checkbox"
        :label="$t(`${I18N_KEY_PREFIX}.is-upgradeable-label`)"
        :disabled="isSubmitting || isSubmitted"
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
          v-model="form.arbitrumConfig.settings.tokenInAddress"
          :label="$t(`${I18N_KEY_PREFIX}.settings.token-in-address-label`)"
          :placeholder="
            $t(`${I18N_KEY_PREFIX}.settings.token-in-address-placeholder`)
          "
          :error-message="
            getFieldErrorMessage('arbitrumConfig.settings.tokenInAddress')
          "
          :disabled="isSubmitting || isSubmitted"
          @blur="touchField('arbitrumConfig.settings.tokenInAddress')"
        />
        <input-field
          v-model="form.arbitrumConfig.settings.tokenOutAddress"
          :label="$t(`${I18N_KEY_PREFIX}.settings.token-out-address-label`)"
          :placeholder="
            $t(`${I18N_KEY_PREFIX}.settings.token-out-address-placeholder`)
          "
          :error-message="
            getFieldErrorMessage('arbitrumConfig.settings.tokenOutAddress')
          "
          :disabled="isSubmitting || isSubmitted"
          @blur="touchField('arbitrumConfig.settings.tokenOutAddress')"
        />
        <select-field
          v-model="form.arbitrumConfig.settings.firstSwapFee"
          :value-options="UNISWAP_FEE_OPTIONS"
          :label="$t(`${I18N_KEY_PREFIX}.settings.first-swap-fee-label`)"
          :placeholder="
            $t(`${I18N_KEY_PREFIX}.settings.first-swap-fee-placeholder`)
          "
          :error-message="
            getFieldErrorMessage('arbitrumConfig.settings.firstSwapFee')
          "
          :disabled="isSubmitting || isSubmitted"
          @blur="touchField('arbitrumConfig.settings.firstSwapFee')"
        />
        <select-field
          v-model="form.arbitrumConfig.settings.secondSwapFee"
          :value-options="UNISWAP_FEE_OPTIONS"
          :label="$t(`${I18N_KEY_PREFIX}.settings.second-swap-fee-label`)"
          :placeholder="
            $t(`${I18N_KEY_PREFIX}.settings.second-swap-fee-placeholder`)
          "
          :error-message="
            getFieldErrorMessage('arbitrumConfig.settings.secondSwapFee')
          "
          :disabled="isSubmitting || isSubmitted"
          @blur="touchField('arbitrumConfig.settings.secondSwapFee')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFormValidation } from '@/composables'
import { CheckboxField, InputField, SelectField } from '@/fields'
import { storeToRefs } from '@/store'
import { address, required } from '@/validators'
import { UNISWAP_FEE_OPTIONS } from '../const'
import { useStore } from '../store'

const I18N_KEY_PREFIX = 'mor20-creation-form.arbitrum-step'

defineProps<{
  isSubmitting: boolean
  isSubmitted: boolean
}>()

const { form } = storeToRefs(useStore())

const { getFieldErrorMessage, touchField } = useFormValidation(form, {
  arbitrumConfig: {
    tokenName: { required },
    tokenSymbol: { required },
    adminContractAddress: { required, address },
    settings: {
      tokenInAddress: { required, address },
      tokenOutAddress: { required, address },
      firstSwapFee: { required },
      secondSwapFee: { required },
    },
  },
})
</script>

<style lang="scss" scoped>
.arbitrum-step__fields {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(16) toRem(32);

  @include respond-to(medium) {
    grid-gap: toRem(16) toRem(20);
  }

  @include respond-to(tablet) {
    grid-template-columns: unset;
  }
}

.arbitrum-step__is-upgradeable-checkbox {
  grid-column: 1;
}

.arbitrum-step__divider {
  margin-top: toRem(16);
  height: toRem(1);
  background: linear-gradient(
    95.36deg,
    rgba(var(--white-rgb), 0.48) 0%,
    rgba(var(--white-rgb), 0.08) 100%
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

  @include respond-to(medium) {
    grid-gap: toRem(16) toRem(20);
  }

  @include respond-to(tablet) {
    grid-template-columns: unset;
  }
}
</style>
