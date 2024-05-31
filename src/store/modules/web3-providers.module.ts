import { useContract, useProvider } from '@/composables'
import { CONTRACT_IDS, NETWORK_IDS } from '@/enums'
import { sleep } from '@/helpers'
import { useRouter } from '@/router'
import { type BigNumber, type Provider } from '@/types'
import { config } from '@config'
import { providers } from 'ethers'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

enum BALANCE_CURRENCIES {
  stEth = 'stEth',
  mor = 'mor',
}

const STORE_NAME = 'web3-providers-store'

export const useWeb3ProvidersStore = defineStore(STORE_NAME, () => {
  const _router = reactive(useRouter())

  // State
  const provider = reactive(useProvider())

  const balances = reactive<Record<BALANCE_CURRENCIES, BigNumber | null>>({
    [BALANCE_CURRENCIES.stEth]: null,
    [BALANCE_CURRENCIES.mor]: null,
  })

  const isAddingToken = ref(false)

  // Getters
  const networkId = computed<NETWORK_IDS>(() => {
    const { network } = _router.currentRoute.query
    return network as NETWORK_IDS
  })

  const defaultProvider = computed<Provider>(() => {
    if (String(provider.chainId) === config.networks[networkId.value].chainId)
      return new providers.Web3Provider(
        provider.rawProvider as providers.ExternalProvider,
      )

    return config.networks[networkId.value].provider
  })

  const extendedProvider = computed<Provider>(() => {
    if (
      String(provider.chainId) ===
      config.networks[networkId.value].extendedChainId
    )
      return new providers.Web3Provider(
        provider.rawProvider as providers.ExternalProvider,
      )

    return config.networks[networkId.value].extendedChainProvider
  })

  const isValidChain = computed<boolean>(() => {
    return (
      isAddingToken.value ||
      String(provider.chainId) === config.networks[networkId.value].chainId
    )
  })

  const isConnected = computed<boolean>(() => provider.isConnected)

  const address = computed<string>(() => provider.selectedAddress)

  const erc1967ProxyContract = computed(() =>
    useContract(
      'ERC1967Proxy__factory',
      config.networks[networkId.value].contractAddressesMap[
        CONTRACT_IDS.erc1967Proxy
      ],
      defaultProvider.value,
    ),
  )

  const stEthContract = computed(() =>
    useContract(
      'ERC20__factory',
      config.networks[networkId.value].contractAddressesMap[CONTRACT_IDS.stEth],
      defaultProvider.value,
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
      defaultProvider.value,
    ),
  )

  const l1FactoryContract = computed(() =>
    useContract(
      'L1Factory__factory',
      config.networks[networkId.value].contractAddressesMap[
        CONTRACT_IDS.l1Factory
      ],
      defaultProvider,
    ),
  )

  const l2FactoryContract = computed(() =>
    useContract(
      'L2Factory__factory',
      config.networks[networkId.value].contractAddressesMap[
        CONTRACT_IDS.l2Factory
      ],
      extendedProvider,
    ),
  )

  // Actions
  const init = async () => {
    provider.init()

    // store requires time for sync with vue-router
    await sleep(1000)
  }

  return {
    // State
    provider,
    balances,
    isAddingToken,

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
    l1FactoryContract,
    l2FactoryContract,

    // Actions
    init,
  }
})
