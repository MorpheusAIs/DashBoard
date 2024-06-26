import useVuelidate, {
  type ChildStateLeafs,
  type GlobalConfig,
  type ValidationArgs,
} from '@vuelidate/core'
import get from 'lodash/get'
import { ComputedRef, UnwrapNestedRefs, computed, unref } from 'vue'

export interface FormValidation {
  getFieldErrorMessage: (fieldPath: string) => string
  isFieldsValid: ComputedRef<boolean>
  isFormValid: () => boolean
  reset: () => void
  touchField: (fieldPath: string) => void
}

export const useFormValidation = (
  state: UnwrapNestedRefs<ChildStateLeafs>,
  rules?: ValidationArgs | ComputedRef<ValidationArgs>,
  globalConfig?: GlobalConfig,
): FormValidation => {
  const validationRules = computed(() => unref(rules))

  const validationController = useVuelidate(
    validationRules,
    state,
    globalConfig,
  )

  const isFieldsValid: FormValidation['isFieldsValid'] = computed(
    () => !validationController.value.$invalid,
  )

  const isFormValid: FormValidation['isFormValid'] = () => {
    validationController.value.$touch()
    return !validationController.value.$invalid
  }

  const getFieldErrorMessage: FormValidation['getFieldErrorMessage'] =
    fieldPath => {
      let errorMessage = ''
      if (!validationController.value || !validationController.value.$invalid) {
        errorMessage = ''
      }

      const field = get(validationController.value, fieldPath)

      if (!field || !Object.keys(field).length) {
        throw new Error(
          `getFieldErrorMessage: Cannot find vuelidate field by '${fieldPath}'`,
        )
      }

      if (!field.$dirty) errorMessage = ''

      errorMessage = field.$errors.length
        ? (field.$errors[0].$message as string)
        : ''

      return errorMessage
    }

  const reset = () => {
    validationController.value.$reset()
  }

  const touchField: FormValidation['touchField'] = fieldPath => {
    const field = get(validationController.value, fieldPath)
    if (field) {
      field.$touch()
    }
  }

  return {
    isFieldsValid,
    getFieldErrorMessage,
    reset,
    touchField,
    isFormValid,
  }
}
