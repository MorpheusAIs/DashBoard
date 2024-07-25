<template>
  <basic-modal
    class="change-lock-modal"
    :is-shown="isShown"
    :is-close-by-click-outside="isCloseByClickOutside"
    :title="$t('claim-modal.title')"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <template #subtitle>
      <i18n-t
        class="change-lock-modal__subtitle"
        keypath="change-lock-modal.subtitle"
        tag="p"
      >
        <template #reward>
          <span class="change-lock-modal__reward">
            {{ $t('claim-modal.reward') }}
          </span>
        </template>
      </i18n-t>
    </template>
    <template #default="{ modal }">
      <datetime-field
        v-model="form.lockPeriod"
        position="top"
        :placeholder="$t(`deposit-form.lock-period-placeholder`)"
        :error-message="getFieldErrorMessage('lockPeriod')"
        @blur="touchField('payoutStartAt')"
      />
      <div class="deposit-form__buttons-wrp">
        <app-button
          class="deposit-form__btn"
          color="secondary"
          :text="$t('deposit-form.cancel-btn')"
          @click="modal.close()"
        />
        <app-button
          class="deposit-form__btn"
          :text="$t('deposit-form.cancel-btn')"
          :disabled="!isFieldsValid"
          @click="submit"
        />
      </div>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
import BasicModal from '../BasicModal.vue'
import { DatetimeField } from '@/fields'
import { computed, reactive } from 'vue'
import { minValue } from '@/validators'
import { Time } from '@/utils'
import { useFormValidation } from '@/composables'
import { AppButton } from '@/common'

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

withDefaults(
  defineProps<{
    isShown: boolean
    poolId: number
    isCloseByClickOutside?: boolean
  }>(),
  {
    isCloseByClickOutside: true,
  },
)

const form = reactive({
  lockPeriod: '',
})

const validationRules = computed(() => ({
  lockPeriod: {
    minValue: minValue(new Time().timestamp),
  },
}))

const { getFieldErrorMessage, isFieldsValid, touchField } = useFormValidation(
  form,
  validationRules,
)

const submit = async () => {
  if (!isFieldsValid.value) {
    return
  }
  emit('update:is-shown', false)
}
</script>

<style lang="scss" scoped>
.change-lock-modal__subtitle {
  font: inherit;
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
