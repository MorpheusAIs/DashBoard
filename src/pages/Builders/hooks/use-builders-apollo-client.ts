import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { config, NETWORK_IDS } from '@config'

export const useBuildersApolloClient = () => {
  const { networkId } = storeToRefs(useWeb3ProvidersStore())

  return networkId.value === NETWORK_IDS.mainnet
    ? config.secondMainnetApolloClient
    : config.secondMainnetApolloClient
}
