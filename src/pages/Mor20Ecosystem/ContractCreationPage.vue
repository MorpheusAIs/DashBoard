<template>
  <main class="contract-creation-page">
    <div class="contract-creation-page__wrp">
      <app-button
        scheme="link"
        :route="{ name: $routes.appMor20EcosystemMain }"
        :text="$t(`${I18N_KEY_PREFIX}.back-link`)"
        :icon-left="$icons.arrowLeft"
      />
      <transition name="fade" mode="out-in">
        <contract-creation-form
          class="contract-creation-page__form"
          :key="`${$route.query.network}.${web3ProvidersStore.address}`"
          @success="onFormSuccess"
        />
      </transition>
    </div>
    <basic-modal :is-shown="formSuccessData" @update:is-shown="handler">
      <div class="contract-creation-page__modal-content-wrp">
        <svg class="contract-creation-page__modal-success-mark">
          <use href="/static/branding/success-mark.svg#id" />
        </svg>
        <p class="contract-creation-page__modal-success-msg">
          {{ $t(`${I18N_KEY_PREFIX}.success-msg`) }}
        </p>
        <div class="contract-creation-page__fields-wrp">
          <input-field
            :model-value="formSuccessData?.distributionAddress"
            :label="$t(`${I18N_KEY_PREFIX}.distribution-address-label`)"
            disabled
          />
          <input-field
            :model-value="formSuccessData?.l1SenderAddress"
            :label="$t(`${I18N_KEY_PREFIX}.l1-sender-address-label`)"
            disabled
          />
          <input-field
            :model-value="formSuccessData?.l2MessageReceiverAddress"
            :label="$t(`${I18N_KEY_PREFIX}.l2-message-receiver-address-label`)"
            disabled
          />
          <input-field
            :model-value="formSuccessData?.l2TokenReceiverAddress"
            :label="$t(`${I18N_KEY_PREFIX}.l2-token-receiver-address-label`)"
            disabled
          />
          <input-field
            :model-value="formSuccessData?.tokenAddress"
            :label="$t(`${I18N_KEY_PREFIX}.token-address-label`)"
            disabled
          />
        </div>
      </div>
    </basic-modal>
  </main>
</template>

<script lang="ts" setup>
import { AppButton, BasicModal } from '@/common'
import { ROUTE_NAMES } from '@/enums'
import { InputField } from '@/fields'
import { ContractCreationForm } from '@/forms'
import { type FormSuccessData } from '@/forms/ContractCreationForm/types'
import { ErrorHandler } from '@/helpers'
import { router } from '@/router'
import { useWeb3ProvidersStore } from '@/store'
import { ref } from 'vue'

const I18N_KEY_PREFIX = 'mor20-ecosystem.contract-creation-page'

const web3ProvidersStore = useWeb3ProvidersStore()

const formSuccessData = ref<FormSuccessData | null>(null)

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

    formSuccessData.value = {
      protocolName: l1DeployedPools[0].protocol,
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
</script>

<style lang="scss" scoped>
.contract-creation-page {
  $z-index: 1;

  position: relative;
  z-index: $z-index;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

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

.contract-creation-page__wrp {
  @include page-wrp;
}

.contract-creation-page__form {
  margin-top: toRem(20);
}

.contract-creation-page__modal-content-wrp {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contract-creation-page__modal-success-mark {
  height: toRem(86);
  width: toRem(84);
}

.contract-creation-page__modal-success-msg {
  margin-top: toRem(24);

  @include body-1-regular;
}

.contract-creation-page__fields-wrp {
  margin-top: toRem(40);
  display: grid;
  gap: toRem(24);
  width: 100%;
}
</style>
