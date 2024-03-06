import { useI18n as useVueI18n, type UseI18nOptions as Options } from 'vue-i18n'

export const useI18n = (options?: Options) =>
  useVueI18n({ useScope: 'global', ...options })
