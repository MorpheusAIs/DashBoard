import { computed, ref, watch } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import {
  ERC1967Proxy,
  ReferralData,
  UserReferralDepositedAmount,
} from '@/types'
import {
  fetchDepositedAmountUserReferrers,
  fetchSpecificUserReferrers,
} from '@/common/InfoDashboard/helpers'
import { useRoute } from 'vue-router'
import { BigNumber, ethers } from 'ethers'
import { NETWORK_IDS, SORTING_ORDER } from '@/enums'

const TIERS = [0, 1, 2, 3]

export const useReferralInfo = (poolId: number) => {
  const route = useRoute()
  const web3ProviderStore = useWeb3ProvidersStore()
  const tiers = ref<Record<string, string | number>[]>([])
  const refsCount = ref(0)

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

  const getDepositedAmountByUser = async (userAddress: string) => {
    const depositedInfo = await fetchDepositedAmountUserReferrers(
      poolId,
      userAddress,
      route.query.network,
    )
    refsCount.value = depositedInfo.length
    return depositedInfo.reduce(
      (acc: BigNumber, item: UserReferralDepositedAmount) => {
        acc = acc.add(item.amount)
        return acc
      },
      BigNumber.from(0),
    )
  }

  const findTierIndex = (amountStaked: ethers.BigNumber): number => {
    let resultIndex = 0
    tiers.value.forEach(tier => {
      if (amountStaked.gte(BigNumber.from(tier.amount))) {
        resultIndex = tier.idx
      }
    })
    return resultIndex
  }

  const getRefData = async (userAddress: string): Promise<ReferralData> => {
    const [currentReward, multiplier, refData, depositedAmount] =
      await Promise.all([
        getCurrentReferrerReward(userAddress),
        getReferrerMultiplier(userAddress),
        getReferrersData(userAddress),
        getDepositedAmountByUser(userAddress),
      ])

    const foundTier = findTierIndex(refData.amountStaked)

    return {
      depositedAmount,
      currentReward,
      multiplier,
      tier: foundTier?.idx ?? '0',
      ...refData,
    }
  }

  const loadReferralDepositDataWithPagination = async (
    referrer: string,
    page: number,
    limit: number,
    order: SORTING_ORDER,
    type: NETWORK_IDS,
  ) => {
    const skip = (page - 1) * limit
    return fetchSpecificUserReferrers(
      poolId,
      referrer,
      skip,
      limit,
      order,
      type,
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
    refsCount,

    getDepositedAmountByUser,
    loadReferralDepositDataWithPagination,
    getRefData,
  }
}
