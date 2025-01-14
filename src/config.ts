import {
  ETHEREUM_CHAIN_IDS,
  ETHEREUM_EXPLORER_URLS,
  ETHEREUM_RPC_URLS,
  LAYER_ZERO_ENDPOINT_IDS,
  ROUTE_NAMES,
} from '@/enums'
import type { EthereumType, Provider } from '@/types'
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client/core'
import { ethers, providers, utils } from 'ethers'
import { LogLevelDesc } from 'loglevel'
import packageJson from '../package.json'

export enum CONTRACT_IDS {
  erc1967Proxy = 'erc1967Proxy',
  stEth = 'stEth',
  mor = 'mor',
  endpoint = 'endpoint',
  l1Factory = 'l1-factory',
  l2Factory = 'l2-factory',
  subnetFactory = 'subnet-factory',
  builders = 'builders',
}

export enum NETWORK_IDS {
  mainnet = 'mainnet',
  testnet = 'testnet',
  base = 'base',
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

const networksMap: Record<NETWORK_IDS, Network> = {
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
      [CONTRACT_IDS.erc1967Proxy]: '0x47176B2Af9885dC6C4575d4eFd63895f7Aaa4790',
      [CONTRACT_IDS.stEth]: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      [CONTRACT_IDS.mor]: '0x7431aDa8a591C955a994a21710752EF9b882b8e3',
      [CONTRACT_IDS.endpoint]: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
      [CONTRACT_IDS.l1Factory]: '0x969C0F87623dc33010b4069Fea48316Ba2e45382',
      [CONTRACT_IDS.l2Factory]: '0x890BfA255E6EE8DB5c67aB32dc600B14EBc4546c',
      [CONTRACT_IDS.subnetFactory]:
        '0x37B94Bd80b6012FB214bB6790B31A5C40d6Eb7A5',
      [CONTRACT_IDS.builders]: '0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f',
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
      [CONTRACT_IDS.erc1967Proxy]: '0x0ad2fa5d8f420ff6d87192b32d89faf70466b30b',
      [CONTRACT_IDS.stEth]: '0x84BE06be19F956dEe06d4870CdDa76AF2e0385f5',
      [CONTRACT_IDS.mor]: '0x34a285A1B1C166420Df5b6630132542923B5b27E',
      [CONTRACT_IDS.endpoint]: '0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1',
      [CONTRACT_IDS.l1Factory]: '0xB791b1B02A8f7A32f370200c05EeeE12B9Bba10A',
      [CONTRACT_IDS.l2Factory]: '0x3199555a4552848D522cf3D04bb1fE4C512a5d3B',
      [CONTRACT_IDS.subnetFactory]:
        '0xa41178368f393a224b990779baa9b5855759d45d',
      [CONTRACT_IDS.builders]: '0x649B24D0b6F5A4c3852fD4C0dD91308902E5fe8a',
    },
  },
  [NETWORK_IDS.base]: {
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
      [CONTRACT_IDS.erc1967Proxy]: '0x0ad2fa5d8f420ff6d87192b32d89faf70466b30b',
      [CONTRACT_IDS.stEth]: '0x84BE06be19F956dEe06d4870CdDa76AF2e0385f5',
      [CONTRACT_IDS.mor]: '0x34a285A1B1C166420Df5b6630132542923B5b27E',
      [CONTRACT_IDS.endpoint]: '0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1',
      [CONTRACT_IDS.l1Factory]: '0xB791b1B02A8f7A32f370200c05EeeE12B9Bba10A',
      [CONTRACT_IDS.l2Factory]: '0x3199555a4552848D522cf3D04bb1fE4C512a5d3B',
      [CONTRACT_IDS.subnetFactory]:
        '0xa41178368f393a224b990779baa9b5855759d45d',
      [CONTRACT_IDS.builders]: '0x649B24D0b6F5A4c3852fD4C0dD91308902E5fe8a',
    },
  },
}

const chainsMap: Record<ETHEREUM_CHAIN_IDS, EthereumType.Chain> = {
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

const firstApolloClient: Record<
  NETWORK_IDS,
  ApolloClient<NormalizedCacheObject | null>
> = {
  [NETWORK_IDS.testnet]: new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.studio.thegraph.com/query/73688/kkk/version/latest',
    }),
    cache: new InMemoryCache(),
  }) as ApolloClient<NormalizedCacheObject>,
  [NETWORK_IDS.mainnet]: new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.studio.thegraph.com/query/67225/morpheus-dashboard/version/latest',
    }),
    cache: new InMemoryCache(),
  }) as ApolloClient<NormalizedCacheObject>,
  [NETWORK_IDS.base]: {} as ApolloClient<NormalizedCacheObject>,
}

const secondApolloClient: Record<
  NETWORK_IDS,
  ApolloClient<NormalizedCacheObject | null>
> = {
  [NETWORK_IDS.testnet]: new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.studio.thegraph.com/query/73688/lumerin-node-testnet/version/latest',
    }),
    cache: new InMemoryCache(),
    queryDeduplication: false,
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  }) as ApolloClient<NormalizedCacheObject>,
  [NETWORK_IDS.mainnet]: new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.studio.thegraph.com/query/73688/lumerin-node/version/latest',
    }),
    cache: new InMemoryCache(),
    queryDeduplication: false,
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  }) as ApolloClient<NormalizedCacheObject>,
  [NETWORK_IDS.base]: new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.studio.thegraph.com/query/73688/morpheus-base-mainnet/version/latest',
    }),
    cache: new InMemoryCache(),
    queryDeduplication: false,
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  }),
}

const perPageAllowedNetworks: Record<ROUTE_NAMES, NETWORK_IDS[]> = {
  [ROUTE_NAMES.app]: [],
  [ROUTE_NAMES.appDashboard]: [],
  [ROUTE_NAMES.appDashboardCapital]: [],
  [ROUTE_NAMES.appCapital]: [],
  [ROUTE_NAMES.appCommunity]: [],
  [ROUTE_NAMES.appMor20EcosystemMain]: [],
  [ROUTE_NAMES.contractInfo]: [],
  [ROUTE_NAMES.appMor20EcosystemProtocolCreation]: [],
  [ROUTE_NAMES.appReferrals]: [],
  [ROUTE_NAMES.appDelegation]: [],
  [ROUTE_NAMES.appDelegatorInfo]: [],
  [ROUTE_NAMES.appBuildersList]: [
    NETWORK_IDS.mainnet,
    NETWORK_IDS.testnet,
    NETWORK_IDS.base,
  ],
  [ROUTE_NAMES.appBuildersItem]: [],
}

/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
export const config = {
  // General
  WALLET_CONNECT_PROJECT_ID: import.meta.env.VITE_APP_WALLET_CONNECT_PROJECT_ID,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  GITHUB_URL: 'https://github.com/MorpheusAIs/Docs/tree/main/!KEYDOCS%20README%20FIRST!',
  CONTRACT_FAQ_URL: 'https://github.com/MorpheusAIs/Docs/blob/main/!KEYDOCS%20README%20FIRST!/FAQs%20%26%20Guides/Capital%20Providers%20FAQ.md',
  LANDING_URL: 'https://mor.org/',
  CODE_CONTRIBUTION_URL: 'https://mor.software/',
  COMPUTE_CONTRIBUTION_URL: 'https://github.com/MorpheusAIs/Docs/blob/main/Contributions/Compute%20-%20Proof%20of%20Contribution.md',
  COMMUNITY_CONTRIBUTION_URL: 'https://mor.org/MOR20',
  HOW_GET_STETH_URL: 'https://stake.lido.fi/',
  WALLET_INSTALL_URL: 'https://metamask.io/download/',
  DEFAULT_REFEREE: '0x0000000000000000000000000000000000000000',
  metadata: {
    name: import.meta.env.VITE_APP_NAME,
    description: import.meta.env.VITE_APP_DESCRIPTION,
    url: import.meta.env.VITE_APP_URL,
    icons: [`${import.meta.env.VITE_APP_URL}/branding/logo.svg`],
    monthOfLaunch: 1,
    yearOfLaunch: 2024,
  },
  networksMap,
  chainsMap,
  firstApolloClient,
  secondApolloClient,
  perPageAllowedNetworks,
}
