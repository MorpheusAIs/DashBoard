<template>
  <div class="l2-token-receiver-contract-info">
    <template v-if="isLoaded">
      <error-message
        v-if="isLoadFailed"
        class="l2-token-receiver-contract-info__system-message"
        :message="$t('l2-token-receiver-contract-info.error-message')"
      />
      <template v-else>
        <contract-info-header
          :name="$t('l2-token-receiver-contract-info.title')"
          :network="network"
        />
        <contract-info-data
          class="l2-token-receiver-contract-info__data"
          :data="contractData"
        />
      </template>
    </template>
    <loader v-else class="l2-token-receiver-contract-info__system-message" />
  </div>
</template>

<script setup lang="ts">
import { ContractInfoHeader, ContractInfoData } from './ContractInfo'
import { IUseContract, useContract } from '@/composables'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWeb3ProvidersStore } from '@/store'
import { L2TokenReceiverContractInfo } from '@/types'
import { ErrorHandler } from '@/helpers'
import { NETWORK_IDS } from '@config'
import { ETHEREUM_CHAIN_NAMES } from '@/enums'
import { useI18n } from 'vue-i18n'
import { config } from '@config'
import { ErrorMessage, Loader } from '@/common'

const route = useRoute()
const { t } = useI18n()
const web3ProvidersStore = useWeb3ProvidersStore()
const contractInfo = ref<L2TokenReceiverContractInfo | null>(null)
const isLoaded = ref(false)
const isLoadFailed = ref(false)

const network = computed(() =>
  route.query.network === NETWORK_IDS.mainnet
    ? ETHEREUM_CHAIN_NAMES.arbitrum
    : ETHEREUM_CHAIN_NAMES.arbitrumSepolia,
)

const explorerUrl = computed(
  () =>
    `${
      network.value === ETHEREUM_CHAIN_NAMES.arbitrum
        ? config.networksMap.mainnet.l2.explorerUrl
        : config.networksMap.testnet.l2.explorerUrl
    }/address/`,
)

const contract = computed<IUseContract<'L2TokenReceiver__factory'> | null>(
  () => {
    if (!route.query.contractAddress) {
      return null
    }
    return useContract(
      'L2TokenReceiver__factory',
      route.query.contractAddress,
      web3ProvidersStore.l2Provider,
    )
  },
)

const contractData = computed(() => [
  {
    title: t('l2-token-receiver-contract-info.first-swap-params'),
    value: [
      {
        title: t('l2-token-receiver-contract-info.token-in'),
        value: contractInfo.value?.firstSwapParams.tokenIn,
        link: `${explorerUrl.value}${contractInfo.value?.firstSwapParams.tokenIn}`,
      },
      {
        title: t('l2-token-receiver-contract-info.token-out'),
        value: contractInfo.value?.firstSwapParams.tokenOut,
        link: `${explorerUrl.value}${contractInfo.value?.firstSwapParams.tokenOut}`,
      },
      {
        title: t('l2-token-receiver-contract-info.fee'),
        value: contractInfo.value?.firstSwapParams.fee,
      },
    ],
  },
  {
    title: t('l2-token-receiver-contract-info.nonfungible-position-manager'),
    value: contractInfo.value?.nonfungiblePositionManager,
    link: `${explorerUrl.value}${contractInfo.value?.nonfungiblePositionManager}`,
  },
  {
    title: t('l2-token-receiver-contract-info.owner'),
    value: contractInfo.value?.owner,
    link: `${explorerUrl.value}${contractInfo.value?.owner}`,
  },
  {
    title: t('l2-token-receiver-contract-info.router'),
    value: contractInfo.value?.router,
    link: `${explorerUrl.value}${contractInfo.value?.router}`,
  },
  {
    title: t('l2-token-receiver-contract-info.second-swap-params'),
    value: [
      {
        title: t('l2-token-receiver-contract-info.token-in'),
        value: contractInfo.value?.secondSwapParams.tokenIn,
        link: `${explorerUrl.value}${contractInfo.value?.secondSwapParams.tokenIn}`,
      },
      {
        title: t('l2-token-receiver-contract-info.token-out'),
        value: contractInfo.value?.secondSwapParams.tokenOut,
        link: `${explorerUrl.value}${contractInfo.value?.secondSwapParams.tokenOut}`,
      },
      {
        title: t('l2-token-receiver-contract-info.fee'),
        value: contractInfo.value?.secondSwapParams.fee,
      },
    ],
  },
])

const init = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const [
      firstSwapParams,
      nonfungiblePositionManager,
      owner,
      router,
      secondSwapParams,
    ] = await Promise.all([
      contract.value.providerBased.value.firstSwapParams(),
      contract.value.providerBased.value.nonfungiblePositionManager(),
      contract.value.providerBased.value.owner(),
      contract.value.providerBased.value.router(),
      contract.value.providerBased.value.secondSwapParams(),
    ])
    contractInfo.value = {
      firstSwapParams,
      nonfungiblePositionManager,
      owner,
      router,
      secondSwapParams,
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
.l2-token-receiver-contract-info {
  @include contract-info;
}

.l2-token-receiver-contract-info__data {
  margin-top: toRem(10);
}

.l2-token-receiver-contract-info__system-message {
  @include system-message;
}
</style>
