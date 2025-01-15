import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { config, NetworkTypes } from '@config'
import { computed, Ref, ref, watch } from 'vue'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core'
import { useRoute } from 'vue-router'
import { ROUTE_NAMES } from '@/enums'

const getDefaultFirstApolloClient = (networkType: NetworkTypes) => {
  if (networkType === NetworkTypes.Mainnet) {
    return config.perChainFirstApolloClients[config.EthereumChains.Ethereum]!
  }

  return config.perChainFirstApolloClients[config.EthereumChains.Sepolia]!
}

export const useFirstApolloClient = (
  initial?: keyof typeof config.perChainFirstApolloClients,
): Ref<ApolloClient<NormalizedCacheObject>> => {
  const route = useRoute()

  const currentAllowedChainsForRoute = computed(
    () => config.perPageAllowedNetworks[route.name as ROUTE_NAMES],
  )

  const { networkType, provider } = storeToRefs(useWeb3ProvidersStore())
  const client = ref<ApolloClient<NormalizedCacheObject>>(
    getDefaultFirstApolloClient(networkType.value),
  )

  watch(
    [() => provider.value.chainId],
    () => {
      if (initial) {
        client.value = config.perChainFirstApolloClients[initial]!

        return
      }

      const allowedChainsForRouteUnderNetworkType =
        currentAllowedChainsForRoute.value.filter(el =>
          config.ethereumChainsTypes[networkType.value].includes(el),
        )

      const clientForCurrentChain =
        config.perChainFirstApolloClients[
          provider.value
            .chainId as keyof typeof config.perChainFirstApolloClients
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
        .map(el => config.perChainFirstApolloClients[el])
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
