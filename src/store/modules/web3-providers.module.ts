import { useContract, useProvider } from '@/composables'
import { CONTRACT_IDS, NETWORK_IDS, ROUTE_NAMES } from '@/enums'
import { sleep } from '@/helpers'
import { useRouter } from '@/router'
import { type BigNumber } from '@/types'
import { config } from '@config'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import {
  FallbackEvmProvider,
  MetamaskProvider,
  ProviderDetector,
  PROVIDERS,
  type ProviderProxyConstructor,
  type RawProvider,
} from '@distributedlab/w3p'

enum BALANCE_CURRENCIES {
  stEth = 'stEth',
  mor = 'mor',
}

export enum SUPPORTED_PROVIDERS {
  metamask = PROVIDERS.Metamask,
  ethereumFallback = 'ethereum-fallback',
  sepoliaFallback = 'sepolia-fallback',
  arbitrumFallback = 'arbitrum-fallback',
  arbitrumSepoliaFallback = 'arbitrum-sepolia-fallback',
}

class EthereumFallbackProvider extends FallbackEvmProvider {
  static get providerType(): string {
    return SUPPORTED_PROVIDERS.ethereumFallback
  }
}

class SepoliaFallbackProvider extends FallbackEvmProvider {
  static get providerType(): string {
    return SUPPORTED_PROVIDERS.sepoliaFallback
  }
}

class ArbitrumFallbackProvider extends FallbackEvmProvider {
  static get providerType(): string {
    return SUPPORTED_PROVIDERS.arbitrumFallback
  }
}

class ArbitrumSepoliaFallbackProvider extends FallbackEvmProvider {
  static get providerType(): string {
    return SUPPORTED_PROVIDERS.arbitrumSepoliaFallback
  }
}

const STORE_NAME = 'web3-providers-store'

const SUPPORTED_PROXY_CONSTRUCTORS: Record<
  SUPPORTED_PROVIDERS,
  ProviderProxyConstructor
> = {
  [SUPPORTED_PROVIDERS.metamask]: MetamaskProvider,
  [SUPPORTED_PROVIDERS.ethereumFallback]: EthereumFallbackProvider,
  [SUPPORTED_PROVIDERS.sepoliaFallback]: SepoliaFallbackProvider,
  [SUPPORTED_PROVIDERS.arbitrumFallback]: ArbitrumFallbackProvider,
  [SUPPORTED_PROVIDERS.arbitrumSepoliaFallback]:
    ArbitrumSepoliaFallbackProvider,
}

export const useWeb3ProvidersStore = defineStore(
  STORE_NAME,
  () => {
    const _router = reactive(useRouter())
    const _ethereumFallbackProvider = reactive(useProvider())
    const _sepoliaFallbackProvider = reactive(useProvider())
    const _arbitrumFallbackProvider = reactive(useProvider())
    const _arbitrumSepoliaFallbackProvider = reactive(useProvider())

    // State
    const walletProvider = reactive(useProvider())

    const balances = reactive<Record<BALANCE_CURRENCIES, BigNumber | null>>({
      [BALANCE_CURRENCIES.stEth]: null,
      [BALANCE_CURRENCIES.mor]: null,
    })

    const isAddingToken = ref(false)
    const hasConnectedProvider = ref(false)

    // Getters
    const networkId = computed<NETWORK_IDS>(() => {
      if (
        _router.currentRoute.matched.find(
          route => route.name === ROUTE_NAMES.appMainnet,
        )
      )
        return NETWORK_IDS.mainnet

      return NETWORK_IDS.testnet
    })

    const defaultProvider = computed<RawProvider | null>(() => {
      if (
        String(walletProvider.chainId) ===
        config.networks[networkId.value].chainId
      )
        walletProvider.rawProvider

      return (
        {
          [NETWORK_IDS.mainnet]: _ethereumFallbackProvider.rawProvider,
          [NETWORK_IDS.testnet]: _sepoliaFallbackProvider.rawProvider,
        }[networkId.value] || null
      )
    })

    const extendedProvider = computed<RawProvider | null>(
      () =>
        ({
          [NETWORK_IDS.mainnet]: _arbitrumFallbackProvider.rawProvider,
          [NETWORK_IDS.testnet]: _arbitrumSepoliaFallbackProvider.rawProvider,
        }[networkId.value] || null),
    )

    const isValidChain = computed<boolean>(() => {
      return (
        isAddingToken.value ||
        String(walletProvider.chainId) ===
          config.networks[networkId.value].chainId
      )
    })

    const isConnected = computed<boolean>(
      () => walletProvider.isConnected && hasConnectedProvider.value,
    )

    const address = computed<string>(() => walletProvider.selectedAddress)

    const erc1967ProxyContract = computed(() =>
      useContract(
        'ERC1967Proxy__factory',
        config.networks[networkId.value].contractAddressesMap[
          CONTRACT_IDS.erc1967Proxy
        ],
        defaultProvider,
      ),
    )

    const stEthContract = computed(() =>
      useContract(
        'ERC20__factory',
        config.networks[networkId.value].contractAddressesMap[
          CONTRACT_IDS.stEth
        ],
        defaultProvider,
      ),
    )

    const morContract = computed(() =>
      useContract(
        'ERC20__factory',
        config.networks[networkId.value].contractAddressesMap[CONTRACT_IDS.mor],
        extendedProvider,
      ),
    )

    const endpointContract = computed(() =>
      useContract(
        'Endpoint__factory',
        config.networks[networkId.value].contractAddressesMap[
          CONTRACT_IDS.endpoint
        ],
        defaultProvider,
      ),
    )

    // Actions
    const init = async () => {
      const providerDetector = new ProviderDetector()
      await providerDetector.init()

      providerDetector.addProvider({
        name: SUPPORTED_PROVIDERS.ethereumFallback,
        instance: config.networks[NETWORK_IDS.mainnet]
          .provider as unknown as RawProvider,
      })

      providerDetector.addProvider({
        name: SUPPORTED_PROVIDERS.sepoliaFallback,
        instance: config.networks[NETWORK_IDS.testnet]
          .provider as unknown as RawProvider,
      })

      providerDetector.addProvider({
        name: SUPPORTED_PROVIDERS.arbitrumFallback,
        instance: config.networks[NETWORK_IDS.mainnet]
          .extendedChainProvider as unknown as RawProvider,
      })

      providerDetector.addProvider({
        name: SUPPORTED_PROVIDERS.arbitrumSepoliaFallback,
        instance: config.networks[NETWORK_IDS.testnet]
          .extendedChainProvider as unknown as RawProvider,
      })

      await Promise.all([
        _ethereumFallbackProvider.init(
          SUPPORTED_PROXY_CONSTRUCTORS[SUPPORTED_PROVIDERS.ethereumFallback],
          { providerDetector: providerDetector },
        ),
        _sepoliaFallbackProvider.init(
          SUPPORTED_PROXY_CONSTRUCTORS[SUPPORTED_PROVIDERS.sepoliaFallback],
          { providerDetector: providerDetector },
        ),
        _arbitrumFallbackProvider.init(
          SUPPORTED_PROXY_CONSTRUCTORS[SUPPORTED_PROVIDERS.arbitrumFallback],
          { providerDetector: providerDetector },
        ),
        _arbitrumSepoliaFallbackProvider.init(
          SUPPORTED_PROXY_CONSTRUCTORS[
            SUPPORTED_PROVIDERS.arbitrumSepoliaFallback
          ],
          { providerDetector: providerDetector },
        ),
      ])

      if (providerDetector.providers.metamask)
        await walletProvider.init(
          SUPPORTED_PROXY_CONSTRUCTORS[SUPPORTED_PROVIDERS.metamask],
        )

      // store requires time for sync with vue-router
      await sleep(1000)
    }

    return {
      // State
      walletProvider,
      balances,
      isAddingToken,
      hasConnectedProvider,

      // Getters
      networkId,
      defaultProvider,
      isValidChain,
      isConnected,
      address,
      erc1967ProxyContract,
      stEthContract,
      morContract,
      endpointContract,

      // Actions
      init,
    }
  },
  { persist: { paths: ['hasConnectedProvider'] } },
)
