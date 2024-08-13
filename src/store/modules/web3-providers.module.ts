import { useContract, useProvider } from '@/composables'
import { CONTRACT_IDS, NETWORK_IDS } from '@/enums'
import { sleep } from '@/helpers'
import { useRouter, useRoute } from '@/router'
import { type BigNumber, type Provider, type InfoDashboardType } from '@/types'
import { config } from '@config'
import { providers } from 'ethers'
import { defineStore } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import { MAX_UINT_256 } from '@/const'

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

  const getUsersLastFullyDeployedProtocol = async (): Promise<void> => {
    const [l1DeployedPools, l2DeployedPools] = await Promise.all([
      l1FactoryContract.value.providerBased.value.getDeployedPools(
        String(_route.query.address),
        0,
        MAX_UINT_256,
      ),
      l2FactoryContract.value.providerBased.value.getDeployedPools(
        String(_route.query.address),
        0,
        MAX_UINT_256,
      ),
    ])

    let lastFullyL1DeployedPoolIdx = -1
    let lastFullyL2DeployedPoolIdx = -1
    for (let i = l1DeployedPools.length - 1; i >= 0; i--) {
      if (
        lastFullyL1DeployedPoolIdx !== -1 &&
        lastFullyL2DeployedPoolIdx !== -1
      )
        break

      for (let j = l2DeployedPools.length - 1; j >= 0; j--) {
        if (l1DeployedPools[i].protocol === l2DeployedPools[j].protocol) {
          lastFullyL1DeployedPoolIdx = i
          lastFullyL2DeployedPoolIdx = j
          break
        }
      }
    }

    if (
      lastFullyL1DeployedPoolIdx === -1 ||
      lastFullyL2DeployedPoolIdx === -1
    ) {
      return
    }

    dashboardInfo.name = l1DeployedPools[lastFullyL1DeployedPoolIdx].protocol
    dashboardInfo.distributionAddress =
      l1DeployedPools[lastFullyL1DeployedPoolIdx].distribution
    dashboardInfo.l1SenderAddress =
      l1DeployedPools[lastFullyL1DeployedPoolIdx].l1Sender
    dashboardInfo.l2MessageReceiverAddress =
      l2DeployedPools[lastFullyL2DeployedPoolIdx].l2MessageReceiver
    dashboardInfo.l2TokenReceiverAddress =
      l2DeployedPools[lastFullyL2DeployedPoolIdx].l2TokenReceiver
    dashboardInfo.tokenAddress =
      l2DeployedPools[lastFullyL2DeployedPoolIdx].mor20
  }

  watch(
    () => _route.query,
    () => {
      if (_route.query.address) {
        getUsersLastFullyDeployedProtocol()
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
