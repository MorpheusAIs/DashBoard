import { ROUTE_NAMES } from '@/enums'
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

/**
 * Define which network types user could switch between without change network in metamask
 */
export enum NetworkTypes {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

/**
 * Define which networks this Dapp supports
 */
export enum EthereumChains {
  Ethereum = '1',
  Sepolia = '11155111',
  Arbitrum = '42161',
  ArbitrumSepolia = '421614',
  Base = '8453',
}

export const getEthereumChainsName = (
  chain: string,
): keyof typeof EthereumChains => {
  return Object.keys(EthereumChains).find(
    key => EthereumChains[key as keyof typeof EthereumChains] === chain,
  ) as keyof typeof EthereumChains
}

/**
 * Define which network belows to which network type
 */
export const ethereumChainsTypes = {
  [NetworkTypes.Mainnet]: [
    EthereumChains.Arbitrum,
    EthereumChains.Ethereum,
    EthereumChains.Base,
  ],
  [NetworkTypes.Testnet]: [
    EthereumChains.ArbitrumSepolia,
    EthereumChains.Sepolia,
  ],
}

/**
 * Simple metadata for each network
 */
const chainsMap: Record<keyof typeof EthereumChains, EthereumType.Chain> = {
  Arbitrum: {
    chainId: utils.hexValue(Number(EthereumChains.Arbitrum)),
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arbitrum-one.publicnode.com'],
    blockExplorerUrls: ['https://arbiscan.io'],
    iconUrls: ['/images/arbitrum-alt-icon.svg'],
  },
  ArbitrumSepolia: {
    chainId: utils.hexValue(Number(EthereumChains.ArbitrumSepolia)),
    chainName: 'Arbitrum Sepolia (Testnet)',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://sepolia.arbiscan.io'],
    iconUrls: ['/images/arbitrum-alt-icon.svg'],
  },
  Ethereum: {
    chainId: utils.hexValue(Number(EthereumChains.Ethereum)),
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://eth.llamarpc.com'],
    blockExplorerUrls: ['https://etherscan.io'],
    iconUrls: ['/images/ethereum-icon.svg'],
  },
  Sepolia: {
    chainId: utils.hexValue(Number(EthereumChains.Sepolia)),
    chainName: 'Sepolia',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://ethereum-sepolia.publicnode.com'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    iconUrls: ['/images/ethereum-icon.svg'],
  },
  Base: {
    chainId: utils.hexValue(Number(EthereumChains.Base)),
    chainName: 'Base',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://base.llamarpc.com'],
    blockExplorerUrls: ['https://basescan.org'],
    iconUrls: ['/images/base-network-icon.svg'],
  },
}

/**
 * Each page supports it's own networks, it could be same for several or unique.
 * User will be forced to switch his network on this page to supported one if he still not
 */
const perPageAllowedNetworks: Record<ROUTE_NAMES, EthereumChains[]> = {
  [ROUTE_NAMES.app]: [
    EthereumChains.Ethereum,
    EthereumChains.Sepolia,
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  [ROUTE_NAMES.appDashboard]: [
    EthereumChains.Ethereum,
    EthereumChains.Sepolia,
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  [ROUTE_NAMES.appDashboardCapital]: [
    EthereumChains.Ethereum,
    EthereumChains.Sepolia,
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  [ROUTE_NAMES.appCapital]: [EthereumChains.Ethereum, EthereumChains.Sepolia],
  [ROUTE_NAMES.appCommunity]: [
    EthereumChains.Ethereum,
    EthereumChains.Sepolia,
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  [ROUTE_NAMES.appMor20EcosystemMain]: [
    EthereumChains.Ethereum,
    EthereumChains.Sepolia,
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  [ROUTE_NAMES.contractInfo]: [
    EthereumChains.Ethereum,
    EthereumChains.Sepolia,
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  [ROUTE_NAMES.appMor20EcosystemProtocolCreation]: [
    EthereumChains.Ethereum,
    EthereumChains.Sepolia,
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  [ROUTE_NAMES.appReferrals]: [
    EthereumChains.Ethereum,
    EthereumChains.Sepolia,
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  [ROUTE_NAMES.appDelegation]: [
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  [ROUTE_NAMES.appDelegatorInfo]: [
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  [ROUTE_NAMES.appBuildersList]: [
    EthereumChains.Base,
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  [ROUTE_NAMES.appBuildersItem]: [
    EthereumChains.Base,
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  [ROUTE_NAMES.appBuildersForm]: [
    EthereumChains.Base,
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  [ROUTE_NAMES.appBuildersFormUpdate]: [
    EthereumChains.Base,
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
}

/**
 * Contracts that dapp utilize at the moment
 */
export enum ContractIds {
  erc1967Proxy = 'erc1967Proxy',
  stEth = 'stEth',
  mor = 'mor',
  endpoint = 'endpoint',
  l1Factory = 'l1-factory',
  l2Factory = 'l2-factory',
  subnetFactory = 'subnet-factory',
  builders = 'builders',
}

export const layerZeroEndpointIds: Record<EthereumChains, string> = {
  [EthereumChains.Ethereum]: '101',
  [EthereumChains.Sepolia]: '10161',
  [EthereumChains.Arbitrum]: '110',
  [EthereumChains.ArbitrumSepolia]: '10231',
  [EthereumChains.Base]: '',
}

export const perChainFallbackProviders: Record<EthereumChains, Provider> = {
  [EthereumChains.Ethereum]: new providers.FallbackProvider(
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
        ethers.providers.getNetwork(Number(EthereumChains.Ethereum)),
      ),
      priority: idx,
    })),
    1,
  ),
  [EthereumChains.Arbitrum]: new providers.StaticJsonRpcProvider(
    chainsMap.Arbitrum.rpcUrls[0],
  ),
  [EthereumChains.Base]: new providers.StaticJsonRpcProvider(
    chainsMap.Base.rpcUrls[0],
  ),
  [EthereumChains.Sepolia]: new providers.StaticJsonRpcProvider(
    chainsMap.Sepolia.rpcUrls[0],
    ethers.providers.getNetwork(Number(EthereumChains.Sepolia)),
  ),
  [EthereumChains.ArbitrumSepolia]: new providers.StaticJsonRpcProvider(
    chainsMap.ArbitrumSepolia.rpcUrls[0],
  ),
}

const _emptyContracts = {
  [EthereumChains.Ethereum]: '',
  [EthereumChains.Sepolia]: '',
  [EthereumChains.Arbitrum]: '',
  [EthereumChains.ArbitrumSepolia]: '',
  [EthereumChains.Base]: '',
}

export const perChainDeployedContracts: Record<
  ContractIds,
  Record<EthereumChains, string>
> = {
  [ContractIds.erc1967Proxy]: {
    ..._emptyContracts,
    [EthereumChains.Ethereum]: '0x47176B2Af9885dC6C4575d4eFd63895f7Aaa4790',
    [EthereumChains.Sepolia]: '0x7c46d6bebf3dcd902eb431054e59908a02aba524',
  },
  [ContractIds.stEth]: {
    ..._emptyContracts,
    [EthereumChains.Ethereum]: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    [EthereumChains.Sepolia]: '0xa878Ad6FF38d6fAE81FBb048384cE91979d448DA',
  },
  [ContractIds.mor]: {
    ..._emptyContracts,
    [EthereumChains.Arbitrum]: '0x092bAaDB7DEf4C3981454dD9c0A0D7FF07bCFc86',
    [EthereumChains.ArbitrumSepolia]:
      '0x34a285A1B1C166420Df5b6630132542923B5b27E',
    [EthereumChains.Base]: '0x7431aDa8a591C955a994a21710752EF9b882b8e3',
  },
  [ContractIds.endpoint]: {
    ..._emptyContracts,
    [EthereumChains.Ethereum]: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
    [EthereumChains.Sepolia]: '0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1',
  },
  [ContractIds.l1Factory]: {
    ..._emptyContracts,
    [EthereumChains.Ethereum]: '0x969C0F87623dc33010b4069Fea48316Ba2e45382',
    [EthereumChains.Sepolia]: '0xB791b1B02A8f7A32f370200c05EeeE12B9Bba10A',
  },
  [ContractIds.l2Factory]: {
    ..._emptyContracts,
    [EthereumChains.Arbitrum]: '0x890BfA255E6EE8DB5c67aB32dc600B14EBc4546c',
    [EthereumChains.ArbitrumSepolia]:
      '0x3199555a4552848D522cf3D04bb1fE4C512a5d3B',
  },
  [ContractIds.subnetFactory]: {
    ..._emptyContracts,
    [EthereumChains.Arbitrum]: '0x37B94Bd80b6012FB214bB6790B31A5C40d6Eb7A5',
    [EthereumChains.ArbitrumSepolia]:
      '0xa41178368f393a224b990779baa9b5855759d45d',
  },
  [ContractIds.builders]: {
    ..._emptyContracts,
    [EthereumChains.Arbitrum]: '0xC0eD68f163d44B6e9985F0041fDf6f67c6BCFF3f',
    [EthereumChains.ArbitrumSepolia]:
      '0x649B24D0b6F5A4c3852fD4C0dD91308902E5fe8a',
    [EthereumChains.Base]: '0x42BB446eAE6dca7723a9eBdb81EA88aFe77eF4B9',
  },
}

/**
 * Some specific features in Dapp required only specific chains to be connected on
 */
export const exceptionContractsAllowedChains = {
  Distribution__factory: [EthereumChains.Ethereum, EthereumChains.Sepolia],
  Swap: [EthereumChains.Ethereum],
  L1Sender__factory: [EthereumChains.Ethereum, EthereumChains.Sepolia],
  L2MessageReceiver__factory: [
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  L2TokenReceiver__factory: [
    EthereumChains.Arbitrum,
    EthereumChains.ArbitrumSepolia,
  ],
  MOR20__factory: [EthereumChains.Arbitrum, EthereumChains.ArbitrumSepolia],
  Subnet__factory: [EthereumChains.Arbitrum, EthereumChains.ArbitrumSepolia],
  DelegationPage: [EthereumChains.Arbitrum, EthereumChains.ArbitrumSepolia],
}

// TODO: merge
const perChainFirstApolloClients: Record<
  EthereumChains,
  ApolloClient<NormalizedCacheObject> | null
> = {
  [EthereumChains.Ethereum]: new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.studio.thegraph.com/query/67225/morpheus-dashboard/version/latest',
    }),
    cache: new InMemoryCache(),
  }),
  [EthereumChains.Arbitrum]: null,
  [EthereumChains.Sepolia]: new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.studio.thegraph.com/query/73688/morpheus-ethereum-sepolia/version/latest',
    }),
    cache: new InMemoryCache(),
  }),
  [EthereumChains.ArbitrumSepolia]: null,
  [EthereumChains.Base]: null,
}

const perChainSecondApolloClients: Record<
  EthereumChains,
  ApolloClient<NormalizedCacheObject> | null
> = {
  [EthereumChains.Ethereum]: null,
  [EthereumChains.Arbitrum]: new ApolloClient({
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
  }),
  [EthereumChains.Sepolia]: null,
  [EthereumChains.ArbitrumSepolia]: new ApolloClient({
    link: createHttpLink({
      uri: 'https://api.studio.thegraph.com/query/73688/lumerin-node-testnet/version/latest',
      // uri: 'https://subgraph.satsuma-prod.com/8675f21b07ed/9iqb9f4qcmhosiruyg763--465704/morpheus-arbitrum-sepolia/api',
    }),
    cache: new InMemoryCache(),
    queryDeduplication: false,
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  }),
  [EthereumChains.Base]: new ApolloClient({
    link: createHttpLink({
      uri: 'https://subgraph.satsuma-prod.com/8675f21b07ed/9iqb9f4qcmhosiruyg763--465704/morpheus-mainnet-base/api',
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

  EthereumChains,
  ethereumChainsTypes: ethereumChainsTypes,
  chainsMap: chainsMap,
  ContractIds: ContractIds,
  perChainFirstApolloClients: perChainFirstApolloClients,
  perChainSecondApolloClients: perChainSecondApolloClients,
  perPageAllowedNetworks: perPageAllowedNetworks,
  perChainDeployedContracts: perChainDeployedContracts,
  perChainFallbackProviders: perChainFallbackProviders,
  layerZeroEndpointIds: layerZeroEndpointIds,
  exceptionContractsAllowedChains: exceptionContractsAllowedChains,
}
