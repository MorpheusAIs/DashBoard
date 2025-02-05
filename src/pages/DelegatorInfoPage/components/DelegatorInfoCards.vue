<template>
  <div v-if="isLoaded" class="delegator-info-cards">
    <error-message v-if="isLoadFailed" />
    <delegator-info-card
      v-for="card in cards"
      class="delegator-info-cards__card"
      :key="card.title"
      :card="card"
      @modal-button-click="claim"
    />
  </div>
  <loader v-else />
</template>

<script setup lang="ts">
import DelegatorInfoCard from './DelegatorInfoCard.vue'
import { ErrorMessage, Loader } from '@/common'

import {
  useContract,
  useExceptionContractsProvider,
  useI18n,
} from '@/composables'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  fetchSubnet,
  getEthExplorerTxUrl,
  sleep,
  trimStringNumber,
} from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { BN } from '@distributedlab/tools'
import { DelegationUserCard, SubnetItem } from '@/types'
import { useRoute } from 'vue-router'
import { useSecondApolloClient } from '@/composables/use-second-apollo-client'

const { t } = useI18n()
const web3ProvidersStore = useWeb3ProvidersStore()
const route = useRoute()

const subnet = ref<SubnetItem | null>(null)
const isLoaded = ref(false)
const isLoadFailed = ref(false)
const rewards = ref('0')

const { client: apolloClient } = useSecondApolloClient()

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
    title: t('delegator-info-cards.total-fee', {
      asset: web3ProvidersStore.rewardsTokenSymbol,
    }),
    amount: totalFees.value,
  },
  {
    title: t('delegator-info-cards.subnet-fee'),
    amount: fee.value,
  },
])

const getFeeAmount = (amount: string) => {
  return BN.fromRaw(subnet.value?.fee || 0)
    .mul(BN.fromRaw(0.1).pow(25))
    .mul(BN.fromRaw(amount))
}

const fee = computed(
  () =>
    trimStringNumber(
      BN.fromRaw(subnet.value?.fee || 0)
        .div(BN.fromRaw(10).pow(23))
        .toString(),
    ) + '%',
)
const totalStaked = computed(() => {
  return trimStringNumber(
    BN.fromRaw(subnet.value?.totalStaked || 0)
      .div(BN.fromRaw(10).pow(18))
      .toString(),
  )
})
const totalClaimed = computed(() => {
  const totalClaimed = BN.fromRaw(subnet.value?.totalClaimed || 0).div(
    BN.fromRaw(10).pow(18),
  )
  const fee = getFeeAmount(totalClaimed.toString())

  return trimStringNumber(totalClaimed.sub(fee).toString())
})
const totalFees = computed(() => {
  const totalClaimed = BN.fromRaw(subnet.value?.totalClaimed || 0).div(
    BN.fromRaw(10).pow(18),
  )
  const fee = getFeeAmount(totalClaimed.toString())

  return trimStringNumber(fee.toString())
})

const rewardsShown = computed(() => {
  const reward = BN.fromRaw(rewards?.value || 0).div(BN.fromRaw(10).pow(18))
  const fee = getFeeAmount(reward.toString())

  return trimStringNumber(reward.sub(fee).toString())
})

const Subnet__factoryProvider = useExceptionContractsProvider('Subnet__factory')

const subnetContract = computed(() =>
  useContract(
    'Subnet__factory',
    route.query.subnetAddress as string,
    Subnet__factoryProvider.value,
  ),
)

const claim = async () => {
  try {
    await web3ProvidersStore.provider.selectChain(
      web3ProvidersStore.subnetFactoryContractDetails.targetChainId,
    )

    const tx = await subnetContract.value.signerBased.value.claim(
      web3ProvidersStore.address,
      rewards.value,
    )

    const explorerTxUrl = getEthExplorerTxUrl(
      web3ProvidersStore.subnetFactoryContractDetails.explorerUrl,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.info,
      t('delegator-info-cards.tx-sent-message', { explorerTxUrl }),
    )

    await tx.wait()

    bus.emit(
      BUS_EVENTS.success,
      t('delegator-info-cards.success-message', { explorerTxUrl }),
    )

    bus.emit(BUS_EVENTS.changedCurrentUserRefReward)
  } catch (e) {
    ErrorHandler.process(e)
  }
}

const loadPage = async () => {
  isLoaded.value = false
  isLoadFailed.value = false

  try {
    await web3ProvidersStore.provider.selectChain(
      web3ProvidersStore.subnetFactoryContractDetails.targetChainId,
    )

    const [data, reward] = await Promise.all([
      fetchSubnet(apolloClient.value, route.query.subnetAddress as string),
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

onMounted(() => {
  bus.on(BUS_EVENTS.changedCurrentUserRefReward, async () => {
    await sleep(1000)
    loadPage()
  })
  bus.on(BUS_EVENTS.changedDelegation, async () => {
    await sleep(1000)
    loadPage()
  })
})

onBeforeUnmount(() => {
  bus.off(BUS_EVENTS.changedCurrentUserRefReward, () => [])
  bus.off(BUS_EVENTS.changedDelegation, () => [])
})
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
