<template>
  <form class="withdraw-form" @submit.prevent>
    <input-field
      v-model="form.amount"
      class="withdraw-form__input-field"
      :placeholder="$t('withdraw-form.amount-placeholder')"
      :error-message="getFieldErrorMessage('amount')"
      @blur="touchField('amount')"
    >
      <template #nodeRight>
        <app-button
          class="withdraw-form__input-field-btn"
          scheme="link"
          text="max"
          @click="form.amount = mockMacAmount"
        />
      </template>
    </input-field>
    <div class="withdraw-form__buttons-wrp">
      <app-button
        class="withdraw-form__btn"
        color="secondary"
        :text="$t('withdraw-form.cancel-btn')"
        @click="emit('cancel')"
      />
      <app-button
        class="withdraw-form__btn"
        :text="$t('withdraw-form.submit-btn')"
        @click="submit"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { InputField } from '@/fields'
import { required, numeric } from '@/validators'
import { reactive } from 'vue'

const mockMacAmount = '111'

const emit = defineEmits<{
  (e: 'cancel', v: void): void
}>()

const form = reactive({
  amount: '' as string,
})

const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
  form,
  { amount: { required, numeric } },
)

const submit = () => {
  if (isFormValid()) return
}
</script>

<style lang="scss" scoped>
.withdraw-form .withdraw-form__input-field {
  margin-top: toRem(40);

  @include respond-to(medium) {
    margin-top: toRem(20);
  }
}

.withdraw-form .withdraw-form__input-field-btn {
  @include body-3-semi-bold;
}

.withdraw-form__buttons-wrp {
  margin-top: toRem(40);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(16);

  @include respond-to(medium) {
    margin-top: toRem(36);
  }
}

.withdraw-form .withdraw-form__btn {
  min-width: toRem(200);

  @include respond-to(medium) {
    min-width: min-content;
    width: 100%;
  }
}
</style>
