import { useProvider } from '@/composables'
import { NETWORKS } from '@/const'
import { NETWORK_IDS, ROUTE_NAMES, SUPPORTED_PROVIDERS } from '@/enums'
import { sleep } from '@/helpers'
import { useRouter } from '@/router'
import { type BigNumber } from '@/types'
import { config } from '@config'
import { defineStore } from 'pinia'
import { ProviderDetector } from '@distributedlab/w3p'

const STORE_NAME = 'web3-providers-store'

enum BALANCE_CURRENCIES {
  stEth = 'stEth',
  mor = 'mor',
}

export const useWeb3ProvidersStore = defineStore(STORE_NAME, {
  state: () => ({
    provider: useProvider(),
    balances: {
      [BALANCE_CURRENCIES.stEth]: null,
      [BALANCE_CURRENCIES.mor]: null,
    } as Record<BALANCE_CURRENCIES, BigNumber | null>,
    isAddingToken: false,
    hasConnectedProvider: false,
    _router: useRouter(),
  }),

  persist: {
    paths: ['hasConnectedProvider'],
    storage: localStorage,
  },

  getters: {
    networkId: (state): NETWORK_IDS => {
      const matchedRoute = state._router.currentRoute.matched.find(
        route =>
          route.name === ROUTE_NAMES.appMainnet ||
          route.name === ROUTE_NAMES.appTestnet,
      )

      if (matchedRoute) {
        switch (matchedRoute.name) {
          case ROUTE_NAMES.appMainnet:
            return NETWORK_IDS.mainnet
          case ROUTE_NAMES.appTestnet:
            return NETWORK_IDS.testnet
        }
      }

      return NETWORK_IDS.testnet
    },
    contractAddressesMap(): Record<string, string> {
      switch (this.networkId) {
        case NETWORK_IDS.mainnet:
          return {
            erc1967Proxy: config.ERC1967_PROXY_MAINNET_CONTRACT_ADDRESS,
            stEth: config.STETH_MAINNET_CONTRACT_ADDRESS,
            mor: config.MOR_MAINNET_CONTRACT_ADDRESS,
            endpoint: config.ENDPOINT_MAINNET_CONTRACT_ADDRESS,
          }

        case NETWORK_IDS.testnet:
          return {
            erc1967Proxy: config.ERC1967_PROXY_TESTNET_CONTRACT_ADDRESS,
            stEth: config.STETH_TESTNET_CONTRACT_ADDRESS,
            mor: config.MOR_TESTNET_CONTRACT_ADDRESS,
            endpoint: config.ENDPOINT_TESTNET_CONTRACT_ADDRESS,
          }
      }
    },
    isValidChain(state): boolean {
      return (
        state.isAddingToken ||
        String(state.provider.chainId) === NETWORKS[this.networkId].chainId
      )
    },
    address: state => state.provider.selectedAddress,
    isConnected: state =>
      state.provider.isConnected && state.hasConnectedProvider,
  },

  actions: {
    async init() {
      const providerDetector = new ProviderDetector()
      await providerDetector.init()

      if (providerDetector.providers.metamask)
        await this.provider.selectProvider(SUPPORTED_PROVIDERS.Metamask)

      // store requires time for sync with vue-router
      await sleep(1000)
    },
  },
})
