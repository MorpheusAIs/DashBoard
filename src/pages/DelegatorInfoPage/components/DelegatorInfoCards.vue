<template>
  <div class="delegator-info-cards">
    <delegator-info-card
      v-for="card in cards"
      class="delegator-info-cards__card"
      :key="card.title"
      :card="card"
      @modal-button-click="claim"
    />
  </div>
</template>

<script setup lang="ts">
import DelegatorInfoCard from './DelegatorInfoCard.vue'

import { useContract, useI18n } from '@/composables'
import { computed, ref } from 'vue'
import { ErrorHandler, fetchSubnet, trimStringNumber } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { BN } from '@distributedlab/tools'
import { DelegationUserCard, SubnetItem } from '@/types'
import { useRoute } from 'vue-router'
import { config } from '@/config'

const { t } = useI18n()
const web3ProvidersStore = useWeb3ProvidersStore()
const route = useRoute()

const subnet = ref<SubnetItem | null>(null)
const isLoaded = ref(false)
const isLoadFailed = ref(false)
const rewards = ref('0')

const isRewardClaimable = computed(() =>
  BN.fromRaw(rewards.value).gt(BN.fromRaw(0)),
)

const cards = computed<DelegationUserCard[]>(() => [
  ...(isRewardClaimable.value
    ? [
        {
          title: t('delegator-info-cards.reward', {
            asset: web3ProvidersStore.rewardsTokenSymbol,
          }),
          amount: rewardsShown.value,
          buttonText: t('delegator-info-cards.claim-button'),
        },
      ]
    : []),
  {
    title: t('delegator-info-cards.total-claimed', {
      asset: web3ProvidersStore.rewardsTokenSymbol,
    }),
    amount: totalClaimed.value,
  },
  {
    title: t('delegator-info-cards.total-staked', {
      asset: web3ProvidersStore.rewardsTokenSymbol,
    }),
    amount: totalStaked.value,
  },
  {
    title: t('delegator-info-cards.subnet-fee'),
    amount: fee.value,
  },
])

const fee = computed(
  () =>
    trimStringNumber(
      BN.fromRaw(subnet.value?.fee || 0)
        .div(BN.fromRaw(10).pow(23))
        .toString(),
    ) + '%',
)
const totalStaked = computed(() =>
  trimStringNumber(
    BN.fromRaw(subnet.value?.totalStaked || 0)
      .div(BN.fromRaw(10).pow(18))
      .toString(),
  ),
)
const totalClaimed = computed(() =>
  trimStringNumber(
    BN.fromRaw(subnet.value?.totalClaimed || 0)
      .div(BN.fromRaw(10).pow(18))
      .toString(),
  ),
)

const rewardsShown = computed(() => {
  const reward = BN.fromRaw(rewards?.value || 0)
  const fee = BN.fromRaw(subnet.value?.fee || 0)
    .mul(BN.fromRaw(0.1).pow(25))
    .mul(reward)
  // const fee = BN.fromRaw(0)

  return trimStringNumber(reward.sub(fee).toString())
})

const subnetContract = computed(() =>
  useContract(
    'Subnet__factory',
    route.query.subnetAddress as string,
    web3ProvidersStore.l2Provider,
  ),
)

const claim = async () => {
  try {
    await web3ProvidersStore.provider.selectChain(
      config.networksMap[web3ProvidersStore.networkId].l2.chainId,
    )

    await subnetContract.value.signerBased.value.claim(
      web3ProvidersStore.address,
      rewards.value,
    )
  } catch (e) {
    ErrorHandler.process(e)
  }
}

const loadPage = async () => {
  isLoaded.value = false
  isLoadFailed.value = false

  try {
    await web3ProvidersStore.provider.selectChain(
      config.networksMap[web3ProvidersStore.networkId].l2.chainId,
    )

    const [data, reward] = await Promise.all([
      fetchSubnet(
        web3ProvidersStore.networkId,
        route.query.subnetAddress as string,
      ),
      subnetContract.value.providerBased.value.getCurrentStakerRewards(
        web3ProvidersStore.address,
      ),
    ])

    rewards.value = reward.toString()

    subnet.value = data.subnets?.[0] || null
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.process(e)
  }

  isLoaded.value = true
}

loadPage()
</script>

<style scoped lang="scss">
.delegator-info-cards {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
}

.delegator-info-cards__card {
  flex: 1;
}
</style>
