import { config } from '@config'
import { useI18n } from './use-i18n'

export const useNavLinks = () => {
  const { t } = useI18n()

  const links = [
    {
      text: t('app-navbar.contract-faq-link'),
      href: config.CONTRACT_FAQ_URL,
    },
    {
      text: t('app-navbar.community-website-link'),
      href: config.LANDING_URL,
    },
  ]

  return { links }
}
