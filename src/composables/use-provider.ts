import { CHAINS_NETWORK_CONFIGS_MAP } from '@/const'
import { SUPPORTED_PROVIDERS } from '@/enums'
import { errors } from '@/errors'
import { sleep } from '@/helpers'
// TODO: remove after update type 'Chain' of @distributedlab/w3p
import { type Web3ProviderType } from '@/types'
import {
  CHAIN_TYPES,
  FallbackEvmProvider,
  Provider,
  ProviderDetector,
  MetamaskProvider,
  createProvider,
  // TODO: remove after update type 'Chain' of @distributedlab/w3p
  type Chain as ChainW3P,
  type ChainId,
  type CreateProviderOpts,
  type ProviderInstance,
  type ProviderProxyConstructor,
  type RawProvider,
  type TransactionResponse,
  type TxRequestBody,
} from '@distributedlab/w3p'
import {
  computed,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  type Ref,
  type UnwrapRef,
} from 'vue'

// TODO: required keys
const SUPPORTED_PROXY_CONSTRUCTORS: Record<
  SUPPORTED_PROVIDERS,
  ProviderProxyConstructor
> = {
  [SUPPORTED_PROVIDERS.Fallback]: FallbackEvmProvider,
  [SUPPORTED_PROVIDERS.Metamask]: MetamaskProvider,
}

export interface IUseProvider {
  selectedAddress: Ref<string>
  selectedProvider: Ref<SUPPORTED_PROVIDERS | null>
  rawProvider: Ref<RawProvider | null>
  chainId: Ref<ChainId | null>

  isChainSelecting: Ref<boolean>
  isConnected: Ref<boolean>
  isConnecting: Ref<boolean>

  connect: () => Promise<void>
  disconnect: () => Promise<void>
  addChain: (chain: Web3ProviderType.Chain) => Promise<void>
  addProvider: (provider: ProviderInstance) => void
  switchChain: (chainId: ChainId) => Promise<void>
  selectChain: (chainId: ChainId) => Promise<void>
  selectProvider: (supportedProvider: SUPPORTED_PROVIDERS) => Promise<void>

  // TODO: to discuss: chain as arg
  getAddressUrl: (chain: Web3ProviderType.Chain, address: string) => string

  getHashFromTxResponse: (txResponse: TransactionResponse) => string

  // TODO: to discuss: chain as arg
  getTxUrl: (chain: Web3ProviderType.Chain, txHash: string) => string

  signAndSendTx: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>
  signMessage: (message: string) => Promise<string | null>

  init: <T extends keyof Record<string, string>>(
    providerProxyConstructor: ProviderProxyConstructor,
    createProviderOpts?: CreateProviderOpts<T>,
  ) => Promise<void>
}

type ProviderState = {
  selectedAddress: UnwrapRef<IUseProvider['selectedAddress']>
  selectedProvider: UnwrapRef<IUseProvider['selectedProvider']>
  rawProvider: UnwrapRef<IUseProvider['rawProvider']>
  chainId: UnwrapRef<IUseProvider['chainId']>
  isConnected: UnwrapRef<IUseProvider['isConnected']>
}

export const useProvider = (): IUseProvider => {
  type I = IUseProvider
  let _provider: Provider | null = null

  const _providerReactiveState = reactive<ProviderState>({
    selectedAddress: '',
    selectedProvider: null,
    rawProvider: null,
    chainId: '',
    isConnected: false,
  })

  const _updateProviderState = (): void => {
    _providerReactiveState.selectedAddress = _provider?.address || ''
    _providerReactiveState.selectedProvider =
      (_provider?.providerType as unknown as SUPPORTED_PROVIDERS) || null
    _providerReactiveState.rawProvider = _provider?.rawProvider || null
    _providerReactiveState.chainId = _provider?.chainId
      ? String(_provider?.chainId)
      : ''
    _providerReactiveState.isConnected = _provider?.isConnected || false
  }

  const isConnecting: I['isConnecting'] = ref(false)
  const connect: I['connect'] = async () => {
    if (!_provider?.connect) throw new errors.ProviderMethodNotFound()

    isConnecting.value = true

    try {
      await _provider.connect()
    } finally {
      isConnecting.value = false
    }
  }

  const disconnect: I['disconnect'] = async () => {
    if (!_provider?.disconnect) throw new errors.ProviderMethodNotFound()
    await _provider.disconnect()
  }

  const addChain: I['addChain'] = async chain => {
    if (!_provider?.addChain) throw new errors.ProviderMethodNotFound()
    await _provider.addChain(_parseChainToChainW3P(chain))
  }

  const addProvider: I['addProvider'] = provider => {
    if (_detector.value.providers?.[provider.name]) return
    _detector.value.addProvider(provider)
  }

  const switchChain: I['switchChain'] = async chainId => {
    if (!_provider?.switchChain) throw new errors.ProviderMethodNotFound()
    await _provider.switchChain(chainId)
  }

  const isChainSelecting: I['isChainSelecting'] = ref(false)
  const selectChain: I['selectChain'] = async chainId => {
    isChainSelecting.value = true

    try {
      await switchChain(Number(chainId))
    } catch (error) {
      if (error instanceof errors.ProviderUserRejectedRequest) throw error

      const chainNetworkConfig = CHAINS_NETWORK_CONFIGS_MAP[chainId]
      await addChain(chainNetworkConfig)

      // onChainChanged provider event needs time for execute
      await sleep(1000)
      // it's needs for case if user has added chain, but hasn't switched
      if (_providerReactiveState.chainId !== chainId)
        throw new errors.ProviderUserRejectedRequest()
    } finally {
      isChainSelecting.value = false
    }
  }

  const selectProvider: I['selectProvider'] = async supportedProvider => {
    const providerProxyConstructor: ProviderProxyConstructor | null =
      SUPPORTED_PROXY_CONSTRUCTORS[supportedProvider] ?? null

    if (!providerProxyConstructor)
      throw new errors.ProviderProxyConstructorUnavailable()

    await init(providerProxyConstructor)
  }

  const getAddressUrl: I['getAddressUrl'] = (chain, address) => {
    if (!_provider?.getAddressUrl) throw new errors.ProviderMethodNotFound()
    return _provider.getAddressUrl(_parseChainToChainW3P(chain), address)
  }

  const getHashFromTxResponse: I['getHashFromTxResponse'] = txResponse => {
    if (!_provider?.getHashFromTx) throw new errors.ProviderMethodNotFound()
    return _provider.getHashFromTx(txResponse)
  }

  const getTxUrl: I['getTxUrl'] = (chain, txHash) => {
    if (!_provider?.getTxUrl) throw new errors.ProviderMethodNotFound()
    return _provider.getTxUrl(_parseChainToChainW3P(chain), txHash)
  }

  const signAndSendTx: I['signAndSendTx'] = async txRequestBody => {
    if (!_provider?.signAndSendTx) throw new errors.ProviderMethodNotFound()
    return _provider.signAndSendTx(txRequestBody)
  }

  const signMessage: I['signMessage'] = async message => {
    if (!_provider?.signMessage) throw new errors.ProviderMethodNotFound()
    return _provider.signMessage(message)
  }

  const _detector = computed<
    ProviderDetector<keyof typeof SUPPORTED_PROVIDERS>
  >(() => new ProviderDetector<keyof typeof SUPPORTED_PROVIDERS>())

  async function init(
    ...[providerProxyConstructor, createProviderOpts]: Parameters<I['init']>
  ): ReturnType<I['init']> {
    await _detector.value.init()

    _provider = await createProvider(providerProxyConstructor, {
      providerDetector: createProviderOpts?.providerDetector ?? _detector.value,
      listeners: {
        ...createProviderOpts?.listeners,
        onAccountChanged: () => {
          createProviderOpts?.listeners?.onAccountChanged?.()
          _updateProviderState()
        },
        onChainChanged: () => {
          createProviderOpts?.listeners?.onChainChanged?.()
          _updateProviderState()
        },
        onConnect: () => {
          createProviderOpts?.listeners?.onConnect?.()
          _updateProviderState()
        },
        onDisconnect: () => {
          createProviderOpts?.listeners?.onDisconnect?.()
          _updateProviderState()
        },
      },
    })

    _updateProviderState()
  }

  onUnmounted(() => {
    if (_providerReactiveState.selectedProvider) return
    _provider?.clearHandlers()
  })

  return {
    ...toRefs(_providerReactiveState),
    isChainSelecting,
    isConnecting,

    connect,
    disconnect,
    addChain,
    addProvider,
    switchChain,
    selectChain,
    selectProvider,

    getAddressUrl,
    getHashFromTxResponse,
    getTxUrl,

    signAndSendTx,
    signMessage,

    init,
  }
}

// TODO: remove after update type 'Chain' of @distributedlab/w3p
function _parseChainToChainW3P(chain: Web3ProviderType.Chain): ChainW3P {
  return {
    id: Number(chain.chainId),
    name: chain.chainName,
    type: CHAIN_TYPES.EVM,
    token: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol,
      decimals: chain.nativeCurrency.decimals,
    },
    rpcUrl: chain.rpcUrls[0],
    explorerUrl: chain.blockExplorerUrls?.[0] || '',
    icon: '',
  }
}
