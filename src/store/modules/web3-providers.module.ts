import { useProvider } from '@/composables'
import { ETHEREUM_CHAINS, SUPPORTED_PROVIDERS } from '@/enums'
import { config } from '@config'
import { defineStore } from 'pinia'

const STORE_NAME = 'web3-providers-store'

export const useWeb3ProvidersStore = defineStore(STORE_NAME, {
  state: () => ({
    provider: useProvider(),
  }),

  getters: {
    isValidChain: state =>
      String(state.provider.chainId) ===
      (!config.IS_TESTNET
        ? ETHEREUM_CHAINS.arbitrum
        : ETHEREUM_CHAINS.arbitrumSepolia),
    address: state => state.provider.selectedAddress,
  },

  actions: {
    async init() {
      await this.provider.selectProvider(SUPPORTED_PROVIDERS.Metamask)
    },
  },
})
