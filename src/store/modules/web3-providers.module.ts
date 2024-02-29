import { useContract, useProvider } from '@/composables'
import { CONTRACT_IDS, NETWORK_IDS, ROUTE_NAMES } from '@/enums'
import { sleep } from '@/helpers'
import { useRouter } from '@/router'
import { type BigNumber } from '@/types'
import { config } from '@config'
import { providers } from 'ethers'
import { defineStore } from 'pinia'
import { type MaybeRef } from 'vue'
import {
  FallbackEvmProvider,
  MetamaskProvider,
  ProviderDetector,
  PROVIDERS,
  type ProviderProxyConstructor,
} from '@distributedlab/w3p'

type DefaultProvider = MaybeRef<
  providers.Web3Provider | providers.JsonRpcProvider
>

enum BALANCE_CURRENCIES {
  stEth = 'stEth',
  mor = 'mor',
}

export enum SUPPORTED_PROVIDERS {
  Metamask = PROVIDERS.Metamask,
  Fallback = PROVIDERS.Fallback,
}

const STORE_NAME = 'web3-providers-store'

const SUPPORTED_PROXY_CONSTRUCTORS: Record<
  SUPPORTED_PROVIDERS,
  ProviderProxyConstructor
> = {
  [SUPPORTED_PROVIDERS.Fallback]: FallbackEvmProvider,
  [SUPPORTED_PROVIDERS.Metamask]: MetamaskProvider,
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

    defaultProvider(state): DefaultProvider {
      const networkId = this.networkId as NETWORK_IDS
      if (String(state.provider.chainId) === config.networks[networkId].chainId)
        return new providers.Web3Provider(
          state.provider.rawProvider as providers.ExternalProvider,
        )

      return config.networks[networkId].provider
    },

    // Contracts
    erc1967ProxyContract() {
      const networkId = this.networkId as NETWORK_IDS

      return useContract(
        'ERC1967Proxy__factory',
        config.networks[networkId].contractAddressesMap[
          CONTRACT_IDS.erc1967Proxy
        ],
        this.defaultProvider as unknown as DefaultProvider,
      )
    },
    stEthContract() {
      const networkId = this.networkId as NETWORK_IDS

      return useContract(
        'ERC20__factory',
        config.networks[networkId].contractAddressesMap[CONTRACT_IDS.stEth],
        this.defaultProvider as unknown as DefaultProvider,
      )
    },
    morContract() {
      const networkId = this.networkId as NETWORK_IDS

      return useContract(
        'ERC20__factory',
        config.networks[networkId].contractAddressesMap[CONTRACT_IDS.mor],
        config.networks[networkId].extendedChainProvider,
      )
    },
    endpointContract() {
      const networkId = this.networkId as NETWORK_IDS

      return useContract(
        'Endpoint__factory',
        config.networks[networkId].contractAddressesMap[CONTRACT_IDS.endpoint],
        this.defaultProvider as unknown as DefaultProvider,
      )
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
        await this.provider.init(
          SUPPORTED_PROXY_CONSTRUCTORS[SUPPORTED_PROVIDERS.Metamask],
        )

      // store requires time for sync with vue-router
      await sleep(1000)
    },
  },
})
