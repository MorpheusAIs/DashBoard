import { i18n } from '@/localization'
import {
  numeric as _numeric,
  required as _required,
} from '@vuelidate/validators'
import { type ValidationRule } from '@vuelidate/core'
import { createI18nMessage, type MessageProps } from '@vuelidate/validators'

const { t } = i18n.global || i18n

const messagePath = ({ $validator }: MessageProps) =>
  `validations.field-error_${$validator}`

const withI18nMessage = createI18nMessage({ t, messagePath })

export const numeric = <ValidationRule>withI18nMessage(_numeric)

export const required = <ValidationRule>withI18nMessage(_required)
