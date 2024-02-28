import {
  ETHEREUM_CHAINS,
  ETHEREUM_EXPLORER_URLS,
  ETHEREUM_RPC_URLS,
  LAYER_ZERO_ENDPOINTS,
} from '@/enums'
import { providers } from 'ethers'
import { pickBy, mapKeys } from 'lodash'
import { LogLevelDesc } from 'loglevel'
import packageJson from '../package.json'

export enum CONTRACT_IDS {
  erc1967Proxy = 'erc1967Proxy',
  stEth = 'stEth',
  mor = 'mor',
  endpoint = 'endpoint',
}

export enum NETWORK_IDS {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

interface Network {
  chainId: ETHEREUM_CHAINS
  chainTitle: string
  provider: providers.JsonRpcProvider
  explorerUrl: ETHEREUM_EXPLORER_URLS
  extendedChainId: ETHEREUM_CHAINS
  extendedChainTitle: string
  extendedChainProvider: providers.JsonRpcProvider
  extendedChainLayerZeroEndpoint: LAYER_ZERO_ENDPOINTS
  contractAddressesMap: Record<CONTRACT_IDS, string>
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

  networks: {} as Record<NETWORK_IDS, Network>,
}

Object.assign(config, _mapEnvCfg(import.meta.env))
Object.assign(config, _mapEnvCfg(document.ENV))

config.networks = {
  [NETWORK_IDS.mainnet]: {
    chainId: ETHEREUM_CHAINS.ethereum,
    chainTitle: 'Ethereum',
    provider: new providers.JsonRpcProvider(ETHEREUM_RPC_URLS.ethereum),
    explorerUrl: ETHEREUM_EXPLORER_URLS.ethereum,
    extendedChainId: ETHEREUM_CHAINS.arbitrum,
    extendedChainTitle: 'Arbitrum',
    extendedChainProvider: new providers.JsonRpcProvider(
      ETHEREUM_RPC_URLS.arbitrum,
    ),
    extendedChainLayerZeroEndpoint: LAYER_ZERO_ENDPOINTS.arbitrum,
    contractAddressesMap: {
      [CONTRACT_IDS.erc1967Proxy]:
        config.ERC1967_PROXY_MAINNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.stEth]: config.STETH_MAINNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.mor]: config.MOR_MAINNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.endpoint]: config.ENDPOINT_MAINNET_CONTRACT_ADDRESS,
    },
  },
  [NETWORK_IDS.testnet]: {
    chainId: ETHEREUM_CHAINS.sepolia,
    chainTitle: 'Ethereum Sepolia',
    provider: new providers.JsonRpcProvider(ETHEREUM_RPC_URLS.sepolia),
    explorerUrl: ETHEREUM_EXPLORER_URLS.sepolia,
    extendedChainId: ETHEREUM_CHAINS.arbitrumSepolia,
    extendedChainTitle: 'Arbitrum Sepolia',
    extendedChainProvider: new providers.JsonRpcProvider(
      ETHEREUM_RPC_URLS.arbitrumSepolia,
    ),
    extendedChainLayerZeroEndpoint: LAYER_ZERO_ENDPOINTS.arbitrumSepolia,
    contractAddressesMap: {
      [CONTRACT_IDS.erc1967Proxy]:
        config.ERC1967_PROXY_TESTNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.stEth]: config.STETH_TESTNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.mor]: config.MOR_TESTNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.endpoint]: config.ENDPOINT_TESTNET_CONTRACT_ADDRESS,
    },
  },
}

function _mapEnvCfg(env: ImportMetaEnv | typeof document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
    (v, k) => k.replace(/^VITE_APP_/, ''),
  )
}
