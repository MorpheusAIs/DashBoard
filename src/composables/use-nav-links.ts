import { useContext } from './use-context'

export const useNavLinks = () => {
  const { $config, $t } = useContext()

  const links = [
    {
      text: $t('app-navbar.contract-faq-link'),
      href: $config.CONTRACT_FAQ_URL,
    },
    {
      text: $t('app-navbar.community-website-link'),
      href: $config.LANDING_URL,
    },
  ]

  return { links }
}
