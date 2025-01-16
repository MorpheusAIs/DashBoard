import { useContract, useProvider } from '@/composables'
import { sleep, getUsersLastFullyDeployedProtocol } from '@/helpers'
import { useRouter, useRoute } from '@/router'
import { type BigNumber, type Provider, type InfoDashboardType } from '@/types'
import {
  config,
  EthereumChains,
  NetworkTypes,
  perChainDeployedContracts,
} from '@/config'
import { providers } from 'ethers'
import { defineStore } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import { errors } from '@/errors'
import get from 'lodash/get'
import { ROUTE_NAMES } from '@/enums'

enum BALANCE_CURRENCIES {
  depositToken = 'depositToken',
  rewardsToken = 'rewardsToken',
}

const STORE_NAME = 'web3-providers-store'

export const useWeb3ProvidersStore = defineStore(STORE_NAME, () => {
  const _router = reactive(useRouter())
  const _route = reactive(useRoute())

  // State
  const provider = reactive(useProvider())
  const dashboardDepositTokenAddress = ref('')
  const dashboardRewardTokenAddress = ref('')
  const rewardsTokenSymbol = ref('')
  const depositTokenSymbol = ref('')

  const dashboardInfo = reactive<InfoDashboardType.DashboardInfo>({
    name: '',
    distributionAddress: '',
    l1SenderAddress: '',
    l2MessageReceiverAddress: '',
    l2TokenReceiverAddress: '',
    tokenAddress: '',
  })

  const balances = reactive<Record<BALANCE_CURRENCIES, BigNumber | null>>({
    [BALANCE_CURRENCIES.depositToken]: null,
    [BALANCE_CURRENCIES.rewardsToken]: null,
  })

  const isAddingToken = ref(false)

  // Getters
  const networkType = computed<NetworkTypes>(() => {
    const { network } = _router.currentRoute.query

    return (network as NetworkTypes) || NetworkTypes.Mainnet
  })

  const currentNetworkTypeChains = computed(
    () => config.ethereumChainsTypes[networkType.value],
  )

  const allowedForCurrentRouteChains = computed(() => {
    return config.perPageAllowedNetworks[_route.name as ROUTE_NAMES]
  })

  const allowedForCurrentRouteChainsLimitedByNetworkType = computed(() => {
    if (!allowedForCurrentRouteChains.value) return []

    return currentNetworkTypeChains.value.filter(el =>
      allowedForCurrentRouteChains.value.includes(el),
    )
  })

  const isCurrentChainAllowed = computed(() =>
    allowedForCurrentRouteChainsLimitedByNetworkType.value.includes(
      provider.chainId as EthereumChains,
    ),
  )

  const selectedNetworkByType = computed(() => {
    return config.networksMap[networkType.value]
  })

  const providerEthProvider = computed(() => {
    return new providers.Web3Provider(
      provider.rawProvider as providers.ExternalProvider,
      'any',
    )
  })

  // ======================

  const l1Provider = computed<Provider>(() => {
    if (String(provider.chainId) === selectedNetworkByType.value.l1.chainId)
      return new providers.Web3Provider(
        provider.rawProvider as providers.ExternalProvider,
      )

    return selectedNetworkByType.value.l1.provider
  })

  const l2Provider = computed<Provider>(() => {
    if (String(provider.chainId) === selectedNetworkByType.value.l2.chainId)
      return new providers.Web3Provider(
        provider.rawProvider as providers.ExternalProvider,
      )

    return selectedNetworkByType.value.l2.provider
  })

  // ======================

  const isValidChain = computed<boolean>(() => {
    return (
      isAddingToken.value ||
      String(provider.chainId) === selectedNetworkByType.value.l1.chainId
    )
  })

  const isConnected = computed<boolean>(() => provider.isConnected)

  const address = computed<string>(() => provider.selectedAddress)

  const erc1967ProxyContract = computed(() => {
    const { address, targetChainId, fallbackProvider } = _pickContractDetails(
      config.ContractIds.erc1967Proxy,
    )

    return useContract(
      dashboardInfo.distributionAddress
        ? 'MOR1967__factory'
        : 'ERC1967Proxy__factory',
      dashboardInfo.distributionAddress || address,
      targetChainId === provider.chainId
        ? providerEthProvider
        : fallbackProvider!,
    )
  })

  const depositContract = computed(() => {
    const { address, targetChainId, fallbackProvider } = _pickContractDetails(
      config.ContractIds.stEth,
    )

    return useContract(
      'ERC20__factory',
      dashboardDepositTokenAddress.value || address,
      targetChainId === provider.chainId
        ? providerEthProvider
        : fallbackProvider!,
    )
  })

  const rewardsContract = computed(() => {
    const { address, targetChainId, fallbackProvider } = _pickContractDetails(
      config.ContractIds.mor,
    )

    return useContract(
      'ERC20__factory',
      dashboardRewardTokenAddress.value || address,
      targetChainId === provider.chainId
        ? providerEthProvider
        : fallbackProvider!,
    )
  })

  const endpointContract = computed(() => {
    const { address, targetChainId, fallbackProvider } = _pickContractDetails(
      config.ContractIds.endpoint,
    )

    return useContract(
      'Endpoint__factory',
      address,
      targetChainId === provider.chainId
        ? providerEthProvider
        : fallbackProvider!,
    )
  })

  const l1FactoryContract = computed(() => {
    const { address, targetChainId, fallbackProvider } = _pickContractDetails(
      config.ContractIds.l1Factory,
    )

    return useContract(
      'L1Factory__factory',
      address,
      targetChainId === provider.chainId
        ? providerEthProvider
        : fallbackProvider!,
    )
  })

  const l2FactoryContract = computed(() => {
    const { address, targetChainId, fallbackProvider } = _pickContractDetails(
      config.ContractIds.l2Factory,
    )

    return useContract(
      'L2Factory__factory',
      address,
      targetChainId === provider.chainId
        ? providerEthProvider
        : fallbackProvider!,
    )
  })

  const subnetFactoryContract = computed(() => {
    const { address, targetChainId, fallbackProvider } = _pickContractDetails(
      config.ContractIds.subnetFactory,
    )

    return useContract(
      'SubnetFactory__factory',
      address,
      targetChainId === provider.chainId
        ? providerEthProvider
        : fallbackProvider!,
    )
  })

  const buildersContractDetails = computed(() => {
    return _pickContractDetails(config.ContractIds.builders)
  })

  const buildersContract = computed(() => {
    const { address, targetChainId, fallbackProvider } =
      buildersContractDetails.value

    return useContract(
      'Builders__factory',
      address,
      targetChainId === provider.chainId
        ? providerEthProvider
        : fallbackProvider!,
    )
  })

  const _pickContractDetails = (
    contractId: keyof typeof perChainDeployedContracts,
  ) => {
    console.log('\n\n\n')
    console.log(`Picking ${contractId}`)
    const deployedSelectedContracts =
      config.perChainDeployedContracts[contractId]

    console.log('deployedSelectedContracts', deployedSelectedContracts)

    const currentChainContract = get(
      deployedSelectedContracts,
      provider.chainId,
      '',
    )

    console.log('currentNetworkTypeChains', currentNetworkTypeChains.value)
    console.log(
      'allowedForCurrentRouteChains',
      allowedForCurrentRouteChains.value,
    )
    console.log(
      'allowedForCurrentRouteChainsLimitedByNetworkType',
      allowedForCurrentRouteChainsLimitedByNetworkType.value,
    )
    console.log('currentChainContract', currentChainContract)

    const defaultForCurrentNetworkContract = Object.entries(
      deployedSelectedContracts,
    )
      .filter(([key]) =>
        currentNetworkTypeChains.value.includes(key as EthereumChains),
      )
      .find(([, value]) => Boolean(value))?.[1]

    console.log(
      'defaultForCurrentNetworkContract',
      defaultForCurrentNetworkContract,
    )

    const pickedForCurrentNetworkContract = Object.entries(
      deployedSelectedContracts,
    )
      .filter(([key]) =>
        allowedForCurrentRouteChainsLimitedByNetworkType.value.includes(
          key as EthereumChains,
        ),
      )
      .find(([, value]) => Boolean(value))?.[1]

    console.log(
      'pickedForCurrentNetworkContract',
      pickedForCurrentNetworkContract,
    )

    const resultedContract =
      ((isCurrentChainAllowed.value && currentChainContract) ||
        pickedForCurrentNetworkContract ||
        defaultForCurrentNetworkContract) ??
      ''

    console.log('resultedContract', resultedContract)

    const fallbackProviderForResultedContract = Object.entries(
      config.perChainFallbackProviders,
    ).find(([key]) => {
      return (
        Object.entries(deployedSelectedContracts).find(
          ([, contractAddress]) => {
            return resultedContract === contractAddress
          },
        )?.[0] === key
      )
    })

    console.log(
      'fallbackProviderForResultedContract',
      fallbackProviderForResultedContract,
    )

    console.log('\n\n\n')

    return {
      address: resultedContract,
      targetChainId: fallbackProviderForResultedContract?.[0] ?? '',
      fallbackProvider: fallbackProviderForResultedContract?.[1],
    }
  }

  const updateBalances = async () => {
    if (!provider.selectedAddress) throw new errors.UserAddressError()

    const [stEthValue, morValue] = await Promise.all([
      depositContract.value.providerBased.value.balanceOf(
        provider.selectedAddress,
      ),
      rewardsContract.value.providerBased.value.balanceOf(
        provider.selectedAddress,
      ),
    ])

    balances.depositToken = stEthValue
    balances.rewardsToken = morValue
  }

  // Actions
  const init = async () => {
    provider.init()

    // store requires time for sync with vue-router
    await sleep(1000)
  }

  watch(
    () => _route.query,
    async () => {
      if (_route.query.address) {
        const protocol = await getUsersLastFullyDeployedProtocol(
          String(_route.query.address),
          l1FactoryContract.value,
          l2FactoryContract.value,
        )
        if (!protocol) {
          return
        }
        dashboardInfo.name = protocol.name
        dashboardInfo.distributionAddress = protocol.distributionAddress
        dashboardInfo.tokenAddress = protocol.tokenAddress
        dashboardInfo.l1SenderAddress = protocol.l1SenderAddress
        dashboardInfo.l2MessageReceiverAddress =
          protocol.l2MessageReceiverAddress
        dashboardInfo.l2TokenReceiverAddress = protocol.l2TokenReceiverAddress
        return
      }
      dashboardInfo.name = ''
      dashboardInfo.distributionAddress = ''
      dashboardInfo.l1SenderAddress = ''
      dashboardInfo.l2MessageReceiverAddress = ''
      dashboardInfo.l2TokenReceiverAddress = ''
      dashboardInfo.tokenAddress = ''
    },
    {
      immediate: true,
    },
  )

  watch(
    dashboardInfo,
    async () => {
      if (!dashboardInfo.tokenAddress) {
        dashboardDepositTokenAddress.value = ''
        dashboardRewardTokenAddress.value = ''
        return
      }
      dashboardDepositTokenAddress.value =
        await erc1967ProxyContract.value.providerBased.value.depositToken()
      dashboardRewardTokenAddress.value = dashboardInfo.tokenAddress
    },
    { deep: true },
  )

  watch(
    [rewardsContract, depositContract],
    async () => {
      rewardsTokenSymbol.value =
        await rewardsContract.value.providerBased.value.symbol()
      depositTokenSymbol.value =
        await depositContract.value.providerBased.value.symbol()
    },
    { immediate: true },
  )

  return {
    // State
    provider,
    balances,
    isAddingToken,

    // Getters
    networkType,
    selectedNetworkByType,
    l1Provider: l1Provider,
    l2Provider: l2Provider,
    isValidChain: isValidChain,
    isConnected,
    address,
    erc1967ProxyContract,
    depositContract,
    rewardsContract,
    endpointContract,

    buildersContractDetails,
    buildersContract,

    l1FactoryContract,
    l2FactoryContract,
    subnetFactoryContract,
    rewardsTokenSymbol,
    depositTokenSymbol,

    dashboardInfo,
    // Actions
    updateBalances: updateBalances,
    init,
  }
})
