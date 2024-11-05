import { i18n } from '@/localization'
import { type BigNumber } from '@/types'
import { formatUnits, isAddress, parseUnits } from '@/utils'
import {
  integer as _integer,
  numeric as _numeric,
  minValue as _minValue,
  maxValue as _maxValue,
  required as _required,
} from '@vuelidate/validators'
import { type ValidationRule } from '@vuelidate/core'
import { createI18nMessage, type MessageProps } from '@vuelidate/validators'

const { t } = i18n.global || i18n

const messagePath = ({ $validator }: MessageProps) =>
  `validations.field-error_${$validator}`

const withI18nMessage = createI18nMessage({ t, messagePath })

export const integer = <ValidationRule>withI18nMessage(_integer)

export const numeric = <ValidationRule>withI18nMessage(_numeric)

export const minValue = (value: number): ValidationRule =>
  <ValidationRule>withI18nMessage(_minValue(value))

export const maxValue = (value: number): ValidationRule =>
  <ValidationRule>withI18nMessage(_maxValue(value))

export const required = <ValidationRule>withI18nMessage(_required)

export const address = <ValidationRule>withI18nMessage(value => {
  if (!value) return true
  return isAddress(value)
})

export const ether = <ValidationRule>withI18nMessage(value => {
  try {
    parseUnits(value, 'ether')
    return true
  } catch (error) {
    return false
  }
})

export const hex = <ValidationRule>(
  withI18nMessage(value => /^0x[0-9a-fA-F]+$/.test(String(value)))
)

export const maxEther = (max: string): ValidationRule =>
  withI18nMessage(value => {
    try {
      const parsedValue = parseUnits(value, 'ether')
      const parsedMax = parseUnits(max, 'ether')

      return parsedValue.lte(parsedMax)
    } catch (error) {
      return false
    }
  })

export const minEther = (min: BigNumber): ValidationRule => ({
  $validator: value => {
    try {
      const parsedValue = parseUnits(value, 'ether')

      return parsedValue.gte(min)
    } catch (error) {
      return false
    }
  },
  $message: () =>
    t('validations.field-error_minEther', { min: formatUnits(min, 18) }),
})
