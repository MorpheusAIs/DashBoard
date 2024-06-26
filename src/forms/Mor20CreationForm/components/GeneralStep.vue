<template>
  <div class="general-step">
    <p class="general-step__instruction">
      {{ $t(`${I18N_KEY_PREFIX}.instruction`) }}
    </p>
    <input-field
      v-model="form.generalConfig.projectName"
      :placeholder="$t(`${I18N_KEY_PREFIX}.project-name-placeholder`)"
      :error-message="getFieldErrorMessage('generalConfig.projectName')"
      :disabled="isDisabled"
      class="general-step__project-name"
      @blur="touchField('generalConfig.projectName')"
    />
  </div>
</template>

<script lang="ts" setup>
import { useFormValidation } from '@/composables'
import { InputField } from '@/fields'
import { storeToRefs } from '@/store'
import { required } from '@/validators'
import { computed } from 'vue'
import { STEP_IDS } from '../enums'
import { useStore } from '../store'

const I18N_KEY_PREFIX = 'mor20-creation-form.general-step'

const props = defineProps<{
  isSubmitting: boolean
  isSubmitted: boolean
}>()

const { form } = storeToRefs(useStore())

const { getFieldErrorMessage, touchField } = useFormValidation(form, {
  generalConfig: { projectName: { required } },
})

const isDisabled = computed(
  () =>
    props.isSubmitting ||
    (form.value.stepId === STEP_IDS.arbitrum ? false : props.isSubmitted),
)
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
