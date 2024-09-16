<template>
  <div class="contract-info-page">
    <div class="contract-info-page__wrp">
      <app-button
        class="contract-info-page__back-btn"
        scheme="link"
        :text="$t('contract-info-page.back-button')"
        :icon-left="$icons.arrowLeft"
        @click="$router.back()"
      />
      <template v-if="isLoaded">
        <transition name="fade">
          <error-message
            v-if="isLoadFailed"
            class="contract-info-page__state-message"
            :message="$t('contract-info-page.error-message')"
          />
          <component
            v-else
            class="contract-info-page__content"
            :is="contractInfoComponent"
            :network="network"
            :explorer-url="explorerUrl"
            :project-name="deployedProtocol?.name"
            :contract-type="contractType"
          />
        </transition>
      </template>
      <loader class="contract-info-page__state-message" v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppButton, ErrorMessage, NoDataMessage } from '@/common'
import { computed, ref, watch } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import type { InfoDashboardType } from '@/types'
import { ErrorHandler, getUsersLastFullyDeployedProtocol } from '@/helpers'
import { useRoute } from 'vue-router'
import {
  DistributionContractInfo,
  EditContract,
  L1SenderContractInfo,
  L2MessageReceiverContractInfo,
  L2TokenReceiverContractInfo,
  TokenContractInfo,
} from '@/pages/ContractInfoPage/components'
import Loader from '@/common/Loader.vue'
import {
  CONTRACT_INFO_ACTIONS,
  CONTRACT_TYPE,
  ETHEREUM_CHAIN_NAMES,
  NETWORK_IDS,
} from '@/enums'
import { config } from '@config'

const route = useRoute()
const web3ProvidersStore = useWeb3ProvidersStore()
const deployedProtocol = ref<InfoDashboardType.DashboardInfo | null>(null)
const isLoaded = ref(false)
const isLoadFailed = ref(false)

const contractInfoComponent = computed(() =>
  route.query.type === CONTRACT_INFO_ACTIONS.read
    ? contractReadComponent.value
    : contractWriteComponent.value,
)

const contractType = computed(() => {
  switch (String(route.query.contractAddress)) {
    case deployedProtocol.value?.distributionAddress:
      return CONTRACT_TYPE.distribution
    case deployedProtocol.value?.tokenAddress:
      return CONTRACT_TYPE.token
    case deployedProtocol.value?.l1SenderAddress:
      return CONTRACT_TYPE.l1Sender
    case deployedProtocol.value?.l2MessageReceiverAddress:
      return CONTRACT_TYPE.l2MessageReceiver
    case deployedProtocol.value?.l2TokenReceiverAddress:
      return CONTRACT_TYPE.l2TokenReceiver
    default:
      return ''
  }
})

const network = computed(() => {
  if (
    contractType.value === CONTRACT_TYPE.token ||
    contractType.value === CONTRACT_TYPE.l2MessageReceiver ||
    contractType.value === CONTRACT_TYPE.l2TokenReceiver
  ) {
    return route.query.network === NETWORK_IDS.testnet
      ? ETHEREUM_CHAIN_NAMES.arbitrumSepolia
      : ETHEREUM_CHAIN_NAMES.arbitrum
  }
  return route.query.network === NETWORK_IDS.testnet
    ? ETHEREUM_CHAIN_NAMES.sepolia
    : ETHEREUM_CHAIN_NAMES.ethereum
})

const explorerUrl = computed(() => {
  let url = ''
  switch (network.value) {
    case ETHEREUM_CHAIN_NAMES.arbitrum:
      url = config.networksMap.mainnet.l2.explorerUrl
      break
    case ETHEREUM_CHAIN_NAMES.sepolia:
      url = config.networksMap.testnet.l1.explorerUrl
      break
    case ETHEREUM_CHAIN_NAMES.ethereum:
      url = config.networksMap.mainnet.l1.explorerUrl
      break
    default:
      url = config.networksMap.testnet.l2.explorerUrl
      break
  }
  return `${url}/address/`
})

const contractReadComponent = computed(() => {
  switch (contractType.value) {
    case CONTRACT_TYPE.distribution:
      return DistributionContractInfo
    case CONTRACT_TYPE.token:
      return TokenContractInfo
    case CONTRACT_TYPE.l1Sender:
      return L1SenderContractInfo
    case CONTRACT_TYPE.l2MessageReceiver:
      return L2MessageReceiverContractInfo
    case CONTRACT_TYPE.l2TokenReceiver:
      return L2TokenReceiverContractInfo
    default:
      return NoDataMessage
  }
})

const contractWriteComponent = computed(() =>
  route.query.contractAddress ? EditContract : NoDataMessage,
)

watch(
  () => route.query,
  async () => {
    isLoaded.value = false
    isLoadFailed.value = false
    try {
      const protocol = await getUsersLastFullyDeployedProtocol(
        web3ProvidersStore.provider.selectedAddress,
        web3ProvidersStore.l1FactoryContract,
        web3ProvidersStore.l2FactoryContract,
      )
      if (protocol) {
        deployedProtocol.value = protocol
      }
    } catch (e) {
      ErrorHandler.process(e)
      isLoadFailed.value = true
    }
    isLoaded.value = true
  },

  { immediate: true },
)
</script>

<style scoped lang="scss">
.contract-info-page {
  $z-index: 1;

  position: relative;
  z-index: $z-index;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  &:before {
    $z-index: -1;

    position: absolute;
    z-index: $z-index;
    bottom: toRem(-700);
    left: toRem(-700);
    content: '';
    display: block;
    height: toRem(1400);
    width: toRem(1400);
    background: radial-gradient(#215244, transparent 60%);

    @include respond-to(medium) {
      margin: 0 auto;
      bottom: toRem(-1700);
      left: unset;
      height: toRem(2600);
      width: toRem(2600);
    }
  }

  &:after {
    $z-index: -1;

    position: absolute;
    top: toRem(-440);
    right: toRem(-1030);
    z-index: $z-index;
    content: '';
    display: block;
    height: toRem(1400);
    width: toRem(1400);
    background: radial-gradient(#215244, transparent 60%);

    @include respond-to(medium) {
      display: none;
    }
  }
}

.contract-info-page__wrp {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: toRem(20);

  @include page-wrp;
}

.contract-info-page__state-message {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translateX(50%) translateY(-50%);
}

.contract-info-page__back-btn {
  margin-top: toRem(20);
}

.contract-info-page__content {
  flex: 1;
  margin-top: toRem(20);
}
</style>
