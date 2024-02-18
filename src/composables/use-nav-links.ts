import { useContext } from './use-context'

export const useNavLinks = () => {
  const { $t } = useContext()

  const links = [
    {
      text: $t('app-navbar.contract-faq-link'),
      href: 'https://github.com/MorpheusAIs/Docs/blob/main/Guide/Morpheus%20Capital%20Providers%20Contract%20Guide.md',
    },
    {
      text: $t('app-navbar.community-website-link'),
      href: 'https://mor.org/',
    },
  ]

  return { links }
}
