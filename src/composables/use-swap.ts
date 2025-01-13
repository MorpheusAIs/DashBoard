import { ref, Ref, watch } from 'vue'
import {
  CurrencyAmount,
  Percent,
  Token,
  TradeType,
  V2_ROUTER_ADDRESSES,
} from '@uniswap/sdk-core'
import { Pair, Route, Trade } from '@uniswap/v2-sdk'
import { ethers } from 'ethers'
import { useWeb3ProvidersStore } from '@/store'
import { bus, BUS_EVENTS, ErrorHandler, getEthExplorerTxUrl } from '@/helpers'
import { Time } from '@distributedlab/tools'
import { MAX_UINT_256 } from '@/const'
import { ETHEREUM_CHAIN_IDS } from '@/enums'
import { config } from '@config'
import { useI18n, useSwapContracts } from '@/composables'

const AVERAGE_GAS_USED_FOR_SWAP_TX = '150292' // gas units
const SLIPPAGE = '1000'

// TODO: REFACTOR
export function useSwap(
  tokenInAddress: string,
  tokenOutAddress: string,
  tokenInValue: Ref<string>,
) {
  const web3ProvidersStore = useWeb3ProvidersStore()
  const { t } = useI18n()

  const tokenIn = ref<Token | null>(null)
  const tokenOut = ref<Token | null>(null)
  const pair = ref<Pair | null>(null)
  const estimatedTokenOutAmount = ref<string>('0')
  const pairAddress = ref('')
  const estimatedGasCost = ref('0')

  const {
    tokenToSendContract,
    tokenToReceiveContract,
    uniswapV2FactoryContract,
    uniswapV2PairContract,
    uniswapV2RouterContract,
    wethContract,
  } = useSwapContracts(tokenInAddress, tokenOutAddress, pairAddress)

  const loadTokensAndPair = async () => {
    pairAddress.value =
      await uniswapV2FactoryContract.value.providerBased.value.getPair(
        tokenInAddress,
        tokenOutAddress,
      )

    const [tokenInDecimals, tokenOutDecimals] = await Promise.all([
      tokenToSendContract.value.providerBased.value.decimals(),
      tokenToReceiveContract.value.providerBased.value.decimals(),
    ])

    const [inToken, outToken] = [
      new Token(
        Number(ETHEREUM_CHAIN_IDS.ethereum),
        tokenInAddress,
        tokenInDecimals,
      ),
      new Token(
        Number(ETHEREUM_CHAIN_IDS.ethereum),
        tokenOutAddress,
        tokenOutDecimals,
      ),
    ]
    tokenIn.value = inToken
    tokenOut.value = outToken

    if (pairAddress.value === ethers.constants.AddressZero) {
      return
    }

    const [reserve0, reserve1] =
      await uniswapV2PairContract.value.providerBased.value.getReserves()

    pair.value = new Pair(
      CurrencyAmount.fromRawAmount(inToken, reserve0.toString()),
      CurrencyAmount.fromRawAmount(outToken, reserve1.toString()),
    )
  }

  const calculateTrade = async () => {
    if (!parseFloat(tokenInValue.value)) {
      estimatedGasCost.value = '0'
      estimatedTokenOutAmount.value = '0'
      return
    }
    await estimateGasCost()

    if (!tokenIn.value || !tokenOut.value) {
      return
    }

    const tokenInDecimals = tokenIn.value.decimals
    const tokenInAmountInWei = ethers.utils.parseUnits(
      tokenInValue.value || '0',
      tokenInDecimals,
    )

    const wethTokenDecimals =
      await wethContract.value.providerBased.value.decimals()
    const wethToken = new Token(
      1,
      wethContract.value.providerBased.value.address,
      wethTokenDecimals,
    )

    if (
      tokenInAddress.toLowerCase() ===
      wethContract.value.providerBased.value.address.toLowerCase()
    ) {
      const route = new Route(
        [pair.value! as Pair],
        tokenIn.value,
        tokenOut.value!,
      )
      const tradeInstance = new Trade(
        route,
        CurrencyAmount.fromRawAmount(
          tokenIn.value,
          tokenInAmountInWei.toString(),
        ),
        TradeType.EXACT_INPUT,
      )

      estimatedTokenOutAmount.value = ethers.utils.formatUnits(
        tradeInstance.outputAmount.quotient.toString(),
        tokenOut.value.decimals,
      )
      return
    }

    pairAddress.value =
      await uniswapV2FactoryContract.value.providerBased.value.getPair(
        tokenInAddress,
        wethContract.value.providerBased.value.address,
      )

    const [reserveTokenIn, reserveWETH] =
      await uniswapV2PairContract.value.providerBased.value.getReserves()

    const pair1 = new Pair(
      CurrencyAmount.fromRawAmount(tokenIn.value, reserveTokenIn.toString()),
      CurrencyAmount.fromRawAmount(wethToken, reserveWETH.toString()),
    )

    pairAddress.value =
      await uniswapV2FactoryContract.value.providerBased.value.getPair(
        wethContract.value.providerBased.value.address,
        tokenOutAddress,
      )

    const [reserve0, reserve1] =
      await uniswapV2PairContract.value.providerBased.value.getReserves()

    const pair2 = new Pair(
      CurrencyAmount.fromRawAmount(wethToken, reserve1.toString()),
      CurrencyAmount.fromRawAmount(tokenOut.value, reserve0.toString()),
    )

    const route = new Route([pair1, pair2], tokenIn.value, tokenOut.value!)

    const tradeInstance = new Trade(
      route,
      CurrencyAmount.fromRawAmount(
        tokenIn.value,
        tokenInAmountInWei.toString(),
      ),
      TradeType.EXACT_INPUT,
    )

    estimatedTokenOutAmount.value = ethers.utils.formatUnits(
      tradeInstance.outputAmount.quotient.toString(),
      tokenOut.value.decimals,
    )
  }

  const estimateApprovals = async () => {
    let estimation = ethers.BigNumber.from(0)

    const allowance = await wethContract.value.signerBased.value.allowance(
      web3ProvidersStore.address,
      V2_ROUTER_ADDRESSES[1],
    )

    if (allowance.lt(MAX_UINT_256)) {
      estimation =
        await wethContract.value.signerBased.value.estimateGas.approve(
          V2_ROUTER_ADDRESSES[1],
          MAX_UINT_256,
        )
    }

    if (
      tokenInAddress.toString() ===
      wethContract.value.providerBased.value.address.toString()
    ) {
      return estimation
    }

    const tokenToSendAllowance =
      await tokenToSendContract.value.signerBased.value.allowance(
        web3ProvidersStore.address,
        V2_ROUTER_ADDRESSES[1],
      )

    if (tokenToSendAllowance.gte(MAX_UINT_256)) {
      return estimation
    }

    const tokenToSendGasEstimate =
      await tokenToSendContract.value.signerBased.value.estimateGas.approve(
        V2_ROUTER_ADDRESSES[1],
        MAX_UINT_256,
      )

    return estimation.add(tokenToSendGasEstimate)
  }

  const estimateGasPriceForSwaps = async () => {
    const gasPrice = await web3ProvidersStore.l1Provider.getGasPrice()

    const txPrice = gasPrice.mul(AVERAGE_GAS_USED_FOR_SWAP_TX)

    return tokenInAddress.toString() ===
      wethContract.value.providerBased.value.address.toString()
      ? txPrice
      : txPrice.mul(2)
  }

  const estimateGasCost = async () => {
    try {
      const estimatedApprovals = await estimateApprovals()
      const estimatedSwaps = await estimateGasPriceForSwaps()
      estimatedGasCost.value = ethers.utils.formatEther(
        estimatedApprovals.add(estimatedSwaps),
      )
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
      estimatedGasCost.value = ethers.BigNumber.from(0).toString()
    }
  }

  const executeTrade = async () => {
    if (!tokenIn.value || !tokenOut.value) return
    if (tokenInAddress === wethContract.value.providerBased.value.address) {
      await performSwap(
        tokenIn.value!,
        tokenOut.value!,
        CurrencyAmount.fromRawAmount(
          tokenIn.value!,
          ethers.utils
            .parseUnits(tokenInValue.value, tokenIn.value.decimals)
            .toString(),
        ),
      )
      await web3ProvidersStore.updateBalances()
      return
    }
    await executeMultiSwap()
    await web3ProvidersStore.updateBalances()
  }

  const waitForTx = async (tx: ethers.ContractTransaction) => {
    const explorerTxUrl = getEthExplorerTxUrl(
      config.networksMap[web3ProvidersStore.networkId].l1.explorerUrl,
      tx.hash,
    )
    bus.emit(BUS_EVENTS.info, t('use-swap.tx-sent-message', { explorerTxUrl }))

    await tx.wait()

    bus.emit(
      BUS_EVENTS.success,
      t('use-swap.success-message', { explorerTxUrl }),
    )
  }

  const performSwap = async (
    fromToken: Token,
    toToken: Token,
    amountIn: CurrencyAmount<Token>,
  ) => {
    const slippageTolerance = new Percent(SLIPPAGE, '10000')

    const sentTokenContract =
      fromToken.address.toLowerCase() ===
      wethContract.value.providerBased.value.address.toLowerCase()
        ? wethContract.value.signerBased.value
        : tokenToSendContract.value.signerBased.value

    const balance = await sentTokenContract.balanceOf(
      web3ProvidersStore.address,
    )

    if (balance.lt(amountIn.quotient.toString())) {
      amountIn = CurrencyAmount.fromRawAmount(fromToken, balance.toString())
    }

    const allowance = await sentTokenContract.allowance(
      web3ProvidersStore.address,
      V2_ROUTER_ADDRESSES[Number(ETHEREUM_CHAIN_IDS.ethereum)],
    )
    if (allowance.lt(amountIn.quotient.toString())) {
      const tx = await sentTokenContract.approve(
        V2_ROUTER_ADDRESSES[Number(ETHEREUM_CHAIN_IDS.ethereum)],
        amountIn.quotient.toString(),
      )
      await waitForTx(tx)
    }

    pairAddress.value =
      await uniswapV2FactoryContract.value.providerBased.value.getPair(
        fromToken.address,
        toToken.address,
      )

    const [reserve0, reserve1] =
      await uniswapV2PairContract.value.providerBased.value.getReserves()

    const swapPair = new Pair(
      CurrencyAmount.fromRawAmount(fromToken, reserve0.toString()),
      CurrencyAmount.fromRawAmount(toToken, reserve1.toString()),
    )

    const tradeInstance = new Trade(
      new Route([swapPair!], fromToken, toToken),
      amountIn,
      TradeType.EXACT_INPUT,
    )

    const amountOutMin = tradeInstance
      .minimumAmountOut(slippageTolerance)
      .quotient.toString()

    const tx =
      // eslint-disable-next-line max-len
      await uniswapV2RouterContract.value.signerBased.value.swapExactTokensForTokens(
        amountIn.quotient.toString(),
        amountOutMin,
        [fromToken.address, toToken.address],
        web3ProvidersStore.address,
        new Time().add(20, 'minutes').timestamp,
      )

    await waitForTx(tx)

    return ethers.utils.formatUnits(
      tradeInstance.outputAmount.quotient.toString(),
      toToken.decimals,
    )
  }

  const executeMultiSwap = async () => {
    if (!tokenIn.value) return

    const tokenInDecimals = tokenIn.value.decimals
    const tokenInAmount = ethers.utils.parseUnits(
      tokenInValue.value,
      tokenInDecimals,
    )
    const currencyAmountIn = CurrencyAmount.fromRawAmount(
      tokenIn.value,
      tokenInAmount.toString(),
    )

    const wethDecimals = await wethContract.value.providerBased.value.decimals()

    const wethToken = new Token(
      Number(ETHEREUM_CHAIN_IDS.ethereum),
      wethContract.value.providerBased.value.address,
      wethDecimals,
    )

    const amountOutWETH = await performSwap(
      tokenIn.value,
      wethToken,
      currencyAmountIn,
    )

    const tokenToReceiveDecimals =
      await tokenToReceiveContract.value.providerBased.value.decimals()

    const stEthToken = new Token(
      Number(ETHEREUM_CHAIN_IDS.ethereum),
      tokenToReceiveContract.value.providerBased.value.address,
      tokenToReceiveDecimals,
    )

    const wethAmountIn = CurrencyAmount.fromRawAmount(
      wethToken,
      ethers.utils.parseUnits(amountOutWETH, 'ether').toString(),
    )

    return performSwap(wethToken, stEthToken, wethAmountIn)
  }

  const init = async () => {
    await loadTokensAndPair()
    await calculateTrade()
  }

  watch(tokenInValue, init, { immediate: true })

  return {
    estimatedTokenOutAmount,
    estimatedGasCost,

    executeTrade,
  }
}
