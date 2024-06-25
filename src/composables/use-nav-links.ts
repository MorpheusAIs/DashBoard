import { NETWORK_IDS, ROUTE_NAMES } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import { config } from '@config'
import { computed } from 'vue'
import { useI18n } from './use-i18n'

export const useNavLinks = () => {
  const { t } = useI18n()
  const web3ProvidersStore = useWeb3ProvidersStore()

  const links = computed(() => [
    // TODO: remove the condition when the page will have a mainnet contract
    ...(web3ProvidersStore.networkId !== NETWORK_IDS.mainnet
      ? [
          {
            text: t('app-navbar.mor20-ecosystem-link'),
            route: { name: ROUTE_NAMES.appMor20EcosystemMain },
          },
        ]
      : []),
    {
      text: t('app-navbar.contract-faq-link'),
      href: config.CONTRACT_FAQ_URL,
    },
    {
      text: t('app-navbar.community-website-link'),
      href: config.LANDING_URL,
    },
  ])

  return { links }
}
