import { type ETHEREUM_CHAINS } from '@/enums'
import { errors } from '@/errors'
import { sleep } from '@/helpers'
import { type EthereumType } from '@/types'
import { config } from '@config'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5'
import {
  type Web3Modal,
  type Web3ModalClientOptions,
} from '@web3modal/ethers5/dist/types/src/client'
import {
  onUnmounted,
  reactive,
  ref,
  toRefs,
  type Ref,
  type UnwrapRef,
} from 'vue'

export interface IUseProvider {
  selectedAddress: Ref<string>
  selectedProvider: Ref<string>
  rawProvider: Ref<ReturnType<Web3Modal['getWalletProvider']> | null>
  chainId: Ref<string>

  isChainSelecting: Ref<boolean>
  isConnected: Ref<boolean>

  connect: () => Promise<void>
  disconnect: () => Promise<void>
  addChain: (chain: EthereumType.Chain) => Promise<void>
  switchChain: (chainId: string) => Promise<void>
  selectChain: (chainId: string) => Promise<void>
  request: (body: {
    method: string
    params?: unknown[] | object
  }) => Promise<unknown>

  init: () => void
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
  let _web3Modal: Web3Modal | null = null

  const _providerReactiveState = reactive<ProviderState>({
    selectedAddress: '',
    selectedProvider: '',
    rawProvider: null,
    chainId: '',
    isConnected: false,
  })

  const connect: I['connect'] = async () => {
    if (!_web3Modal?.open) throw new errors.ProviderMethodNotFound()
    await _web3Modal.open()
  }

  const disconnect: I['disconnect'] = async () => {
    if (!_web3Modal?.disconnect) throw new errors.ProviderMethodNotFound()
    await _web3Modal.disconnect()
  }

  const addChain: I['addChain'] = async chain => {
    await request({
      method: 'wallet_addEthereumChain',
      params: [chain],
    })
  }

  const switchChain: I['switchChain'] = async chainId => {
    await request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${Number(chainId).toString(16)}` }],
    })
  }

  const isChainSelecting: I['isChainSelecting'] = ref(false)
  const selectChain: I['selectChain'] = async chainId => {
    if (_providerReactiveState.chainId === chainId) return

    isChainSelecting.value = true

    try {
      await switchChain(chainId)

      // onChainChanged provider event needs time for execute
      await sleep(1000)
    } catch (error) {
      if (error instanceof errors.ProviderUserRejectedRequest) throw error

      await addChain(config.chainsMap[chainId as ETHEREUM_CHAINS])

      // onChainChanged provider event needs time for execute
      await sleep(1000)
      // it's being used in case if user has added chain, but hasn't switched
      if (_providerReactiveState.chainId !== chainId)
        throw new errors.ProviderUserRejectedRequest()
    }

    isChainSelecting.value = false
  }

  const request: I['request'] = async body => {
    if (!_providerReactiveState.rawProvider?.request)
      throw new errors.ProviderMethodNotFound()

    await _providerReactiveState.rawProvider.request(body)
  }

  let _unsubscribeProvider: (() => void) | null = null
  const init: I['init'] = () => {
    _web3Modal = createWeb3Modal({
      ethersConfig: defaultConfig({ metadata: config.metadata }),
      chains: Object.values(config.chainsMap).map(chain =>
        _parseChainToWeb3ModalChain(chain),
      ),
      projectId: config.WALLET_CONNECT_PROJECT_ID,
      enableAnalytics: true,
      themeVariables: {
        '--w3m-font-family': 'var(--app-font-family)',
        '--w3m-accent': 'var(--primary-main)',
        '--w3m-border-radius-master': '0',
        '--w3m-z-index': 1500,
      },
    })

    _unsubscribeProvider = _web3Modal.subscribeProvider(newState => {
      _providerReactiveState.selectedAddress = newState.address || ''
      _providerReactiveState.selectedProvider = newState.providerType || ''
      _providerReactiveState.rawProvider = newState.provider || null
      _providerReactiveState.chainId = newState.chainId
        ? String(newState.chainId)
        : ''
      _providerReactiveState.isConnected = newState.isConnected
    })
  }

  onUnmounted(() => {
    _unsubscribeProvider?.()
  })

  return {
    ...toRefs(_providerReactiveState),
    isChainSelecting,

    connect,
    disconnect,
    addChain,
    switchChain,
    selectChain,
    request,

    init,
  }
}

function _parseChainToWeb3ModalChain(
  chain: EthereumType.Chain,
): Web3ModalClientOptions['chains'][number] {
  return {
    chainId: Number(chain.chainId),
    name: chain.chainName,
    currency: chain.nativeCurrency.symbol,
    explorerUrl: chain.blockExplorerUrls?.[0] || '',
    rpcUrl: chain.rpcUrls[0],
  }
}
