<template>
  <main class="protocol-creation-page">
    <div class="protocol-creation-page__wrp">
      <transition name="fade" mode="out-in">
        <mor20-creation-form
          :key="`${$route.query.network}.${web3ProvidersStore.address}`"
          @success="onFormSuccess"
        />
      </transition>
    </div>
    <basic-modal :is-shown="!!inputFieldsData" @update:is-shown="handler">
      <div class="protocol-creation-page__modal-content-wrp">
        <svg class="protocol-creation-page__modal-success-mark">
          <use href="/static/branding/success-mark.svg#id" />
        </svg>
        <p class="protocol-creation-page__modal-success-msg">
          {{ $t(`${I18N_KEY_PREFIX}.success-msg`) }}
        </p>
        <ul v-if="inputFieldsData" class="protocol-creation-page__fields-wrp">
          <li v-for="data in inputFieldsData" :key="data.address">
            <input-field
              :model-value="data.address"
              :label="data.label"
              readonly
            >
              <template #nodeRight>
                <a
                  class="protocol-creation-page__field-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  tabindex="-1"
                  :href="data.explorerUrl"
                >
                  <app-icon
                    class="protocol-creation-page__field-icon"
                    :name="$icons.externalLink"
                  />
                </a>
              </template>
            </input-field>
          </li>
        </ul>
      </div>
    </basic-modal>
  </main>
</template>

<script lang="ts" setup>
import { AppIcon, BasicModal } from '@/common'
import { useI18n } from '@/composables'
import { NETWORK_IDS, ROUTE_NAMES } from '@/enums'
import { InputField } from '@/fields'
import { Mor20CreationForm } from '@/forms'
import { ErrorHandler, getEthExplorerAddressUrl } from '@/helpers'
import { onBeforeRouteUpdate, useRouter } from '@/router'
import { useWeb3ProvidersStore } from '@/store'
import type { Mor20EcosystemType } from '@/types'
import { config } from '@config'
import { computed, ref, watch } from 'vue'

// TODO: remove the condition when the page will have a mainnet contract
onBeforeRouteUpdate(to => {
  if (to.query.network === NETWORK_IDS.mainnet)
    return { ...to, name: ROUTE_NAMES.app }
})

const I18N_KEY_PREFIX = 'mor20-ecosystem.protocol-creation-page'

const { t } = useI18n()
const router = useRouter()
const web3ProvidersStore = useWeb3ProvidersStore()

const createdProtocol = ref<Mor20EcosystemType.Protocol | null>(null)

const inputFieldsData = computed(() => {
  if (!createdProtocol.value) return null

  return {
    distributionData: {
      label: t(`${I18N_KEY_PREFIX}.distribution-address-label`),
      address: createdProtocol.value.distributionAddress,
      explorerUrl: getEthExplorerAddressUrl(
        config.networksMap[web3ProvidersStore.networkId].l1.explorerUrl,
        createdProtocol.value.distributionAddress,
      ),
    },
    l1SenderData: {
      label: t(`${I18N_KEY_PREFIX}.l1-sender-address-label`),
      address: createdProtocol.value.l1SenderAddress,
      explorerUrl: getEthExplorerAddressUrl(
        config.networksMap[web3ProvidersStore.networkId].l1.explorerUrl,
        createdProtocol.value.l1SenderAddress,
      ),
    },
    l2MessageReceiverData: {
      label: t(`${I18N_KEY_PREFIX}.l2-message-receiver-address-label`),
      address: createdProtocol.value.l2MessageReceiverAddress,
      explorerUrl: getEthExplorerAddressUrl(
        config.networksMap[web3ProvidersStore.networkId].l2.explorerUrl,
        createdProtocol.value.l2MessageReceiverAddress,
      ),
    },
    l2TokenReceiverData: {
      label: t(`${I18N_KEY_PREFIX}.l2-token-receiver-address-label`),
      address: createdProtocol.value.l2TokenReceiverAddress,
      explorerUrl: getEthExplorerAddressUrl(
        config.networksMap[web3ProvidersStore.networkId].l2.explorerUrl,
        createdProtocol.value.l2TokenReceiverAddress,
      ),
    },
    tokenData: {
      label: t(`${I18N_KEY_PREFIX}.token-address-label`),
      address: createdProtocol.value.tokenAddress,
      explorerUrl: getEthExplorerAddressUrl(
        config.networksMap[web3ProvidersStore.networkId].l2.explorerUrl,
        createdProtocol.value.tokenAddress,
      ),
    },
  }
})

const onFormSuccess = async () => {
  try {
    const { address, l1FactoryContract, l2FactoryContract } = web3ProvidersStore

    const [l1ProtocolsCount, l2ProtocolsCount] = await Promise.all([
      l1FactoryContract.providerBased.value.countProtocols(address),
      l2FactoryContract.providerBased.value.countProtocols(address),
    ])

    const [l1DeployedPools, l2DeployedPools] = await Promise.all([
      l1FactoryContract.providerBased.value.getDeployedPools(
        address,
        l1ProtocolsCount.sub(1),
        1,
      ),
      l2FactoryContract.providerBased.value.getDeployedPools(
        address,
        l2ProtocolsCount.sub(1),
        1,
      ),
    ])

    createdProtocol.value = {
      name: l1DeployedPools[0].protocol,
      distributionAddress: l1DeployedPools[0].distribution,
      l1SenderAddress: l1DeployedPools[0].l1Sender,
      l2MessageReceiverAddress: l2DeployedPools[0].l2MessageReceiver,
      l2TokenReceiverAddress: l2DeployedPools[0].l2TokenReceiver,
      tokenAddress: l2DeployedPools[0].mor20,
    }
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const handler = () => {
  router.push({ name: ROUTE_NAMES.appMor20EcosystemMain })
}

watch(
  () => web3ProvidersStore.provider.isConnected,
  newIsConnected => {
    if (!newIsConnected)
      router.push({ name: ROUTE_NAMES.appMor20EcosystemMain })
  },
)
</script>

<style lang="scss" scoped>
.protocol-creation-page {
  $z-index: 1;

  position: relative;
  z-index: $z-index;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: toRem(100);

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

.protocol-creation-page__wrp {
  @include page-wrp;
}

.protocol-creation-page__modal-content-wrp {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.protocol-creation-page__modal-success-mark {
  height: toRem(86);
  width: toRem(84);
}

.protocol-creation-page__modal-success-msg {
  margin-top: toRem(24);

  @include body-1-regular;
}

.protocol-creation-page__fields-wrp {
  margin-top: toRem(20);
  display: grid;
  gap: toRem(16);
  width: 100%;
}

.protocol-creation-page__field-link {
  color: var(--primary-main);
  transition: color var(--transition-duration-fast)
    var(--transition-timing-default);

  &:hover,
  &:focus {
    color: var(--text-secondary-main);
  }
}

.protocol-creation-page__field-icon {
  height: toRem(24);
  width: toRem(24);
}
</style>
