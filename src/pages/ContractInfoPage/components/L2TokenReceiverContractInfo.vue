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
import {
  IUseContract,
  useContract,
  useExceptionContractsProvider,
} from '@/composables'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { L2TokenReceiverContractInfo } from '@/types'
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
const contractInfo = ref<L2TokenReceiverContractInfo | null>(null)
const isLoaded = ref(false)
const isLoadFailed = ref(false)

const L2TokenReceiver__factoryProvider = useExceptionContractsProvider(
  'L2TokenReceiver__factory',
)

const contract = computed<IUseContract<'L2TokenReceiver__factory'> | null>(
  () => {
    if (!route.query.contractAddress) {
      return null
    }
    return useContract(
      'L2TokenReceiver__factory',
      String(route.query.contractAddress),
      L2TokenReceiver__factoryProvider.value,
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
        link: `${props.explorerUrl}${contractInfo.value?.firstSwapParams.tokenIn}`,
      },
      {
        title: t('l2-token-receiver-contract-info.token-out'),
        value: contractInfo.value?.firstSwapParams.tokenOut,
        link: `${props.explorerUrl}${contractInfo.value?.firstSwapParams.tokenOut}`,
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
    link: `${props.explorerUrl}${contractInfo.value?.nonfungiblePositionManager}`,
  },
  {
    title: t('l2-token-receiver-contract-info.owner'),
    value: contractInfo.value?.owner,
    link: `${props.explorerUrl}${contractInfo.value?.owner}`,
  },
  {
    title: t('l2-token-receiver-contract-info.router'),
    value: contractInfo.value?.router,
    link: `${props.explorerUrl}${contractInfo.value?.router}`,
  },
  {
    title: t('l2-token-receiver-contract-info.second-swap-params'),
    value: [
      {
        title: t('l2-token-receiver-contract-info.token-in'),
        value: contractInfo.value?.secondSwapParams.tokenIn,
        link: `${props.explorerUrl}${contractInfo.value?.secondSwapParams.tokenIn}`,
      },
      {
        title: t('l2-token-receiver-contract-info.token-out'),
        value: contractInfo.value?.secondSwapParams.tokenOut,
        link: `${props.explorerUrl}${contractInfo.value?.secondSwapParams.tokenOut}`,
      },
      {
        title: t('l2-token-receiver-contract-info.fee'),
        value: contractInfo.value?.secondSwapParams.fee,
      },
    ],
  },
])

const init = async () => {
  if (!contract.value) return

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
