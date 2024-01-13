import { ETHEREUM_CHAINS } from '@/enums'
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
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io/'],
  })

export const ARBITRUM_GOERLI_NETWORK_CONFIG: Readonly<Web3ProviderType.Chain> =
  Object.freeze({
    chainId: utils.hexValue(Number(ETHEREUM_CHAINS.arbitrumGoerli)),
    chainName: 'Arbitrum Goerli (Testnet)',
    nativeCurrency: {
      name: 'Goerli ETH',
      symbol: 'Goerli ETH',
      decimals: 18,
    },
    rpcUrls: ['https://goerli-rollup.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://goerli.arbiscan.io'],
  })

export const CHAINS_NETWORK_CONFIGS_MAP: Readonly<
  Record<Web3ProviderType.ChainId, Web3ProviderType.Chain>
> = Object.freeze({
  [ETHEREUM_CHAINS.arbitrum]: ARBITRUM_NETWORK_CONFIG,
  [ETHEREUM_CHAINS.arbitrumGoerli]: ARBITRUM_GOERLI_NETWORK_CONFIG,
})
