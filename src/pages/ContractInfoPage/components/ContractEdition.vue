<template>
  <div class="contract-edition">
    <h4 class="contract-edition__title">
      {{ $t('contract-edition.title') }}
    </h4>
    <span class="contract-edition__note">
      {{ methodToEdit.note }}
    </span>
    <div class="contract-edition__inputs">
      <!--TODO: THINK MORE ABOUT THIS LOGIC-->
      <div class="contract-edition__input-wrp">
        <input-field
          v-model="form.firstInput"
          class="contract-edition__input"
          :placeholder="methodToEdit.inputs[0]"
          :error-message="getFieldErrorMessage('firstInput')"
          :disabled="isSubmitting || isSubmitted"
          @blur="touchField('firstInput')"
        />
        <app-icon
          v-tooltip="methodToEdit.inputNotes[0]"
          class="contract-edition__input-icon"
          :name="$icons.exclamationCircle"
        />
      </div>
      <div
        v-if="methodToEdit.inputNotes.length > 1"
        class="contract-edition__input-wrp"
      >
        <input-field
          v-model="form.secondInput"
          class="contract-edition__input"
          :placeholder="methodToEdit.inputs[1]"
          :error-message="getFieldErrorMessage('secondInput')"
          :disabled="isSubmitting || isSubmitted"
          @blur="touchField('secondInput')"
        />
        <app-icon
          v-tooltip="methodToEdit.inputNotes[1]"
          class="contract-edition__input-icon"
          :name="$icons.exclamationCircle"
        />
      </div>
      <div
        v-if="methodToEdit.inputNotes.length > 2"
        class="contract-edition__input-wrp"
      >
        <input-field
          v-model="form.thirdInput"
          class="contract-edition__input"
          :placeholder="methodToEdit.inputs[2]"
          :error-message="getFieldErrorMessage('thirdInput')"
          :disabled="isSubmitting || isSubmitted"
          @blur="touchField('thirdInput')"
        />
        <app-icon
          v-tooltip="methodToEdit.inputNotes[2]"
          class="contract-edition__input-icon"
          :name="$icons.exclamationCircle"
        />
      </div>
      <div
        v-if="methodToEdit.inputNotes.length > 3"
        class="contract-edition__input-wrp"
      >
        <input-field
          v-model="form.fourthInput"
          class="contract-edition__input"
          :placeholder="methodToEdit.inputs[3]"
          :error-message="getFieldErrorMessage('fourthInput')"
          :disabled="isSubmitting || isSubmitted"
          @blur="touchField('fourthInput')"
        />
        <app-icon
          v-tooltip="methodToEdit.inputNotes[3]"
          class="contract-edition__input-icon"
          :name="$icons.exclamationCircle"
        />
      </div>
    </div>
    <app-button
      class="contract-edition__btn"
      :text="$t('contract-edition.submit-btn')"
      @click="submit"
    />
  </div>
</template>

<script setup lang="ts">
import { ContractEditionType } from '@/types'
import { ref, reactive } from 'vue'
import { InputField } from '@/fields'
import { AppButton } from '@/common'
import { useFormValidation } from '@/composables'
import { ErrorHandler } from '@/helpers'
import AppIcon from '../../../common/AppIcon.vue'

const props = defineProps<{
  methodToEdit: ContractEditionType
}>()

const isSubmitting = ref(false)
const isSubmitted = ref(false)

const form = reactive({
  firstInput: '',
  secondInput: '',
  thirdInput: '',
  fourthInput: '',
})

const { getFieldErrorMessage, touchField } = useFormValidation(
  form,
  props.methodToEdit.validationRules,
)

const submit = async () => {
  isSubmitted.value = false
  isSubmitting.value = true
  try {
    await new Promise(() => {
      setTimeout(() => {
        return
      }, 1000)
    })
    isSubmitted.value = true
  } catch (e) {
    ErrorHandler.process(e)
  }
  isSubmitting.value = false
}
</script>

<style scoped lang="scss">
.contract-edition {
  width: 100%;
}

.contract-edition__title {
  margin-bottom: toRem(12);
}

.contract-edition__note {
  color: var(--text-tertiary-main);
}

.contract-edition__inputs {
  display: flex;
  flex-direction: column;
  gap: toRem(32);
  margin-top: toRem(24);
}

.contract-edition__btn {
  margin-top: toRem(24);
  margin-left: auto;
}

.contract-edition__input-wrp {
  position: relative;
  display: flex;
  gap: toRem(18);
}

.contract-edition__input-icon {
  position: relative;
  top: toRem(17);
  width: toRem(30);
  height: toRem(30);
  color: var(--text-tertiary-main);
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
}
</style>
