import {
  ETHEREUM_CHAINS,
  ETHEREUM_EXPLORER_URLS,
  ETHEREUM_RPC_URLS,
} from '@/enums'
import { type Web3ProviderType } from '@/types'
import { utils } from 'ethers'

export const ARBITRUM_NETWORK_CONFIG: Readonly<Web3ProviderType.Chain> =
  Object.freeze({
    chainId: utils.hexValue(Number(ETHEREUM_CHAINS.arbitrum)),
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [ETHEREUM_RPC_URLS.arbitrum],
    blockExplorerUrls: [ETHEREUM_EXPLORER_URLS.arbitrum],
  })

export const ARBITRUM_SEPOLIA_NETWORK_CONFIG: Readonly<Web3ProviderType.Chain> =
  Object.freeze({
    chainId: utils.hexValue(Number(ETHEREUM_CHAINS.arbitrumSepolia)),
    chainName: 'Arbitrum Sepolia (Testnet)',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [ETHEREUM_RPC_URLS.arbitrumSepolia],
    blockExplorerUrls: [ETHEREUM_EXPLORER_URLS.arbitrumSepolia],
  })

export const CHAINS_NETWORK_CONFIGS_MAP: Readonly<
  Record<Web3ProviderType.ChainId, Web3ProviderType.Chain>
> = Object.freeze({
  [ETHEREUM_CHAINS.arbitrum]: ARBITRUM_NETWORK_CONFIG,
  [ETHEREUM_CHAINS.arbitrumSepolia]: ARBITRUM_SEPOLIA_NETWORK_CONFIG,
})
