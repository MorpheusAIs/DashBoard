import { useContract, useProvider } from '@/composables'
import {
  CONTRACT_IDS,
  NETWORK_IDS,
  ROUTE_NAMES,
  SUPPORTED_PROVIDERS,
} from '@/enums'
import { sleep } from '@/helpers'
import { useRouter } from '@/router'
import { type BigNumber } from '@/types'
import { config } from '@config'
import { defineStore } from 'pinia'
import { unref } from 'vue'
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
      if (
        state._router.currentRoute.matched.find(
          route => route.name === ROUTE_NAMES.appMainnet,
        )
      )
        return NETWORK_IDS.mainnet

      return NETWORK_IDS.testnet
    },

    // Contracts
    erc1967ProxyContract() {
      const { contractWithProvider, contractWithSigner } = useContract(
        'ERC1967Proxy__factory',
        config.networks[this.networkId].contractAddressesMap[
          CONTRACT_IDS.erc1967Proxy
        ],
      )

      return {
        provider: unref(contractWithProvider),
        signer: unref(contractWithSigner),
      }
    },
    stEthContract() {
      const { contractWithProvider, contractWithSigner } = useContract(
        'ERC20__factory',
        config.networks[this.networkId].contractAddressesMap[
          CONTRACT_IDS.stEth
        ],
      )

      return {
        provider: unref(contractWithProvider),
        signer: unref(contractWithSigner),
      }
    },
    morContract() {
      const { contractWithProvider, contractWithSigner } = useContract(
        'ERC20__factory',
        config.networks[this.networkId].contractAddressesMap[CONTRACT_IDS.mor],
        config.networks[this.networkId].extendedChainRpcUrl,
      )

      return {
        provider: unref(contractWithProvider),
        singer: unref(contractWithSigner),
      }
    },
    endpointContract() {
      const { contractWithProvider, contractWithSigner } = useContract(
        'Endpoint__factory',
        config.networks[this.networkId].contractAddressesMap[
          CONTRACT_IDS.endpoint
        ],
      )

      return {
        provider: unref(contractWithProvider),
        signer: unref(contractWithSigner),
      }
    },

    isValidChain(state): boolean {
      return (
        state.isAddingToken ||
        String(state.provider.chainId) ===
          config.networks[this.networkId].chainId
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
