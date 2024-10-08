<template>
  <div class="l1sender-contract-info">
    <template v-if="isLoaded">
      <error-message
        v-if="isLoadFailed"
        class="l1sender-contract-info__system-message"
        :message="$t('l1sender-contract-info.error-message')"
      />
      <template v-else>
        <contract-info-header
          :name="$t('l1sender-contract-info.title')"
          :network="network"
        />
        <contract-info-data
          class="l1sender-contract-info__data"
          :data="contractData"
        />
      </template>
    </template>
    <loader v-else class="l1sender-contract-info__system-message" />
  </div>
</template>

<script setup lang="ts">
import { ContractInfoHeader, ContractInfoData } from './ContractInfo'
import { IUseContract, useContract } from '@/composables'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWeb3ProvidersStore } from '@/store'
import { L1SenderContractInfo } from '@/types'
import { ErrorHandler } from '@/helpers'
import { ETHEREUM_CHAIN_NAMES } from '@/enums'
import { useI18n } from 'vue-i18n'
import { ErrorMessage, Loader } from '@/common'

const props = defineProps<{
  network: ETHEREUM_CHAIN_NAMES
  explorerUrl: string
}>()

const route = useRoute()
const { t } = useI18n()
const web3ProvidersStore = useWeb3ProvidersStore()
const contractInfo = ref<L1SenderContractInfo | null>(null)
const isLoaded = ref(false)
const isLoadFailed = ref(false)

const contract = computed<IUseContract<'L1Sender__factory'> | null>(() => {
  if (!route.query.contractAddress) {
    return null
  }
  return useContract(
    'L1Sender__factory',
    route.query.contractAddress,
    web3ProvidersStore.l1Provider,
  )
})

const contractData = computed(() => [
  {
    title: t('l1sender-contract-info.deposit-token-config'),
    value: [
      {
        title: t('l1sender-contract-info.token'),
        value: contractInfo.value?.depositTokenConfig.token,
        link: `${props.explorerUrl}${contractInfo.value?.depositTokenConfig.token}`,
      },
      {
        title: t('l1sender-contract-info.gateway'),
        value: contractInfo.value?.depositTokenConfig.gateway,
        link: `${props.explorerUrl}${contractInfo.value?.depositTokenConfig.gateway}`,
      },
      {
        title: t('l1sender-contract-info.receiver'),
        value: contractInfo.value?.depositTokenConfig.receiver,
        link: `${props.explorerUrl}${contractInfo.value?.depositTokenConfig.receiver}`,
      },
    ],
  },
  {
    title: t('l1sender-contract-info.distribution'),
    value: contractInfo.value?.distribution,
    link: `${props.explorerUrl}${contractInfo.value?.distribution}`,
  },
  {
    title: t('l1sender-contract-info.owner'),
    value: contractInfo.value?.owner,
    link: `${props.explorerUrl}${contractInfo.value?.owner}`,
  },
  {
    title: t('l1sender-contract-info.reward-token-config'),
    value: [
      {
        title: t('l1sender-contract-info.gateway'),
        value: contractInfo.value?.rewardTokenConfig.gateway,
        link: `${props.explorerUrl}${contractInfo.value?.rewardTokenConfig.gateway}`,
      },
      {
        title: t('l1sender-contract-info.receiver'),
        value: contractInfo.value?.rewardTokenConfig.receiver,
        link: `${props.explorerUrl}${contractInfo.value?.rewardTokenConfig.receiver}`,
      },
      {
        title: t('l1sender-contract-info.receiver-chain-id'),
        value: contractInfo.value?.rewardTokenConfig.receiverChainId,
      },
      {
        title: t('l1sender-contract-info.zro-payment-address'),
        value: contractInfo.value?.rewardTokenConfig.zroPaymentAddress,
      },
    ],
  },
  {
    title: t('l1sender-contract-info.unwrapped-deposit-token'),
    value: contractInfo.value?.unwrappedDepositToken,
    link: `${props.explorerUrl}${contractInfo.value?.unwrappedDepositToken}`,
  },
])

const init = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const [
      depositTokenConfig,
      distribution,
      owner,
      rewardTokenConfig,
      unwrappedDepositToken,
    ] = await Promise.all([
      contract.value.providerBased.value.depositTokenConfig(),
      contract.value.providerBased.value.distribution(),
      contract.value.providerBased.value.owner(),
      contract.value.providerBased.value.rewardTokenConfig(),
      contract.value.providerBased.value.unwrappedDepositToken(),
    ])
    contractInfo.value = {
      depositTokenConfig,
      distribution,
      owner,
      rewardTokenConfig,
      unwrappedDepositToken,
    }
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

watch(contract, init, { immediate: true })
</script>

<style scoped lang="scss">
.l1sender-contract-info {
  @include contract-info;
}

.l1sender-contract-info__data {
  margin-top: toRem(10);
}

.l1sender-contract-info__system-message {
  @include system-message;
}
</style>
