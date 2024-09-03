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
            :project-name="deployedProtocol.name"
          />
        </transition>
      </template>
      <loader class="contract-info-page__state-message" v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppButton, NoDataMessage, ErrorMessage } from '@/common'
import { watch, ref, computed } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import type { InfoDashboardType } from '@/types'
import { getUsersLastFullyDeployedProtocol, ErrorHandler } from '@/helpers'
import { useRoute } from 'vue-router'
import {
  L2MessageReceiverContractInfo,
  L1SenderContractInfo,
  L2TokenReceiverContractInfo,
  DistributionContractInfo,
  TokenContractInfo,
} from '@/pages/ContractInfoPage/components'
import Loader from '@/common/Loader.vue'

const route = useRoute()
const web3ProvidersStore = useWeb3ProvidersStore()
const deployedProtocol = ref<InfoDashboardType.DashboardInfo | null>(null)
const isLoaded = ref(false)
const isLoadFailed = ref(false)

const contractInfoComponent = computed(() => {
  switch (String(route.query.contractAddress)) {
    case deployedProtocol.value?.distributionAddress:
      return DistributionContractInfo
    case deployedProtocol.value?.tokenAddress:
      return TokenContractInfo
    case deployedProtocol.value?.l1SenderAddress:
      return L1SenderContractInfo
    case deployedProtocol.value?.l2MessageReceiverAddress:
      return L2MessageReceiverContractInfo
    case deployedProtocol.value?.l2TokenReceiverAddress:
      return L2TokenReceiverContractInfo
    default:
      return NoDataMessage
  }
})

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
