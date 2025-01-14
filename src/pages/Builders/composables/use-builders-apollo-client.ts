import { storeToRefs } from 'pinia'
import { useWeb3ProvidersStore } from '@/store'
import { config } from '@config'

export const useBuildersApolloClient = () => {
  const { networkId } = storeToRefs(useWeb3ProvidersStore())

  return config.secondApolloClient[networkId.value]
}
