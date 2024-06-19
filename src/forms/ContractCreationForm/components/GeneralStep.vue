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
      :disabled="isSubmitting || isSubmitted"
      class="general-step__project-name"
      @blur="formValidation.touchField('generalConfig.projectName')"
      @update:model-value="emitRootField('projectName', $event as string)"
    />
  </div>
</template>

<script lang="ts" setup>
import { type FormValidation } from '@/composables'
import { InputField } from '@/fields'
import { type Form } from '../types'

const I18N_KEY_PREFIX = 'contract-creation-form.general-step'

const emit = defineEmits<{
  (event: 'update:form', value: Form): void
}>()

const props = defineProps<{
  form: Form
  formValidation: FormValidation
  isSubmitting: boolean
  isSubmitted: boolean
}>()

const emitRootField = (field: keyof Form['generalConfig'], value: string) => {
  emit('update:form', {
    ...props.form,
    generalConfig: { ...props.form.generalConfig, [field]: value },
  })
}
</script>

<style lang="scss" scoped>
.general-step {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(20) toRem(32);

  @include respond-to(medium) {
    grid-gap: toRem(20);
  }

  @include respond-to(tablet) {
    grid-template-columns: unset;
  }
}

.general-step__project-name {
  grid-column: 1;
}
</style>
