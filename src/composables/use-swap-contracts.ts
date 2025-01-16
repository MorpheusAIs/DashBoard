import { computed, Ref } from 'vue'
import { useContract } from '@/composables/use-contract'
import { SWAP_ASSETS } from '@/const'
import { SWAP_ASSETS_NAMES } from '@/enums'
import { V2_FACTORY_ADDRESSES, V2_ROUTER_ADDRESSES } from '@uniswap/sdk-core'
import { config } from '@config'
import { useExceptionContractsProvider } from '@/composables'

export function useSwapContracts(
  tokenInAddress: string,
  tokenOutAddress: string,
  pairAddress: Ref<string>,
) {
  const swapProvider = useExceptionContractsProvider('Swap')

  const tokenToSendContract = computed(() =>
    useContract('ERC20__factory', tokenInAddress, swapProvider.value),
  )

  const wethContract = computed(() =>
    useContract(
      'ERC20__factory',
      SWAP_ASSETS.find(({ symbol }) => symbol === SWAP_ASSETS_NAMES.WETH)
        ?.address ?? '',
      swapProvider.value,
    ),
  )

  const tokenToReceiveContract = computed(() =>
    useContract('ERC20__factory', tokenOutAddress, swapProvider.value),
  )

  const uniswapV2FactoryContract = computed(() =>
    useContract(
      'UniswapV2Factory__factory',
      V2_FACTORY_ADDRESSES[Number(config.chainsMap.Ethereum.chainId)],
      swapProvider.value,
    ),
  )

  const uniswapV2RouterContract = computed(() =>
    useContract(
      'UniswapV2Router__factory',
      V2_ROUTER_ADDRESSES[Number(config.chainsMap.Ethereum.chainId)],
      swapProvider.value,
    ),
  )

  const uniswapV2PairContract = computed(() =>
    useContract(
      'UniswapV2Pair__factory',
      pairAddress.value,
      swapProvider.value,
    ),
  )

  return {
    swapProvider,

    tokenToSendContract,
    tokenToReceiveContract,
    uniswapV2FactoryContract,
    uniswapV2PairContract,
    uniswapV2RouterContract,
    wethContract,
  }
}
