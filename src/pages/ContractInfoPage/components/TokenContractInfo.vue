<template>
  <div class="token-contract-info">
    <template v-if="isLoaded">
      <error-message
        v-if="isLoadFailed"
        class="token-contract-info__system-message"
        :message="$t('token-contract-info.error-message')"
      />
      <template v-else>
        <contract-info-header
          :symbol="contractInfo?.symbol ?? ''"
          :name="contractInfo?.name ?? ''"
          :description="$t('token-contract-info.description')"
          :project-name="props.projectName"
          :network="network"
        />
        <contract-info-data
          class="token-contract-info__data"
          :data="contractData"
        />
      </template>
    </template>
    <loader v-else class="token-contract-info__system-message" />
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
import { TokenContractInfo } from '@/types'
import { ErrorHandler } from '@/helpers'
import { useI18n } from 'vue-i18n'
import { ethers } from 'ethers'
import { ErrorMessage, Loader } from '@/common'
import { EthereumChains } from '@config'

const props = defineProps<{
  projectName: string
  network: EthereumChains
  explorerUrl: string
}>()

const route = useRoute()
const { t } = useI18n()
const contractInfo = ref<TokenContractInfo | null>(null)
const isLoaded = ref(false)
const isLoadFailed = ref(false)

const MOR20__factoryProvider = useExceptionContractsProvider('MOR20__factory')

const contract = computed<IUseContract<'MOR20__factory'> | null>(() => {
  if (!route.query.contractAddress) {
    return null
  }
  return useContract(
    'MOR20__factory',
    String(route.query.contractAddress),
    MOR20__factoryProvider.value,
  )
})

const contractData = computed(() => [
  {
    title: t('token-contract-info.decimals'),
    value: contractInfo.value?.decimals,
  },
  {
    title: t('token-contract-info.total-supply'),
    value: `${ethers.utils.formatUnits(
      contractInfo.value?.totalSupply ?? 0,
      'ether',
    )} ETH`,
  },
  {
    title: t('token-contract-info.owner'),
    value: contractInfo.value?.owner,
    link: `${props.explorerUrl}${contractInfo.value?.owner}`,
  },
  {
    title: t('token-contract-info.endpoint'),
    value: contractInfo.value?.endpoint,
    link: `${props.explorerUrl}${contractInfo.value?.endpoint}`,
  },
  {
    title: t('token-contract-info.pre-crime'),
    value: contractInfo.value?.preCrime,
  },
  {
    title: t('token-contract-info.shared-decimals'),
    value: contractInfo.value?.sharedDecimals,
  },
  {
    title: t('token-contract-info.oft-version'),
    value: [
      {
        title: t('token-contract-info.interface-id'),
        value: ethers.BigNumber.from(
          contractInfo.value?.oftVersion.interfaceId,
        ).toString(),
      },
      {
        title: t('token-contract-info.version'),
        value: contractInfo.value?.oftVersion.version,
      },
    ],
  },
  {
    title: t('token-contract-info.oapp-version'),
    value: [
      {
        title: t('token-contract-info.sender-version'),
        value: contractInfo.value?.oAppVersion.senderVersion,
      },
      {
        title: t('token-contract-info.receiver-version'),
        value: contractInfo.value?.oAppVersion.receiverVersion,
      },
    ],
  },
  {
    title: t('token-contract-info.is-approval-required'),
    value: contractInfo.value?.approvalRequired,
  },
])

const init = async () => {
  if (!contract.value) return

  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const [
      approvalRequired,
      decimals,
      oApp,
      oAppVersion,
      endpoint,
      oftVersion,
      owner,
      preCrime,
      sharedDecimals,
      totalSupply,
      name,
      symbol,
    ] = await Promise.all([
      contract.value.providerBased.value.approvalRequired(),
      contract.value.providerBased.value.decimals(),
      contract.value.providerBased.value.oApp(),
      contract.value.providerBased.value.oAppVersion(),
      contract.value.providerBased.value.endpoint(),
      contract.value.providerBased.value.oftVersion(),
      contract.value.providerBased.value.owner(),
      contract.value.providerBased.value.preCrime(),
      contract.value.providerBased.value.sharedDecimals(),
      contract.value.providerBased.value.totalSupply(),
      contract.value.providerBased.value.name(),
      contract.value.providerBased.value.symbol(),
    ])
    contractInfo.value = {
      approvalRequired: Boolean(approvalRequired),
      decimals: decimals.toString(),
      oApp,
      oAppVersion: {
        receiverVersion: oAppVersion.receiverVersion.toString(),
        senderVersion: oAppVersion.senderVersion.toString(),
      },
      endpoint,
      oftVersion: {
        interfaceId: oftVersion.interfaceId,
        version: oftVersion.version.toString(),
      },
      owner,
      preCrime,
      sharedDecimals,
      totalSupply: totalSupply.toString(),
      symbol,
      name,
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
.token-contract-info {
  padding: toRem(40);
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    180deg,
    var(--border-quaternary-main) 0%,
    var(--border-quaternary-light) 100%
  );
  background: linear-gradient(
      180deg,
      var(--background-tertiary-main) 0%,
      var(--background-tertiary-dark) 100%
    ),
    linear-gradient(
      180deg,
      var(--border-quaternary-main) 0%,
      var(--border-quaternary-light) 100%
    );
}

.token-contract-info__data {
  margin-top: toRem(10);
}

.token-contract-info__system-message {
  @include system-message;
}
</style>
