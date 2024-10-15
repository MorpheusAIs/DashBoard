import { computed, ref, Ref, watch } from 'vue'
import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core'
import {
  computePoolAddress,
  FeeAmount,
  Pool,
  Route,
  SwapOptions,
  SwapRouter,
  Trade,
} from '@uniswap/v3-sdk'
import { BigNumber, ethers } from 'ethers'
import { useWeb3ProvidersStore } from '@/store'
import { useContract } from '@/composables/use-contract'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'

const SWAP_ABI = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenIn',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'tokenOut',
            type: 'address',
          },
          {
            internalType: 'uint24',
            name: 'fee',
            type: 'uint24',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'deadline',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amountIn',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amountOutMinimum',
            type: 'uint256',
          },
          {
            internalType: 'uint160',
            name: 'sqrtPriceLimitX96',
            type: 'uint160',
          },
        ],
        internalType: 'struct ISwapRouter.ExactInputSingleParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'exactInputSingle',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
]

//otsyuda
const SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
// const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'

export function useSwap(
  tokenInAddress: string,
  tokenOutAddress: string,
  tokenInValue: Ref<string>,
) {
  tokenInAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
  tokenOutAddress = '0x4c9edd5852cd905f086c759e8383e09bff1e68b3'
  const web3ProvidersStore = useWeb3ProvidersStore()
  const estimatedTokenOutAmount = ref('')
  const estimatedFee = ref('')
  const tokenIn = ref<Token>(null)
  const tokenOut = ref<Token>(null)

  const erc20TokenIn = computed(() =>
    useContract(
      'ERC20__factory',
      tokenInAddress,
      web3ProvidersStore.l1Provider,
    ),
  )

  const erc20TokenOut = computed(() =>
    useContract(
      'ERC20__factory',
      tokenOutAddress,
      web3ProvidersStore.l1Provider,
    ),
  )

  function fromReadableAmount(amount: number, decimals: number): BigNumber {
    return ethers.utils.parseUnits(amount.toString(), decimals)
  }

  const loadToken = async (isTokenIn: boolean) => {
    const contract = isTokenIn ? erc20TokenIn.value : erc20TokenOut.value
    const [dec, symbol, name] = await Promise.all([
      contract.providerBased.value.decimals(),
      contract.providerBased.value.symbol(),
      contract.providerBased.value.name(),
    ])
    const token = new Token(
      Number(web3ProvidersStore.provider.chainId),
      contract.providerBased.value.address,
      dec,
      symbol,
      name,
    )
    if (isTokenIn) {
      tokenIn.value = token
      return
    }
    tokenOut.value = token
  }

  const loadTokens = async () =>
    Promise.all([loadToken(true), loadToken(false)])

  async function getPoolInfo(): Promise<PoolInfo> {
    const currentPoolAddress = computePoolAddress({
      factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
      tokenA: tokenIn.value,
      tokenB: tokenOut.value,
      fee: FeeAmount.MEDIUM,
      chainId: 1,
    })

    const poolContract = new ethers.Contract(
      currentPoolAddress,
      IUniswapV3PoolABI.abi,
      web3ProvidersStore.l1Provider,
    )

    const [token0, token1, fee, tickSpacing, liquidity, slot0] =
      await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.tickSpacing(),
        poolContract.liquidity(),
        poolContract.slot0(),
      ])

    return {
      token0,
      token1,
      fee,
      tickSpacing,
      liquidity,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
    }
  }

  const estimateOutputQuote = async () => {
    await loadTokens()
    //
    // const amountIn = fromReadableAmount(
    //   parseFloat(tokenInValue.value || '0'),
    //   tokenIn.value.decimals,
    // )
    //
    // const poolInfo = await getPoolInfo()
    // console.log(poolInfo, 'getPoolInfo')
    //
    // const pool = new Pool(
    //   tokenIn.value,
    //   tokenOut.value,
    //   FeeAmount.HIGH,
    //   poolInfo.sqrtPriceX96.toString(),
    //   poolInfo.liquidity.toString(),
    //   poolInfo.tick,
    // )

    // const swapRoute = new Route([pool], tokenIn.value, tokenOut.value)
    //
    // const { calldata } = await SwapQuoter.quoteCallParameters(
    //   swapRoute,
    //   CurrencyAmount.fromRawAmount(tokenIn.value, amountIn.toString()),
    //   TradeType.EXACT_INPUT,
    //   { useQuoterV2: false },
    // )
    //
    // const quoteCallReturnData = await web3ProvidersStore.l1Provider.call({
    //   to: QUOTER_CONTRACT_ADDRESS,
    //   data: calldata,
    // })
    //
    // console.log(quoteCallReturnData, 'quoteCallReturnData')
    //
    // const decodedAmountOut = ethers.utils.defaultAbiCoder.decode(
    //   ['uint256'],
    //   quoteCallReturnData,
    // )
    // estimatedTokenOutAmount.value = decodedAmountOut[0].toString()

    // TODO: 1
    const swapRouterContract = new ethers.Contract(
      SWAP_ROUTER_ADDRESS,
      SWAP_ABI,
      web3ProvidersStore.l1Provider,
    )
    // console.log(poolInfo.liquidity, 'poolInfo.liquidity')
    // const quotedAmountOut =
    //   await swapRouterContract.callStatic.exactInputSingle([
    //     tokenInAddress,
    //     tokenOutAddress,
    //     FeeAmount.HIGH,
    //     web3ProvidersStore.address,
    //     Math.floor(Date.now() / 1000) + 60 * 20,
    //     '1000000000',
    //     0,
    //     BigNumber.from('0'),
    //   ])
    // console.log(quotedAmountOut, 'quotedAmountOut')

    const calldata = swapRouterContract.interface.encodeFunctionData(
      'exactInputSingle',
      [
        [
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          '0x86d97a0c0cb9bf206007674144e28a8e9c4593f8',
          10000,
          '0xae90497b67673916b6cdf5a2796358d17b92bcc3',
          BigNumber.from('0x670cf162'),
          BigNumber.from('0x00b1a2bc2ec50000'),
          0,
          BigNumber.from('0'),
        ],
      ],
    )

    const tx = {
      to: SWAP_ROUTER_ADDRESS,
      data: calldata,
      from: '0xAe90497b67673916b6CDf5a2796358D17B92bCC3',
    }

    const res = await web3ProvidersStore.l1Provider.call(tx, 20963181)
    // eslint-disable-next-line
    console.log(res)
  }

  const calculateGasFees = async () => {
    const { maxFeePerGas, maxPriorityFeePerGas } =
      await web3ProvidersStore.l1Provider.getFeeData()

    return {
      maxFeePerGas: maxFeePerGas?.toBigInt(),
      maxPriorityFeePerGas: maxPriorityFeePerGas?.toBigInt(),
    }
  }

  const estimateGasFee = async () => {
    const tx = await createSwapTx()

    const gasEstimate = await web3ProvidersStore.l1Provider.estimateGas(tx)
    const { maxFeePerGas } = await calculateGasFees()
    estimatedFee.value = ethers.utils.formatEther(gasEstimate.mul(maxFeePerGas))
  }

  const createSwapTx = async () => {
    await loadTokens()

    const amountIn = fromReadableAmount(
      parseFloat(tokenInValue.value || '0'),
      tokenIn.value.decimals,
    )

    const poolInfo = await getPoolInfo()

    const pool = new Pool(
      tokenIn.value,
      tokenOut.value,
      FeeAmount.HIGH,
      poolInfo.sqrtPriceX96.toString(),
      poolInfo.liquidity.toString(),
      poolInfo.tick,
    )

    const swapRoute = new Route([pool], tokenIn.value, tokenOut.value)

    const uncheckedTrade = Trade.createUncheckedTrade({
      route: swapRoute,
      inputAmount: CurrencyAmount.fromRawAmount(
        tokenIn.value,
        amountIn.toString(),
      ),
      outputAmount: CurrencyAmount.fromRawAmount(
        tokenOut.value,
        // TODO: FIX
        // estimatedTokenOutAmount.value,
        amountIn.toString(),
      ),
      tradeType: TradeType.EXACT_INPUT,
    })

    const options: SwapOptions = {
      slippageTolerance: new Percent(50, 10_000), // 0.50%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes
      recipient: web3ProvidersStore.address,
    }

    const methodParameters = SwapRouter.swapCallParameters(
      [uncheckedTrade],
      options,
    )

    const { maxPriorityFeePerGas, maxFeePerGas } = await calculateGasFees()

    const tx = {
      to: SWAP_ROUTER_ADDRESS,
      data: methodParameters.calldata,
      maxFeePerGas: maxFeePerGas,
      maxPriorityFeePerGas: maxPriorityFeePerGas,
    }

    return tx
  }

  const executeTrade = async () => {
    const tx = await createSwapTx()

    const provider = new ethers.providers.Web3Provider(
      web3ProvidersStore.provider.rawProvider,
    )
    const signer = await provider.getSigner()
    return signer.sendTransaction(tx)
  }

  watch(tokenInValue, estimateOutputQuote, { immediate: true })

  return {
    executeTrade,
    estimatedTokenOutAmount,
    estimatedFee,
    estimateOutputQuote,
    estimateGasFee,
  }
}
