<template>
  <main
    class="main-page"
    :key="`${$route.query.network}.${web3ProvidersStore.address}`"
  >
    <div class="main-page__wrp">
      <h2
        class="main-page__title"
        :class="{ 'main-page__title--loading': isInitializing }"
      >
        {{ data?.protocolName || $t('mor20-ecosystem.main-page.title') }}
      </h2>
      <div class="main-page__content-wrp">
        <template v-if="(data && cards.length) || isInitializing">
          <ul class="main-page__cards">
            <li v-for="(card, idx) in cards" :key="idx">
              <info-card :card="card" :is-loading="isInitializing" />
            </li>
          </ul>
        </template>
        <template v-else>
          <div class="main-page__content">
            <img
              class="main-page__logo"
              src="/branding/mor20-ecosystem-logo.png"
              alt="mor20-ecosystem-logo"
            />
            <p class="main-page__instruction">
              {{ $t('mor20-ecosystem.main-page.instruction') }}
            </p>
            <app-button
              class="main-page__btn"
              :text="$t('mor20-ecosystem.main-page.create-contract-btn')"
              :route="{ name: $routes.appMor20EcosystemProtocolCreation }"
            />
          </div>
        </template>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { AppButton, InfoCard } from '@/common'
import { useI18n } from '@/composables'
import { MAX_UINT_256 } from '@/const'
import { ICON_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { router } from '@/router'
import { useWeb3ProvidersStore } from '@/store'
import { type InfoCardType } from '@/types'
import { computed, ref, watch } from 'vue'

import { FormSuccessData } from '@/forms/ContractCreationForm/types'

const { t } = useI18n()
const web3ProvidersStore = useWeb3ProvidersStore()

const data = ref<FormSuccessData | null>(null)
const isInitializing = ref(false)

const cards = computed<InfoCardType.Card[]>(() => [
  {
    title: t('mor20-ecosystem.main-page.info-card.token.title'),
    icon: ICON_NAMES.arbitrumAlt,
    description: t('mor20-ecosystem.main-page.info-card.token.description'),
    address: data.value?.tokenAddress || '',
    link: '#',
  },
  {
    title: t('mor20-ecosystem.main-page.info-card.distribution.title'),
    icon: ICON_NAMES.ethereumAlt,
    description: t(
      'mor20-ecosystem.main-page.info-card.distribution.description',
    ),
    address: data.value?.distributionAddress || '',
    link: '#',
  },
  {
    title: t('mor20-ecosystem.main-page.info-card.l1-sender.title'),
    icon: ICON_NAMES.ethereumAlt,
    description: t('mor20-ecosystem.main-page.info-card.l1-sender.description'),
    address: data.value?.l1SenderAddress || '',
    link: '#',
  },
  {
    title: t('mor20-ecosystem.main-page.info-card.l2-msg-receiver.title'),
    icon: ICON_NAMES.arbitrumAlt,
    description: t(
      'mor20-ecosystem.main-page.info-card.l2-msg-receiver.description',
    ),
    address: data.value?.l2MessageReceiverAddress || '',
    link: '#',
  },
  {
    title: t('mor20-ecosystem.main-page.info-card.l2-token-receiver.title'),
    icon: ICON_NAMES.arbitrumAlt,
    description: t(
      'mor20-ecosystem.main-page.info-card.l2-token-receiver.description',
    ),
    address: data.value?.l2TokenReceiverAddress || '',
    link: '#',
  },
])

const init = async () => {
  isInitializing.value = true

  try {
    const { address, l1FactoryContract, l2FactoryContract } = web3ProvidersStore

    const [l1DeployedPools, l2DeployedPools] = await Promise.all([
      l1FactoryContract.providerBased.value.getDeployedPools(
        address,
        0,
        MAX_UINT_256,
      ),
      l2FactoryContract.providerBased.value.getDeployedPools(
        address,
        0,
        MAX_UINT_256,
      ),
    ])

    let lastFullyL1DeployedPoolIdx = -1
    let lastFullyL2DeployedPoolIdx = -1
    for (let i = l1DeployedPools.length - 1; i >= 0; i--) {
      if (
        lastFullyL1DeployedPoolIdx !== -1 &&
        lastFullyL2DeployedPoolIdx !== -1
      )
        break

      for (let j = l2DeployedPools.length - 1; j >= 0; j--) {
        if (l1DeployedPools[i].protocol === l2DeployedPools[j].protocol) {
          lastFullyL1DeployedPoolIdx = i
          lastFullyL2DeployedPoolIdx = j
          break
        }
      }
    }

    if (
      lastFullyL1DeployedPoolIdx === -1 ||
      lastFullyL2DeployedPoolIdx === -1
    ) {
      data.value = null
      return
    }

    data.value = {
      protocolName: l1DeployedPools[lastFullyL1DeployedPoolIdx].protocol,
      distributionAddress:
        l1DeployedPools[lastFullyL1DeployedPoolIdx].distribution,
      l1SenderAddress: l1DeployedPools[lastFullyL1DeployedPoolIdx].l1Sender,
      l2MessageReceiverAddress:
        l2DeployedPools[lastFullyL2DeployedPoolIdx].l2MessageReceiver,
      l2TokenReceiverAddress:
        l2DeployedPools[lastFullyL2DeployedPoolIdx].l2TokenReceiver,
      tokenAddress: l2DeployedPools[lastFullyL2DeployedPoolIdx].mor20,
    }
  } catch (error) {
    data.value = null
    ErrorHandler.process(error)
  } finally {
    isInitializing.value = false
  }
}

watch(
  [
    () => web3ProvidersStore.address,
    () => router.currentRoute.value.query.network,
  ],
  init,
)

init()
</script>

<style lang="scss" scoped>
.main-page {
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

.main-page__wrp {
  @include page-wrp;
}

.main-page__title {
  max-width: max-content;

  &--loading {
    @include skeleton;

    border-radius: 0;
  }
}

.main-page__content-wrp {
  margin-top: toRem(30);
}

.main-page__content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-page__logo {
  height: toRem(405);
  width: toRem(360);
}

.main-page__instruction {
  margin-top: toRem(30);
  max-width: toRem(550);
  text-align: center;

  @include body-1-regular;
}

.main-page__btn {
  margin-top: toRem(36);
}

.main-page__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: toRem(314);
  grid-gap: toRem(20);
}
</style>
