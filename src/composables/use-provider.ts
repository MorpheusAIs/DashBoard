import { errors } from '@/errors'
import { sleep } from '@/helpers'
import { type EthereumType } from '@/types'
import { config } from '@config'
import { createAppKit, AppKit } from '@reown/appkit/vue'
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'
import { reactive, ref, toRefs, type Ref, type UnwrapRef } from 'vue'
import { utils } from 'ethers'
import { chainConfig } from 'viem/op-stack'
import { defineChain } from 'viem'
import type { AppKitNetwork } from '@reown/appkit-common'
import * as chainsList from 'viem/chains'

export interface IUseProvider {
  selectedAddress: Ref<string>
  rawProvider: Ref<unknown | null>
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
  rawProvider: UnwrapRef<IUseProvider['rawProvider']>
  chainId: UnwrapRef<IUseProvider['chainId']>
  isConnected: UnwrapRef<IUseProvider['isConnected']>
}

export const useProvider = (): IUseProvider => {
  type I = IUseProvider
  let _web3Modal: AppKit | null = null

  const _providerReactiveState = reactive<ProviderState>({
    selectedAddress: '',
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
      params: [
        {
          chainId: utils.isHexString(chainId)
            ? chainId
            : `0x${Number(chainId).toString(16)}`,
        },
      ],
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

      const chainToAdd = Object.values(config.chainsMap).find(
        el =>
          el.chainId ===
          (utils.isHexString(chainId) ? chainId : utils.hexValue(chainId)),
      )

      if (!chainToAdd) throw new TypeError('Chain not found')

      await addChain(chainToAdd)

      // onChainChanged provider event needs time for execute
      await sleep(1000)
      // it's being used in case if user has added chain, but hasn't switched
      if (_providerReactiveState.chainId !== chainId)
        throw new errors.ProviderUserRejectedRequest()
    }

    isChainSelecting.value = false
  }

  const request: I['request'] = async body => {
    // eslint-disable-next-line
    // @ts-ignore
    if (!_providerReactiveState.rawProvider?.request)
      throw new errors.ProviderMethodNotFound()

    // eslint-disable-next-line
    // @ts-ignore
    await _providerReactiveState.rawProvider.request(body)
  }

  const init: I['init'] = () => {
    _web3Modal = createAppKit({
      adapters: [new Ethers5Adapter()],
      networks: Object.values(config.chainsMap).map(chain =>
        _parseChainToWeb3ModalChain(chain),
      ) as [AppKitNetwork, ...AppKitNetwork[]],
      metadata: config.metadata,
      projectId: config.WALLET_CONNECT_PROJECT_ID,
      features: {
        analytics: true,
        email: false,
        socials: false,
      },
      themeVariables: {
        '--w3m-font-family': 'var(--app-font-family)',
        '--w3m-accent': 'var(--primary-main)',
        '--w3m-border-radius-master': '0',
        '--w3m-z-index': 1500,
      },
    })

    _web3Modal.subscribeNetwork(() => {
      const provider = _web3Modal?.getWalletProvider() as {
        selectedAddress: string
        chainId: string
        _state: {
          isConnected: boolean
        }
      } | null

      _providerReactiveState.selectedAddress = provider?.selectedAddress || ''
      _providerReactiveState.rawProvider = provider
      _providerReactiveState.chainId = provider?.chainId
        ? String(Number(provider.chainId))
        : ''
      _providerReactiveState.isConnected = Boolean(
        provider?._state?.isConnected,
      )
    })
  }

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

function _parseChainToWeb3ModalChain(chain: EthereumType.Chain): AppKitNetwork {
  const currentChain = Object.values(chainsList).find(
    el => el.id === Number(chain.chainId),
  )

  const resultObj = {
    ...chainConfig,
    ...(currentChain || chainsList.mainnet), // if doesn't exist, use mainnet
  }

  Object.assign(resultObj, {
    id: Number(chain.chainId),
    name: chain.chainName,
    nativeCurrency: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol,
      decimals: chain.nativeCurrency.decimals,
    },
    rpcUrls: {
      default: {
        http: [chain.rpcUrls[0]],
      },
    },
    blockExplorers: {
      default: {
        name: currentChain?.blockExplorers?.default?.name || '',
        url:
          chain.blockExplorerUrls?.[0] ||
          currentChain?.blockExplorers?.default?.url ||
          '',
      },
    },
  })

  return defineChain(resultObj) as AppKitNetwork
}
