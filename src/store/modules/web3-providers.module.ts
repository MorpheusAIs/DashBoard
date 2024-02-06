import { useProvider } from '@/composables'
import { ETHEREUM_CHAINS, SUPPORTED_PROVIDERS } from '@/enums'
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
  }),

  getters: {
    isValidChain: state =>
      state.isAddingToken ||
      String(state.provider.chainId) ===
        (config.IS_MAINNET
          ? ETHEREUM_CHAINS.ethereum
          : ETHEREUM_CHAINS.sepolia),
    address: state => state.provider.selectedAddress,
  },

  actions: {
    async init() {
      const providerDetector = new ProviderDetector()
      await providerDetector.init()

      if (providerDetector.providers.metamask)
        await this.provider.selectProvider(SUPPORTED_PROVIDERS.Metamask)
    },
  },
})
