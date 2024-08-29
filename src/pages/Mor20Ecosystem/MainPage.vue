<template>
  <main class="main-page" :class="{ 'main-page--loading': isInitializing }">
    <transition name="fade" mode="out-in">
      <div class="main-page__wrp" :key="($route.query.network as string)">
        <transition name="fade" mode="out-in">
          <div v-if="(protocol && cards.length) || isInitializing">
            <h2 class="main-page__title">
              {{ protocol?.name || $t(`${I18N_KEY_PREFIX}.title`) }}
            </h2>
            <div class="main-page__content-wrp">
              <ul class="main-page__cards">
                <li v-for="(card, idx) in cards" :key="idx">
                  <info-card :card="card" :is-loading="isInitializing" />
                </li>
              </ul>
            </div>
          </div>
          <div v-else>
            <h2 class="main-page__title">
              {{ $t(`${I18N_KEY_PREFIX}.title`) }}
            </h2>
            <div class="main-page__content-wrp">
              <div class="main-page__content">
                <img
                  class="main-page__logo"
                  src="/branding/mor20-ecosystem-logo.png"
                  alt="mor20-ecosystem-logo"
                />
                <p class="main-page__instruction">
                  {{ $t(`${I18N_KEY_PREFIX}.instruction`) }}
                </p>
                <transition name="fade" mode="out-in">
                  <template v-if="web3ProvidersStore.provider.isConnected">
                    <app-button
                      class="main-page__btn"
                      :text="$t(`${I18N_KEY_PREFIX}.create-contract-btn`)"
                      :route="{
                        name: $routes.appMor20EcosystemProtocolCreation,
                      }"
                    />
                  </template>
                  <template v-else>
                    <connect-wallet-button class="main-page__btn" />
                  </template>
                </transition>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </main>
</template>

<script lang="ts" setup>
import { AppButton, ConnectWalletButton, InfoCard } from '@/common'
import { useI18n } from '@/composables'
import { ICON_NAMES, NETWORK_IDS, ROUTE_NAMES } from '@/enums'
import {
  ErrorHandler,
  getEthExplorerAddressUrl,
  getUsersLastFullyDeployedProtocol,
} from '@/helpers'
import { onBeforeRouteUpdate, useRouter } from '@/router'
import { useWeb3ProvidersStore } from '@/store'
import type { InfoCardType, Mor20EcosystemType } from '@/types'
import { config } from '@config'
import { computed, ref, watch } from 'vue'

// TODO: remove the condition when the page will have a mainnet contract
onBeforeRouteUpdate(to => {
  if (to.query.network === NETWORK_IDS.mainnet)
    return { ...to, name: ROUTE_NAMES.app }
})

const I18N_KEY_PREFIX = 'mor20-ecosystem.main-page'

const { t } = useI18n()
const router = useRouter()
const web3ProvidersStore = useWeb3ProvidersStore()

const protocol = ref<Mor20EcosystemType.Protocol | null>(null)
const isInitializing = ref(false)

const cards = computed<InfoCardType.Card[]>(() => [
  {
    title: t('mor20-ecosystem.main-page.info-card.token.title'),
    icon: ICON_NAMES.arbitrumAlt,
    description: t('mor20-ecosystem.main-page.info-card.token.description'),
    address: protocol.value?.tokenAddress || '',
    link: getEthExplorerAddressUrl(
      config.networksMap[web3ProvidersStore.networkId].l2.explorerUrl,
      protocol.value?.tokenAddress || '',
    ),
  },
  {
    title: t('mor20-ecosystem.main-page.info-card.distribution.title'),
    icon: ICON_NAMES.ethereumAlt,
    description: t(
      'mor20-ecosystem.main-page.info-card.distribution.description',
    ),
    address: protocol.value?.distributionAddress || '',
    link: getEthExplorerAddressUrl(
      config.networksMap[web3ProvidersStore.networkId].l1.explorerUrl,
      protocol.value?.distributionAddress || '',
    ),
  },
  {
    title: t('mor20-ecosystem.main-page.info-card.l1-sender.title'),
    icon: ICON_NAMES.ethereumAlt,
    description: t('mor20-ecosystem.main-page.info-card.l1-sender.description'),
    address: protocol.value?.l1SenderAddress || '',
    link: getEthExplorerAddressUrl(
      config.networksMap[web3ProvidersStore.networkId].l1.explorerUrl,
      protocol.value?.l1SenderAddress || '',
    ),
  },
  {
    title: t('mor20-ecosystem.main-page.info-card.l2-msg-receiver.title'),
    icon: ICON_NAMES.arbitrumAlt,
    description: t(
      'mor20-ecosystem.main-page.info-card.l2-msg-receiver.description',
    ),
    address: protocol.value?.l2MessageReceiverAddress || '',
    link: getEthExplorerAddressUrl(
      config.networksMap[web3ProvidersStore.networkId].l2.explorerUrl,
      protocol.value?.l2MessageReceiverAddress || '',
    ),
  },
  {
    title: t('mor20-ecosystem.main-page.info-card.l2-token-receiver.title'),
    icon: ICON_NAMES.arbitrumAlt,
    description: t(
      'mor20-ecosystem.main-page.info-card.l2-token-receiver.description',
    ),
    address: protocol.value?.l2TokenReceiverAddress || '',
    link: getEthExplorerAddressUrl(
      config.networksMap[web3ProvidersStore.networkId].l2.explorerUrl,
      protocol.value?.l2TokenReceiverAddress || '',
    ),
  },
])

const init = async () => {
  if (!web3ProvidersStore.provider.selectedAddress) {
    protocol.value = null
    return
  }

  isInitializing.value = true

  try {
    protocol.value = await getUsersLastFullyDeployedProtocol(
      web3ProvidersStore.provider.selectedAddress,
      web3ProvidersStore.l1FactoryContract,
      web3ProvidersStore.l2FactoryContract,
    )
  } catch (error) {
    protocol.value = null
    ErrorHandler.process(error)
  }

  isInitializing.value = false
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

  .main-page--loading & {
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
  grid-gap: toRem(20);

  @include respond-to(xmedium) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(medium) {
    grid-gap: toRem(12);
  }

  @include respond-to(tablet) {
    grid-template-columns: unset;
  }
}
</style>
