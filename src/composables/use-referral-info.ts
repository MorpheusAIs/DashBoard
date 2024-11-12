import { computed, ref, watch } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { ERC1967Proxy, ReferralData } from '@/types'

const TIERS = [0, 1, 2, 3]

export const useReferralInfo = (poolId: number) => {
  const web3ProviderStore = useWeb3ProvidersStore()
  const tiers = ref<Record<string, string | number>[]>([])

  const erc1967Contract = computed(
    () =>
      web3ProviderStore.erc1967ProxyContract.providerBased
        .value as ERC1967Proxy,
  )

  const loadTiersData = async () => {
    tiers.value = await Promise.all(
      TIERS.map(async (tier, idx) => {
        const { amount, multiplier } =
          await erc1967Contract.value.referrerTiers(poolId, tier)
        return {
          amount: amount.toString(),
          multiplier: multiplier.toString(),
          idx,
        }
      }),
    )
  }

  const getCurrentReferrerReward = async (userAddress: string) =>
    erc1967Contract.value.getCurrentReferrerReward(poolId, userAddress)

  const getReferrerMultiplier = async (userAddress: string) =>
    erc1967Contract.value.getReferrerMultiplier(poolId, userAddress)

  const getReferrersData = async (userAddress: string) => {
    const [amountStaked, virtualAmountStaked, rate, pendingRewards, lastClaim] =
      await erc1967Contract.value.referrersData(userAddress, poolId)

    return {
      amountStaked,
      virtualAmountStaked,
      rate,
      pendingRewards,
      lastClaim,
    }
  }

  const getRefData = async (userAddress: string): Promise<ReferralData> => {
    const [currentReward, multiplier, refData] = await Promise.all([
      getCurrentReferrerReward(userAddress),
      getReferrerMultiplier(userAddress),
      getReferrersData(userAddress),
    ])

    const foundTier = tiers.value.find(
      tier => tier.multiplier === multiplier.toString(),
    )

    return {
      currentReward,
      multiplier,
      tier: foundTier?.idx ?? '0',
      ...refData,
    }
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

    getRefData,
  }
}
