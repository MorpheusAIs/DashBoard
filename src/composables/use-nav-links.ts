import { ROUTE_NAMES } from '@/enums'
import { useContext } from './use-context'

export const useNavLinks = () => {
  const { $t } = useContext()

  const links = [
    {
      text: $t('app-navbar.token-contract-link'),
      route: { name: ROUTE_NAMES.app },
    },
    {
      text: $t('app-navbar.community-website-link'),
      href: 'https://mor.org/',
    },
  ]

  return { links }
}
