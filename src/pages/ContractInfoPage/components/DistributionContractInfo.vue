<template>
  <div class="distribution-contract-info">
    <template v-if="isLoaded">
      <error-message
        v-if="isLoadFailed"
        class="distribution-contract-info__system-message"
        :message="$t('distribution-contract-info.error-message')"
      />
      <template v-else>
        <contract-info-header
          :name="$t('distribution-contract-info.title')"
          :network="network"
        />
        <contract-info-data
          class="distribution-contract-info__data"
          :data="contractData"
        />
      </template>
    </template>
    <loader v-else class="distribution-contract-info__system-message" />
  </div>
</template>

<script setup lang="ts">
import { ContractInfoHeader, ContractInfoData } from './ContractInfo'
import {
  IUseContract,
  useContract,
  useExceptionContractsProvider,
} from '@/composables'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { DistributionContractInfo } from '@/types'
import { ErrorHandler } from '@/helpers'
import { useI18n } from 'vue-i18n'
import { ethers } from 'ethers'
import { ErrorMessage, Loader } from '@/common'
import { EthereumChains } from '@config'

const props = defineProps<{
  network: EthereumChains
  explorerUrl: string
}>()

const route = useRoute()
const { t } = useI18n()
const contractInfo = ref<DistributionContractInfo | null>(null)
const isLoaded = ref(false)
const isLoadFailed = ref(false)

const DistrProvider = useExceptionContractsProvider('Distribution__factory')

const contract = computed<IUseContract<'Distribution__factory'> | null>(() => {
  if (!route.query.contractAddress) {
    return null
  }
  return useContract(
    'Distribution__factory',
    String(route.query.contractAddress),
    DistrProvider.value,
  )
})

const contractData = computed(() => [
  {
    title: t('distribution-contract-info.deposit-token'),
    value: contractInfo.value?.depositToken,
    link: `${props.explorerUrl}${contractInfo.value?.depositToken}`,
  },
  {
    title: t('distribution-contract-info.fee-config'),
    value: contractInfo.value?.feeConfig,
    link: `${props.explorerUrl}${contractInfo.value?.feeConfig}`,
  },
  {
    title: t('distribution-contract-info.l1-sender'),
    value: contractInfo.value?.l1Sender,
    link: `${props.explorerUrl}${contractInfo.value?.l1Sender}`,
  },
  {
    title: t('distribution-contract-info.overplus'),
    value: contractInfo.value?.overplus,
  },
  {
    title: t('distribution-contract-info.owner'),
    value: contractInfo.value?.owner,
    link: `${props.explorerUrl}${contractInfo.value?.owner}`,
  },
  {
    title: t('distribution-contract-info.total-deposited-in-public-pools'),
    value: `${contractInfo.value?.totalDepositedInPublicPools} ETH`,
  },
])

const init = async () => {
  if (!contract.value) return

  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const [
      depositToken,
      feeConfig,
      l1Sender,
      overplus,
      owner,
      totalDepositedInPublicPools,
    ] = await Promise.all([
      contract.value.providerBased.value.depositToken(),
      contract.value.providerBased.value.feeConfig(),
      contract.value.providerBased.value.l1Sender(),
      contract.value.providerBased.value.overplus(),
      contract.value.providerBased.value.owner(),
      contract.value.providerBased.value.totalDepositedInPublicPools(),
    ])
    contractInfo.value = {
      depositToken,
      feeConfig,
      l1Sender,
      overplus: overplus?.toString(),
      owner,
      totalDepositedInPublicPools: Number(
        ethers.utils.formatUnits(totalDepositedInPublicPools?.toString() ?? 0),
      )
        .toFixed(3)
        .replace(/\.0+$/, ''),
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
.distribution-contract-info {
  @include contract-info;
}

.distribution-contract-info__data {
  margin-top: toRem(10);
}

.distribution-contract-info__system-message {
  @include system-message;
}
</style>
