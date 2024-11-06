import { ref, watch } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { ERC1967Proxy } from '@/types'

const TIERS = [0, 1, 2, 3]

export const useReferralInfo = (poolId: number) => {
  const web3ProviderStore = useWeb3ProvidersStore()
  const tiers = ref<Record<string, string>[]>([])

  const loadTiersData = async () => {
    tiers.value = await Promise.all(
      TIERS.map(async tier => {
        const { amount, multiplier } = await (
          web3ProviderStore.erc1967ProxyContract.providerBased
            .value as ERC1967Proxy
        ).referrerTiers(poolId, tier)
        return {
          amount: amount.toString(),
          multiplier: multiplier.toString(),
        }
      }),
    )
  }

  watch(
    [() => web3ProviderStore.address, () => web3ProviderStore.provider.chainId],
    () => {
      loadTiersData()
    },
    { immediate: true },
  )
  return {
    tiers,
  }
}
