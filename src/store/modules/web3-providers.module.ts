import { useContract, useProvider } from '@/composables'
import { sleep, getUsersLastFullyDeployedProtocol } from '@/helpers'
import { useRouter, useRoute } from '@/router'
import { type BigNumber, type InfoDashboardType } from '@/types'
import {
  config,
  EthereumChains,
  getEthereumChainsName,
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

  // const currentNetworkTypeChains = computed(
  //   () => config.ethereumChainsTypes[networkType.value],
  // )

  const allowedForCurrentRouteChains = computed(() => {
    return config.perPageAllowedNetworks[_route.name as ROUTE_NAMES]
  })

  const getForCurrentRouteChainsLimitedByNetworkType = (
    networkType: NetworkTypes,
  ): EthereumChains[] => {
    if (!allowedForCurrentRouteChains.value) return []

    return config.ethereumChainsTypes[networkType].filter(el =>
      allowedForCurrentRouteChains.value.includes(el),
    )
  }

  const allowedForCurrentRouteChainsLimitedByNetworkType = computed(() => {
    return getForCurrentRouteChainsLimitedByNetworkType(networkType.value)

    // if (!allowedForCurrentRouteChains.value) return []
    //
    // return currentNetworkTypeChains.value.filter(el =>
    //   allowedForCurrentRouteChains.value.includes(el),
    // )
  })

  const isCurrentChainAllowed = computed(() =>
    allowedForCurrentRouteChainsLimitedByNetworkType.value.includes(
      provider.chainId as EthereumChains,
    ),
  )

  const wrappedEthProvider = computed(() => {
    return new providers.Web3Provider(
      provider.rawProvider as providers.ExternalProvider,
      'any',
    )
  })

  const isConnected = computed<boolean>(() => provider.isConnected)

  const address = computed<string>(() => provider.selectedAddress)

  const erc1967ProxyContractDetails = computed(() => {
    return _pickContractDetails(config.ContractIds.erc1967Proxy)
  })

  const erc1967ProxyContract = computed(() => {
    const { address, targetChainId, fallbackProvider } =
      erc1967ProxyContractDetails.value

    return useContract(
      dashboardInfo.distributionAddress
        ? 'MOR1967__factory'
        : 'ERC1967Proxy__factory',
      dashboardInfo.distributionAddress || address,
      targetChainId === provider.chainId
        ? wrappedEthProvider
        : fallbackProvider!,
    )
  })

  const depositContractDetails = computed(() => {
    return _pickContractDetails(config.ContractIds.stEth)
  })

  const depositContract = computed(() => {
    const { address, targetChainId, fallbackProvider } =
      depositContractDetails.value

    return useContract(
      'ERC20__factory',
      dashboardDepositTokenAddress.value || address,
      targetChainId === provider.chainId
        ? wrappedEthProvider
        : fallbackProvider!,
    )
  })

  const rewardsContractDetails = computed(() => {
    return _pickContractDetails(config.ContractIds.mor)
  })

  const rewardsContract = computed(() => {
    const { address, targetChainId, fallbackProvider } =
      rewardsContractDetails.value

    return useContract(
      'ERC20__factory',
      dashboardRewardTokenAddress.value || address,
      targetChainId === provider.chainId
        ? wrappedEthProvider
        : fallbackProvider!,
    )
  })

  const endpointContractDetails = computed(() => {
    return _pickContractDetails(config.ContractIds.endpoint)
  })

  const endpointContract = computed(() => {
    const { address, targetChainId, fallbackProvider } =
      endpointContractDetails.value

    return useContract(
      'Endpoint__factory',
      address,
      targetChainId === provider.chainId
        ? wrappedEthProvider
        : fallbackProvider!,
    )
  })

  const l1FactoryContractDetails = computed(() => {
    return _pickContractDetails(config.ContractIds.l1Factory)
  })

  const l1FactoryContract = computed(() => {
    const { address, targetChainId, fallbackProvider } =
      l1FactoryContractDetails.value

    return useContract(
      'L1Factory__factory',
      address,
      targetChainId === provider.chainId
        ? wrappedEthProvider
        : fallbackProvider!,
    )
  })

  const l2FactoryContractDetails = computed(() => {
    return _pickContractDetails(config.ContractIds.l2Factory)
  })

  const l2FactoryContract = computed(() => {
    const { address, targetChainId, fallbackProvider } =
      l2FactoryContractDetails.value

    return useContract(
      'L2Factory__factory',
      address,
      targetChainId === provider.chainId
        ? wrappedEthProvider
        : fallbackProvider!,
    )
  })

  const subnetFactoryContractDetails = computed(() => {
    return _pickContractDetails(config.ContractIds.subnetFactory)
  })

  const subnetFactoryContract = computed(() => {
    const { address, targetChainId, fallbackProvider } =
      subnetFactoryContractDetails.value

    return useContract(
      'SubnetFactory__factory',
      address,
      targetChainId === provider.chainId
        ? wrappedEthProvider
        : fallbackProvider!,
    )
  })

  const builderSubnetsContractDetails = computed(() => {
    return _pickContractDetails(config.ContractIds.builders)
  })

  const builderSubnetsContract = computed(() => {
    const { address, targetChainId, fallbackProvider } =
      builderSubnetsContractDetails.value

    return useContract(
      'BuilderSubnets__factory',
      address,
      targetChainId === provider.chainId
        ? wrappedEthProvider
        : fallbackProvider!,
    )
  })

  const feeConfigContractDetails = computed(() => {
    return _pickContractDetails(config.ContractIds.feeConfig)
  })

  const feeConfigContract = computed(() => {
    const { address, targetChainId, fallbackProvider } =
      feeConfigContractDetails.value

    return useContract(
      'FeeConfig__factory',
      address,
      targetChainId === provider.chainId
        ? wrappedEthProvider
        : fallbackProvider!,
    )
  })

  const _pickContractDetails = (
    contractId: keyof typeof perChainDeployedContracts,
  ) => {
    const deployedSelectedContracts =
      config.perChainDeployedContracts[contractId]

    const currentChainContract = get(
      deployedSelectedContracts,
      provider.chainId,
      '',
    )

    const defaultForCurrentNetworkContract = Object.entries(
      deployedSelectedContracts,
    )
      .filter(([key]) =>
        config.ethereumChainsTypes[networkType.value].includes(
          key as EthereumChains,
        ),
      )
      .find(([, value]) => Boolean(value))?.[1]

    const pickedForCurrentNetworkContract = Object.entries(
      deployedSelectedContracts,
    )
      .filter(([key]) =>
        allowedForCurrentRouteChainsLimitedByNetworkType.value.includes(
          key as EthereumChains,
        ),
      )
      .find(([, value]) => Boolean(value))?.[1]

    const resultedContract =
      ((isCurrentChainAllowed.value && currentChainContract) ||
        pickedForCurrentNetworkContract ||
        defaultForCurrentNetworkContract) ??
      ''

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

    const targetChainId = fallbackProviderForResultedContract?.[0] ?? ''
    const targetChainName = getEthereumChainsName(targetChainId)
    const explorerUrl: string =
      config.chainsMap[targetChainName].blockExplorerUrls?.[0] ?? ''

    return {
      address: resultedContract,
      targetChainId: targetChainId,
      fallbackProvider: fallbackProviderForResultedContract?.[1],
      explorerUrl,
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

    wrappedEthProvider,

    // Getters
    networkType,
    isConnected,
    address,

    allowedForCurrentRouteChainsLimitedByNetworkType,
    getForCurrentRouteChainsLimitedByNetworkType,

    erc1967ProxyContractDetails,
    erc1967ProxyContract,

    depositContractDetails,
    depositContract,

    rewardsContractDetails,
    rewardsContract,

    endpointContractDetails,
    endpointContract,

    l1FactoryContractDetails,
    l1FactoryContract: l1FactoryContract,

    l2FactoryContractDetails,
    l2FactoryContract: l2FactoryContract,

    subnetFactoryContractDetails,
    subnetFactoryContract,

    builderSubnetsContractDetails,
    builderSubnetsContract,

    feeConfigContractDetails,
    feeConfigContract,

    rewardsTokenSymbol,
    depositTokenSymbol,

    dashboardInfo,
    // Actions
    updateBalances: updateBalances,
    init,
  }
})
