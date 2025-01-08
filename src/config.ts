import {
  ETHEREUM_CHAIN_IDS,
  ETHEREUM_EXPLORER_URLS,
  ETHEREUM_RPC_URLS,
  LAYER_ZERO_ENDPOINT_IDS,
} from '@/enums'
import type { EthereumType, Provider } from '@/types'
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client/core'
import { ethers, providers, utils } from 'ethers'
import { pickBy, mapKeys } from 'lodash'
import { LogLevelDesc } from 'loglevel'
import packageJson from '../package.json'

export enum CONTRACT_IDS {
  erc1967Proxy = 'erc1967Proxy',
  stEth = 'stEth',
  mor = 'mor',
  endpoint = 'endpoint',
  l1Factory = 'l1-factory',
  l2Factory = 'l2-factory',
}

export enum NETWORK_IDS {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

type NetworkLayer = {
  chainId: ETHEREUM_CHAIN_IDS
  chainTitle: string
  layerZeroEndpointId: LAYER_ZERO_ENDPOINT_IDS
  provider: Provider
  explorerUrl: ETHEREUM_EXPLORER_URLS
}

interface Network {
  l1: NetworkLayer
  l2: NetworkLayer
  contractAddressesMap: Record<CONTRACT_IDS, string>
}

type Metadata = {
  name: string
  description: string
  url: string
  icons: string[]
}

export const config = {
  // General
  NAME: import.meta.env.VITE_APP_NAME,
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION,
  URL: import.meta.env.VITE_APP_URL,
  WALLET_CONNECT_PROJECT_ID: import.meta.env.VITE_APP_WALLET_CONNECT_PROJECT_ID,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  GITHUB_URL:
    'https://github.com/MorpheusAIs/Docs/tree/main/!KEYDOCS%20README%20FIRST!',
  CONTRACT_FAQ_URL:
    'https://github.com/MorpheusAIs/Docs/blob/main/!KEYDOCS%20README%20FIRST!/FAQs%20%26%20Guides/Capital%20Providers%20FAQ.md',
  LANDING_URL: 'https://mor.org/',
  CODE_CONTRIBUTION_URL: 'https://mor.software/',
  COMPUTE_CONTRIBUTION_URL:
    'https://github.com/MorpheusAIs/Docs/blob/main/Contributions/Compute%20-%20Proof%20of%20Contribution.md',
  COMMUNITY_CONTRIBUTION_URL: 'https://mor.org/MOR20',
  HOW_GET_STETH_URL: 'https://stake.lido.fi/',
  WALLET_INSTALL_URL: 'https://metamask.io/download/',
  DEFAULT_REFEREE: import.meta.env.VITE_APP_DEFAULT_REFEREE,

  // Testnet
  ERC1967_PROXY_TESTNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_ERC1967_PROXY_TESTNET_CONTRACT_ADDRESS,
  STETH_TESTNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_STETH_TESTNET_CONTRACT_ADDRESS,
  MOR_TESTNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_MOR_TESTNET_CONTRACT_ADDRESS,
  ENDPOINT_TESTNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_ENDPOINT_TESTNET_CONTRACT_ADDRESS,
  L1_FACTORY_TESTNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_L1_FACTORY_TESTNET_CONTRACT_ADDRESS,
  L2_FACTORY_TESTNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_L2_FACTORY_TESTNET_CONTRACT_ADDRESS,
  TESTNET_GRAPHQL_API_URL: import.meta.env.VITE_APP_TESTNET_GRAPHQL_API_URL,

  // Mainnet
  ERC1967_PROXY_MAINNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_ERC1967_PROXY_MAINNET_CONTRACT_ADDRESS,
  STETH_MAINNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_STETH_MAINNET_CONTRACT_ADDRESS,
  MOR_MAINNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_MOR_MAINNET_CONTRACT_ADDRESS,
  ENDPOINT_MAINNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_ENDPOINT_MAINNET_CONTRACT_ADDRESS,
  L1_FACTORY_MAINNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_L1_FACTORY_MAINNET_CONTRACT_ADDRESS,
  L2_FACTORY_MAINNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_L2_FACTORY_MAINNET_CONTRACT_ADDRESS,
  MAINNET_GRAPHQL_API_URL: import.meta.env.VITE_APP_MAINNET_GRAPHQL_API_URL,

  metadata: {} as Metadata,

  networksMap: {} as Record<NETWORK_IDS, Network>,

  chainsMap: {} as Record<ETHEREUM_CHAIN_IDS, EthereumType.Chain>,

  mainnetApolloClient: {} as ApolloClient<NormalizedCacheObject>,
  testnetApolloClient: {} as ApolloClient<NormalizedCacheObject>,

  testnetBuildersApolloClient: {} as ApolloClient<NormalizedCacheObject>,
}

Object.assign(config, _mapEnvCfg(import.meta.env))
Object.assign(config, _mapEnvCfg(document.ENV))

config.metadata = {
  name: config.NAME,
  description: config.DESCRIPTION,
  url: config.URL,
  icons: [`${config.URL}/branding/logo.svg`],
}

config.networksMap = {
  [NETWORK_IDS.mainnet]: {
    l1: {
      chainId: ETHEREUM_CHAIN_IDS.ethereum,
      chainTitle: 'Ethereum',
      layerZeroEndpointId: LAYER_ZERO_ENDPOINT_IDS.ethereum,
      provider: new providers.FallbackProvider(
        [
          'https://rpc.mevblocker.io',
          'https://rpc.mevblocker.io',
          'https://eth-pokt.nodies.app',
          'https://eth.drpc.org',
          'https://rpc.payload.de',
          'https://eth.merkle.io',
        ].map((rpcUrl, idx) => ({
          provider: new providers.StaticJsonRpcProvider(
            rpcUrl,
            ethers.providers.getNetwork(Number(ETHEREUM_CHAIN_IDS.ethereum)),
          ),
          priority: idx,
        })),
        1,
      ),
      explorerUrl: ETHEREUM_EXPLORER_URLS.ethereum,
    },
    l2: {
      chainId: ETHEREUM_CHAIN_IDS.arbitrum,
      chainTitle: 'Arbitrum',
      layerZeroEndpointId: LAYER_ZERO_ENDPOINT_IDS.arbitrum,
      provider: new providers.StaticJsonRpcProvider(ETHEREUM_RPC_URLS.arbitrum),
      explorerUrl: ETHEREUM_EXPLORER_URLS.arbitrum,
    },
    contractAddressesMap: {
      [CONTRACT_IDS.erc1967Proxy]:
        config.ERC1967_PROXY_MAINNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.stEth]: config.STETH_MAINNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.mor]: config.MOR_MAINNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.endpoint]: config.ENDPOINT_MAINNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.l1Factory]: config.L1_FACTORY_MAINNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.l2Factory]: config.L2_FACTORY_MAINNET_CONTRACT_ADDRESS,
    },
  },
  [NETWORK_IDS.testnet]: {
    l1: {
      chainId: ETHEREUM_CHAIN_IDS.sepolia,
      chainTitle: 'Ethereum Sepolia',
      layerZeroEndpointId: LAYER_ZERO_ENDPOINT_IDS.sepolia,
      provider: new providers.StaticJsonRpcProvider(
        ETHEREUM_RPC_URLS.sepolia,
        ethers.providers.getNetwork(Number(ETHEREUM_CHAIN_IDS.sepolia)),
      ),
      explorerUrl: ETHEREUM_EXPLORER_URLS.sepolia,
    },
    l2: {
      chainId: ETHEREUM_CHAIN_IDS.arbitrumSepolia,
      chainTitle: 'Arbitrum Sepolia',
      layerZeroEndpointId: LAYER_ZERO_ENDPOINT_IDS.arbitrumSepolia,
      provider: new providers.StaticJsonRpcProvider(
        ETHEREUM_RPC_URLS.arbitrumSepolia,
      ),
      explorerUrl: ETHEREUM_EXPLORER_URLS.arbitrumSepolia,
    },
    contractAddressesMap: {
      [CONTRACT_IDS.erc1967Proxy]:
        config.ERC1967_PROXY_TESTNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.stEth]: config.STETH_TESTNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.mor]: config.MOR_TESTNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.endpoint]: config.ENDPOINT_TESTNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.l1Factory]: config.L1_FACTORY_TESTNET_CONTRACT_ADDRESS,
      [CONTRACT_IDS.l2Factory]: config.L2_FACTORY_TESTNET_CONTRACT_ADDRESS,
    },
  },
}

config.chainsMap = {
  [ETHEREUM_CHAIN_IDS.arbitrum]: {
    chainId: utils.hexValue(Number(ETHEREUM_CHAIN_IDS.arbitrum)),
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [ETHEREUM_RPC_URLS.arbitrum],
    blockExplorerUrls: [ETHEREUM_EXPLORER_URLS.arbitrum],
  },
  [ETHEREUM_CHAIN_IDS.arbitrumSepolia]: {
    chainId: utils.hexValue(Number(ETHEREUM_CHAIN_IDS.arbitrumSepolia)),
    chainName: 'Arbitrum Sepolia (Testnet)',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [ETHEREUM_RPC_URLS.arbitrumSepolia],
    blockExplorerUrls: [ETHEREUM_EXPLORER_URLS.arbitrumSepolia],
  },
  [ETHEREUM_CHAIN_IDS.ethereum]: {
    chainId: utils.hexValue(Number(ETHEREUM_CHAIN_IDS.ethereum)),
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [ETHEREUM_RPC_URLS.ethereum],
    blockExplorerUrls: [ETHEREUM_EXPLORER_URLS.ethereum],
  },
  [ETHEREUM_CHAIN_IDS.sepolia]: {
    chainId: utils.hexValue(Number(ETHEREUM_CHAIN_IDS.sepolia)),
    chainName: 'Sepolia',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [ETHEREUM_RPC_URLS.sepolia],
    blockExplorerUrls: [ETHEREUM_EXPLORER_URLS.sepolia],
  },
}

config.mainnetApolloClient = new ApolloClient({
  link: createHttpLink({ uri: config.MAINNET_GRAPHQL_API_URL }),
  cache: new InMemoryCache(),
})

config.testnetApolloClient = new ApolloClient({
  link: createHttpLink({ uri: config.TESTNET_GRAPHQL_API_URL }),
  cache: new InMemoryCache(),
})

config.testnetBuildersApolloClient = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.studio.thegraph.com/query/73688/lumerin-node-testnet/version/latest',
  }),
  cache: new InMemoryCache(),
})

function _mapEnvCfg(env: ImportMetaEnv | typeof document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
    (v, k) => k.replace(/^VITE_APP_/, ''),
  )
}
