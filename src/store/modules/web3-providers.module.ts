import { useContract, useProvider } from '@/composables'
import { CONTRACT_IDS, NETWORK_IDS } from '@/enums'
import { sleep, getUsersLastFullyDeployedProtocol } from '@/helpers'
import { useRouter, useRoute } from '@/router'
import { type BigNumber, type Provider, type InfoDashboardType } from '@/types'
import { config } from '@config'
import { providers } from 'ethers'
import { defineStore } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'

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
  const networkId = computed<NETWORK_IDS>(() => {
    const { network } = _router.currentRoute.query
    return (network as NETWORK_IDS) || NETWORK_IDS.mainnet
  })

  const l1Provider = computed<Provider>(() => {
    if (
      String(provider.chainId) ===
      config.networksMap[networkId.value].l1.chainId
    )
      return new providers.Web3Provider(
        provider.rawProvider as providers.ExternalProvider,
      )

    return config.networksMap[networkId.value].l1.provider
  })

  const l2Provider = computed<Provider>(() => {
    if (
      String(provider.chainId) ===
      config.networksMap[networkId.value].l2.chainId
    )
      return new providers.Web3Provider(
        provider.rawProvider as providers.ExternalProvider,
      )

    return config.networksMap[networkId.value].l2.provider
  })

  const isValidChain = computed<boolean>(() => {
    return (
      isAddingToken.value ||
      String(provider.chainId) ===
        config.networksMap[networkId.value].l1.chainId
    )
  })

  const isConnected = computed<boolean>(() => provider.isConnected)

  const address = computed<string>(() => provider.selectedAddress)

  const erc1967ProxyContract = computed(() => {
    return useContract(
      dashboardInfo.distributionAddress
        ? 'MOR1967__factory'
        : 'ERC1967Proxy__factory',
      dashboardInfo.distributionAddress ||
        config.networksMap[networkId.value].contractAddressesMap[
          CONTRACT_IDS.erc1967Proxy
        ],
      l1Provider.value,
    )
  })

  const depositContract = computed(() =>
    useContract(
      'ERC20__factory',
      dashboardDepositTokenAddress.value ||
        config.networksMap[networkId.value].contractAddressesMap[
          CONTRACT_IDS.stEth
        ],
      l1Provider.value,
    ),
  )

  const rewardsContract = computed(() =>
    useContract(
      'ERC20__factory',
      dashboardRewardTokenAddress.value ||
        config.networksMap[networkId.value].contractAddressesMap[
          CONTRACT_IDS.mor
        ],
      l2Provider.value,
    ),
  )

  const endpointContract = computed(() =>
    useContract(
      'Endpoint__factory',
      config.networksMap[networkId.value].contractAddressesMap[
        CONTRACT_IDS.endpoint
      ],
      l1Provider.value,
    ),
  )

  const l1FactoryContract = computed(() =>
    useContract(
      'L1Factory__factory',
      config.networksMap[networkId.value].contractAddressesMap[
        CONTRACT_IDS.l1Factory
      ],
      l1Provider.value,
    ),
  )

  const l2FactoryContract = computed(() =>
    useContract(
      'L2Factory__factory',
      config.networksMap[networkId.value].contractAddressesMap[
        CONTRACT_IDS.l2Factory
      ],
      l2Provider.value,
    ),
  )

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
    networkId,
    l1Provider,
    l2Provider,
    isValidChain,
    isConnected,
    address,
    erc1967ProxyContract,
    depositContract,
    rewardsContract,
    endpointContract,
    l1FactoryContract,
    l2FactoryContract,
    rewardsTokenSymbol,
    depositTokenSymbol,

    dashboardInfo,
    // Actions
    init,
  }
})
