import packageJson from '../package.json'
import { LogLevelDesc } from 'loglevel'
import { pickBy, mapKeys } from 'lodash'
import {
  ETHEREUM_CHAINS,
  ETHEREUM_EXPLORER_URLS,
  ETHEREUM_RPC_URLS,
  LAYER_ZERO_ENDPOINTS,
} from '@/enums'

export enum NETWORK_IDS {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

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

export const config = {
  // General
  NAME: import.meta.env.VITE_APP_NAME,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  GITHUB_URL:
    'https://github.com/MorpheusAIs/Docs/tree/main/!KEYDOCS%20README%20FIRST!',
  CONTRACT_FAQ_URL:
    'https://github.com/MorpheusAIs/Docs/blob/main/English%20Guides/Morpheus%20Capital%20Providers%20Contract%20Guide.md',
  LANDING_URL: 'https://mor.org/',
  CODE_CONTRIBUTION_URL:
    'https://github.com/MorpheusAIs/Docs/blob/main/Contributions/Code%20-%20Proof_Of_Contribution.md',
  COMPUTE_CONTRIBUTION_URL:
    'https://github.com/MorpheusAIs/Docs/blob/main/Contributions/Compute%20-%20Proof%20of%20Contribution.md',
  COMMUNITY_CONTRIBUTION_URL:
    'https://github.com/MorpheusAIs/Docs/blob/main/Contributions/Community%20-%20Proof%20of%20Contribution.md',
  HOW_GET_STETH_URL:
    'https://help.lido.fi/en/articles/5232811-how-do-i-get-steth',
  WALLET_INSTALL_URL: 'https://metamask.io/download/',

  // Testnet
  ERC1967_PROXY_TESTNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_ERC1967_PROXY_TESTNET_CONTRACT_ADDRESS,
  STETH_TESTNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_STETH_TESTNET_CONTRACT_ADDRESS,
  MOR_TESTNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_MOR_TESTNET_CONTRACT_ADDRESS,
  ENDPOINT_TESTNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_ENDPOINT_TESTNET_CONTRACT_ADDRESS,

  // Mainnet
  ERC1967_PROXY_MAINNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_ERC1967_PROXY_MAINNET_CONTRACT_ADDRESS,
  STETH_MAINNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_STETH_MAINNET_CONTRACT_ADDRESS,
  MOR_MAINNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_MOR_MAINNET_CONTRACT_ADDRESS,
  ENDPOINT_MAINNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_ENDPOINT_MAINNET_CONTRACT_ADDRESS,

  // Networks
  networks: {
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
  } as Record<NETWORK_IDS, Network>,
} as const

Object.assign(config, _mapEnvCfg(import.meta.env))
Object.assign(config, _mapEnvCfg(document.ENV))

function _mapEnvCfg(env: ImportMetaEnv | typeof document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
    (v, k) => k.replace(/^VITE_APP_/, ''),
  )
}
