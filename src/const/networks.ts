import {
  ETHEREUM_CHAINS,
  ETHEREUM_EXPLORER_URLS,
  ETHEREUM_RPC_URLS,
  LAYER_ZERO_ENDPOINTS,
  NETWORK_IDS,
} from '@/enums'

interface Network {
  chainId: ETHEREUM_CHAINS
  chainTitle: string
  rpcUrl: ETHEREUM_RPC_URLS
  explorerUrl: ETHEREUM_EXPLORER_URLS
  extendedChainId: ETHEREUM_CHAINS
  extendedChainTitle: string
  extendedChainRpcUrl: ETHEREUM_RPC_URLS
  extendedChainLayerZeroEndpoint: LAYER_ZERO_ENDPOINTS
}

export const NETWORKS: Record<NETWORK_IDS, Network> = Object.freeze({
  [NETWORK_IDS.mainnet]: {
    chainId: ETHEREUM_CHAINS.ethereum,
    chainTitle: 'Ethereum',
    rpcUrl: ETHEREUM_RPC_URLS.ethereum,
    explorerUrl: ETHEREUM_EXPLORER_URLS.ethereum,
    extendedChainId: ETHEREUM_CHAINS.arbitrum,
    extendedChainTitle: 'Arbitrum',
    extendedChainRpcUrl: ETHEREUM_RPC_URLS.arbitrum,
    extendedChainLayerZeroEndpoint: LAYER_ZERO_ENDPOINTS.arbitrum,
  },
  [NETWORK_IDS.testnet]: {
    chainId: ETHEREUM_CHAINS.sepolia,
    chainTitle: 'Ethereum Sepolia',
    rpcUrl: ETHEREUM_RPC_URLS.sepolia,
    explorerUrl: ETHEREUM_EXPLORER_URLS.sepolia,
    extendedChainId: ETHEREUM_CHAINS.arbitrumSepolia,
    extendedChainTitle: 'Arbitrum Sepolia',
    extendedChainRpcUrl: ETHEREUM_RPC_URLS.arbitrumSepolia,
    extendedChainLayerZeroEndpoint: LAYER_ZERO_ENDPOINTS.arbitrumSepolia,
  },
})
