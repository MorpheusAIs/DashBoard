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
import { IUseContract, useContract } from '@/composables'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWeb3ProvidersStore } from '@/store'
import { TokenContractInfo } from '@/types'
import { ErrorHandler } from '@/helpers'
import { NETWORK_IDS } from '@config'
import { ETHEREUM_CHAIN_NAMES } from '@/enums'
import { useI18n } from 'vue-i18n'
import { ethers } from 'ethers'
import { config } from '@config'
import { ErrorMessage, Loader } from '@/common'

const route = useRoute()
const { t } = useI18n()
const web3ProvidersStore = useWeb3ProvidersStore()
const contractInfo = ref<TokenContractInfo | null>(null)
const isLoaded = ref(false)
const isLoadFailed = ref(false)

const network = computed(() =>
  route.query.network === NETWORK_IDS.mainnet
    ? ETHEREUM_CHAIN_NAMES.ethereum
    : ETHEREUM_CHAIN_NAMES.sepolia,
)

const explorerUrl = computed(
  () =>
    `${
      network.value === ETHEREUM_CHAIN_NAMES.ethereum
        ? config.networksMap.mainnet.l1.explorerUrl
        : config.networksMap.testnet.l1.explorerUrl
    }/address/`,
)

const contract = computed<IUseContract<'Distribution__factory'> | null>(() => {
  if (!route.query.contractAddress) {
    return null
  }
  return useContract(
    'Distribution__factory',
    route.query.contractAddress,
    web3ProvidersStore.l1Provider,
  )
})

const contractData = computed(() => [
  {
    title: t('distribution-contract-info.deposit-token'),
    value: contractInfo.value?.depositToken,
    link: `${explorerUrl.value}${contractInfo.value?.depositToken}`,
  },
  {
    title: t('distribution-contract-info.fee-config'),
    value: contractInfo.value?.feeConfig,
    link: `${explorerUrl.value}${contractInfo.value?.feeConfig}`,
  },
  {
    title: t('distribution-contract-info.l1-sender'),
    value: contractInfo.value?.l1Sender,
    link: `${explorerUrl.value}${contractInfo.value?.l1Sender}`,
  },
  {
    title: t('distribution-contract-info.overplus'),
    value: contractInfo.value?.overplus,
  },
  {
    title: t('distribution-contract-info.owner'),
    value: contractInfo.value?.owner,
    link: `${explorerUrl.value}${contractInfo.value?.owner}`,
  },
  {
    title: t('distribution-contract-info.total-deposited-in-public-pools'),
    value: `${contractInfo.value?.totalDepositedInPublicPools} ETH`,
  },
])

const init = async () => {
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
      overplus,
      owner,
      totalDepositedInPublicPools: Number(
        ethers.utils.formatUnits(totalDepositedInPublicPools.toString()),
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

.distribution-contract-info__data {
  margin-top: toRem(10);
}

.distribution-contract-info__system-message {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translateX(50%) translateY(-50%);
}
</style>
