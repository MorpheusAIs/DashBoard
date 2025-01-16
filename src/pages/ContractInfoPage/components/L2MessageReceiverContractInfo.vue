<template>
  <div class="l2-message-receiver-contract-info">
    <template v-if="isLoaded">
      <error-message
        v-if="isLoadFailed"
        class="l2-message-receiver-contract-info__system-message"
        :message="$t('l2-message-receiver-contract-info.error-message')"
      />
      <template v-else>
        <contract-info-header
          :name="$t('l2-message-receiver-contract-info.title')"
          :network="network"
        />
        <contract-info-data
          class="l2-message-receiver-contract-info__data"
          :data="contractData"
        />
      </template>
    </template>
    <loader v-else class="l2-message-receiver-contract-info__system-message" />
  </div>
</template>

<script setup lang="ts">
import { ContractInfoHeader, ContractInfoData } from './ContractInfo'
import { IUseContract, useContract } from '@/composables'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWeb3ProvidersStore } from '@/store'
import { L2MessageReceiverContractInfo } from '@/types'
import { ErrorHandler } from '@/helpers'
import { useI18n } from 'vue-i18n'
import { ErrorMessage, Loader } from '@/common'
import { EthereumChains } from '@config'

const props = defineProps<{
  network: EthereumChains
  explorerUrl: string
}>()

const route = useRoute()
const { t } = useI18n()
const web3ProvidersStore = useWeb3ProvidersStore()
const contractInfo = ref<L2MessageReceiverContractInfo | null>(null)
const isLoaded = ref(false)
const isLoadFailed = ref(false)

const contract = computed<IUseContract<'L2MessageReceiver__factory'> | null>(
  () => {
    if (!route.query.contractAddress) {
      return null
    }
    return useContract(
      'L2MessageReceiver__factory',
      route.query.contractAddress,
      web3ProvidersStore.l2Provider,
    )
  },
)

const contractData = computed(() => [
  {
    title: t('l2-message-receiver-contract-info.config'),
    value: [
      {
        title: t('l2-message-receiver-contract-info.gateway'),
        value: contractInfo.value?.config.gateway,
        link: `${props.explorerUrl}${contractInfo.value?.config.gateway}`,
      },
      {
        title: t('l2-message-receiver-contract-info.sender'),
        value: contractInfo.value?.config.sender,
        link: `${props.explorerUrl}${contractInfo.value?.config.sender}`,
      },
      {
        title: t('l2-message-receiver-contract-info.sender-chain-id'),
        value: contractInfo.value?.config.senderChainId,
      },
    ],
  },
  {
    title: t('l2-message-receiver-contract-info.owner'),
    value: contractInfo.value?.owner,
    link: `${props.explorerUrl}${contractInfo.value?.owner}`,
  },
  {
    title: t('l2-message-receiver-contract-info.reward-token'),
    value: contractInfo.value?.rewardToken,
    link: `${props.explorerUrl}${contractInfo.value?.rewardToken}`,
  },
])

const init = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const [config, owner, rewardToken] = await Promise.all([
      contract.value.providerBased.value.config(),
      contract.value.providerBased.value.owner(),
      contract.value.providerBased.value.rewardToken(),
    ])
    contractInfo.value = {
      config,
      owner,
      rewardToken,
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
.l2-message-receiver-contract-info {
  @include contract-info;
}

.l2-message-receiver-contract-info__data {
  margin-top: toRem(10);
}

.l2-message-receiver-contract-info__system-message {
  @include system-message;
}
</style>
