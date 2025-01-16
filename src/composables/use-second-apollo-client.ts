import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { config, NetworkTypes } from '@config'
import { computed, Ref, ref, watch } from 'vue'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core'
import { useRoute } from 'vue-router'
import { ROUTE_NAMES } from '@/enums'

const getDefaultSecondApolloClient = (networkType: NetworkTypes) => {
  if (networkType === NetworkTypes.Mainnet) {
    return config.perChainSecondApolloClients[config.EthereumChains.Ethereum]!
  }

  return config.perChainSecondApolloClients[config.EthereumChains.Sepolia]!
}

export const useSecondApolloClient = (
  initial?: keyof typeof config.perChainSecondApolloClients,
): Ref<ApolloClient<NormalizedCacheObject>> => {
  const route = useRoute()

  const currentAllowedChainsForRoute = computed(
    () => config.perPageAllowedNetworks[route.name as ROUTE_NAMES],
  )

  const { networkType, provider } = storeToRefs(useWeb3ProvidersStore())
  const client = ref<ApolloClient<NormalizedCacheObject>>(
    getDefaultSecondApolloClient(networkType.value),
  )

  watch(
    [() => provider.value.chainId],
    () => {
      if (initial) {
        client.value = config.perChainSecondApolloClients[initial]!

        return
      }

      const allowedChainsForRouteUnderNetworkType =
        currentAllowedChainsForRoute.value.filter(el =>
          config.ethereumChainsTypes[networkType.value].includes(el),
        )

      const clientForCurrentChain =
        config.perChainSecondApolloClients[
          provider.value
            .chainId as keyof typeof config.perChainSecondApolloClients
        ]

      const isCurrentChainUnderAllowedList =
        allowedChainsForRouteUnderNetworkType.includes(
          provider.value
            .chainId as keyof typeof config.perChainSecondApolloClients,
        )

      if (clientForCurrentChain && isCurrentChainUnderAllowedList) {
        client.value = clientForCurrentChain

        return
      }

      const newClient = allowedChainsForRouteUnderNetworkType
        .map(el => config.perChainSecondApolloClients[el])
        .find(el => el !== null)

      if (newClient) {
        client.value = newClient
      }
    },
    {
      immediate: true,
    },
  )

  return client as Ref<ApolloClient<NormalizedCacheObject>>
}
