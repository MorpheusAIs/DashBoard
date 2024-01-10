<template>
  <form class="deposit-form" @submit.prevent>
    <div class="deposit-form__select-field-wrp">
      <label class="deposit-form__label" :for="`select-field--${uid}`">
        {{ $t('deposit-form.available-label') }}
      </label>
      <select-field
        v-model="form.available"
        :uid="`select-field--${uid}`"
        :value-options="mockAvailableOptions"
        :error-message="getFieldErrorMessage('available')"
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
      @blur="touchField('amount')"
    >
      <template #nodeRight>
        <app-button
          class="deposit-form__input-field-btn"
          scheme="link"
          text="max"
          @click="form.amount = form.available.value.amount"
        />
      </template>
    </input-field>
    <div class="deposit-form__buttons-wrp">
      <app-button
        class="deposit-form__btn"
        color="secondary"
        :text="$t('deposit-form.cancel-btn')"
        @click="emit('cancel')"
      />
      <app-button
        class="deposit-form__btn"
        :text="$t('deposit-form.submit-btn')"
        @click="submit"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { InputField, SelectField } from '@/fields'
import { type FieldOption } from '@/types'
import { numeric, required } from '@/validators'
import { v4 as uuidv4 } from 'uuid'
import { reactive } from 'vue'

type AvailableOptionValue = {
  amount: string
  currency: string
}

const mockAvailableOptions: FieldOption<AvailableOptionValue>[] = [
  {
    title: '3 667 456.748 stETH',
    value: { amount: '3667456.748', currency: 'stETH' },
  },
  {
    title: '1 437.742 ETH',
    value: { amount: '1437.742', currency: 'ETH' },
  },
]

const emit = defineEmits<{
  (e: 'cancel', v: void): void
}>()

const uid = uuidv4()

const form = reactive({
  available: mockAvailableOptions[0],
  amount: '',
})

const { getFieldErrorMessage, isFormValid, touchField } = useFormValidation(
  form,
  {
    available: { required },
    amount: { required, numeric },
  },
)

const submit = () => {
  if (!isFormValid()) return
}
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
