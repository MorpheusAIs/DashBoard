import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { config, EthereumChains, NetworkTypes } from '@config'
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
): {
  client: Ref<ApolloClient<NormalizedCacheObject>>
  clients: Ref<Record<EthereumChains, ApolloClient<NormalizedCacheObject>>>
} => {
  const route = useRoute()

  const currentAllowedChainsForRoute = computed(
    () => config.perPageAllowedNetworks[route.name as ROUTE_NAMES],
  )

  const { networkType, provider } = storeToRefs(useWeb3ProvidersStore())
  const client = ref<ApolloClient<NormalizedCacheObject>>(
    getDefaultSecondApolloClient(networkType.value),
  )

  const allowedChainsForRouteUnderNetworkType = computed(() =>
    currentAllowedChainsForRoute.value.filter(el =>
      config.ethereumChainsTypes[networkType.value].includes(el),
    ),
  )

  const clients = computed<
    Record<EthereumChains, ApolloClient<NormalizedCacheObject>>
  >(() => {
    return allowedChainsForRouteUnderNetworkType.value.reduce(
      (acc, curr) => {
        if (config.perChainSecondApolloClients[curr]) {
          acc[curr] = config.perChainSecondApolloClients[curr]
        }

        return acc
      },
      {} as Record<EthereumChains, ApolloClient<NormalizedCacheObject>>,
    )
  })

  watch(
    [() => provider.value.chainId],
    () => {
      if (initial) {
        client.value = config.perChainSecondApolloClients[initial]!

        return
      }

      const clientForCurrentChain =
        config.perChainSecondApolloClients[
          provider.value
            .chainId as keyof typeof config.perChainSecondApolloClients
        ]

      const isCurrentChainUnderAllowedList =
        allowedChainsForRouteUnderNetworkType.value.includes(
          provider.value
            .chainId as keyof typeof config.perChainSecondApolloClients,
        )

      if (clientForCurrentChain && isCurrentChainUnderAllowedList) {
        client.value = clientForCurrentChain

        return
      }

      const newClient = allowedChainsForRouteUnderNetworkType.value
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

  return {
    client: client as Ref<ApolloClient<NormalizedCacheObject>>,
    clients: clients,
  }
}
