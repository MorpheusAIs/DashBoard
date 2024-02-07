import { i18n } from '@/localization'
import { type BigNumber } from '@/types'
import { formatUnits, parseUnits } from '@/utils'
import { required as _required } from '@vuelidate/validators'
import { type ValidationRule } from '@vuelidate/core'
import { createI18nMessage, type MessageProps } from '@vuelidate/validators'

const { t } = i18n.global || i18n

const messagePath = ({ $validator }: MessageProps) =>
  `validations.field-error_${$validator}`

const withI18nMessage = createI18nMessage({ t, messagePath })

export const required = <ValidationRule>withI18nMessage(_required)

export const ether = <ValidationRule>withI18nMessage(value => {
  try {
    parseUnits(value, 'ether')
    return true
  } catch (error) {
    return false
  }
})

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
