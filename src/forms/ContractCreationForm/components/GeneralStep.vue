<template>
  <div class="general-step">
    <p class="general-step__instruction">
      {{ $t(`${I18N_KEY_PREFIX}.instruction`) }}
    </p>
    <input-field
      :model-value="form.generalConfig.projectName"
      :placeholder="$t(`${I18N_KEY_PREFIX}.project-name-placeholder`)"
      :error-message="
        formValidation.getFieldErrorMessage('generalConfig.projectName')
      "
      :disabled="isSubmitting"
      class="general-step__project-name"
      @blur="formValidation.touchField('generalConfig.projectName')"
      @update:model-value="
        emit('update:form', set(form, 'generalConfig.projectName', $event))
      "
      @update="
        emit('update:form', { ...form, generalConfig: { projectName: $event } })
      "
    />
  </div>
</template>

<script lang="ts" setup>
import { type FormValidation } from '@/composables'
import { InputField } from '@/fields'
import { set } from 'lodash'
import { type Form } from '../types'

const I18N_KEY_PREFIX = 'contract-creation-form.general-step'

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
.general-step {
  max-width: toRem(560);
}

.general-step__instruction {
  @include body-2-regular;
}

.general-step .general-step__project-name {
  margin-top: toRem(30);
}
</style>
