import { config, EthereumChains } from '@config'
import { computed } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { providers } from 'ethers'

export const useLimitedProvider = (allowedChains: EthereumChains[]) => {
  const web3ProviderStore = useWeb3ProvidersStore()

  return computed(() => {
    if (
      allowedChains.includes(
        String(web3ProviderStore.provider.chainId) as EthereumChains,
      )
    ) {
      return new providers.Web3Provider(
        web3ProviderStore.provider.rawProvider as providers.ExternalProvider,
      )
    }

    const allowedChainsUnderNetworkType = allowedChains.filter(el => {
      return config.ethereumChainsTypes[web3ProviderStore.networkType].includes(
        el,
      )
    })

    return config.perChainFallbackProviders[allowedChainsUnderNetworkType[0]]
  })
}
