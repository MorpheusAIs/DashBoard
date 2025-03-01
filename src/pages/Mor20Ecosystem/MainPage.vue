<template>
  <main class="main-page" :class="{ 'main-page--loading': isInitializing }">
    <transition name="fade" mode="out-in">
      <div class="main-page__wrp" :key="key">
        <transition name="fade" mode="out-in">
          <div v-if="(protocol && cards.length) || isInitializing">
            <h2 class="main-page__title">
              {{ protocol?.name || $t(`${I18N_KEY_PREFIX}.title`) }}
            </h2>
            <div class="main-page__dashboard-links">
              <app-button
                scheme="link"
                :icon-right="$icons.externalLink"
                :text="$t(`${I18N_KEY_PREFIX}.dashboard-button`)"
                :route="{
                  name: $routes.appDashboardCapital,
                  query: { address: web3ProvidersStore.address },
                }"
              />
              <app-button
                :text="copyButtonText"
                :icon-right="$icons.copy"
                @click="copyDashboardLink"
              />
            </div>
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
import { useI18n, useLimitedProvider } from '@/composables'
import { ICON_NAMES, ROUTE_NAMES } from '@/enums'
import {
  ErrorHandler,
  getEthExplorerAddressUrl,
  getUsersLastFullyDeployedProtocol,
} from '@/helpers'
import { onBeforeRouteUpdate, useRouter } from '@/router'
import { useWeb3ProvidersStore } from '@/store'
import type { InfoCardType, Mor20EcosystemType } from '@/types'
import {
  config,
  EthereumChains,
  getEthereumChainsName,
  NetworkTypes,
} from '@config'
import { computed, ref, watch } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useRoute } from 'vue-router'

// TODO: remove the condition when the page will have a mainnet contract
onBeforeRouteUpdate(to => {
  if (to.query.network === NetworkTypes.Mainnet)
    return { ...to, name: ROUTE_NAMES.app }
})

const I18N_KEY_PREFIX = 'mor20-ecosystem.main-page'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const web3ProvidersStore = useWeb3ProvidersStore()

const l1Provider = useLimitedProvider([
  EthereumChains.Ethereum,
  EthereumChains.Sepolia,
])

const l1ProviderDetails = computed(() => {
  return config.chainsMap[
    getEthereumChainsName(String(l1Provider.value.network.chainId))
  ]
})

const l2Provider = useLimitedProvider([
  EthereumChains.Arbitrum,
  EthereumChains.ArbitrumSepolia,
])

const l2ProviderDetails = computed(() => {
  if (l2Provider.value.network) {
    return config.chainsMap[
      getEthereumChainsName(String(l2Provider.value.network.chainId))
    ]
  }

  const network =
    route.query.network === NetworkTypes.Testnet
      ? EthereumChains.ArbitrumSepolia
      : EthereumChains.Arbitrum

  return getEthereumChainsName(network)
})

const protocol = ref<Mor20EcosystemType.Protocol | null>(null)
const isInitializing = ref(false)

const { copy: _copy, copied: isCopied } = useClipboard()

const copyButtonText = computed(() =>
  isCopied.value
    ? t(`${I18N_KEY_PREFIX}.copied-text`)
    : t(`${I18N_KEY_PREFIX}.copy-button`),
)

const dashboardLink = computed(() => {
  const link = router.resolve({
    name: ROUTE_NAMES.appDashboardCapital,
    query: {
      address: web3ProvidersStore.address,
      network: route.query.network,
    },
  }).href
  return `${window.location.origin}${link}`
})

const key = computed(() => {
  return route.query.network as string
})

const l2ProviderUrls = computed(() => {
  if (typeof l2ProviderDetails.value === 'string') {
    return []
  }

  return l2ProviderDetails.value.blockExplorerUrls
})

const cards = computed<InfoCardType.Card[]>(() => [
  {
    title: t('mor20-ecosystem.main-page.info-card.token.title'),
    icon: ICON_NAMES.arbitrumAlt,
    description: t('mor20-ecosystem.main-page.info-card.token.description'),
    address: protocol.value?.tokenAddress || '',
    link: getEthExplorerAddressUrl(
      l2ProviderUrls.value?.[0] ?? '',
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
      l1ProviderDetails.value.blockExplorerUrls?.[0] ?? '',
      protocol.value?.distributionAddress || '',
    ),
  },
  {
    title: t('mor20-ecosystem.main-page.info-card.l1-sender.title'),
    icon: ICON_NAMES.ethereumAlt,
    description: t('mor20-ecosystem.main-page.info-card.l1-sender.description'),
    address: protocol.value?.l1SenderAddress || '',
    link: getEthExplorerAddressUrl(
      l1ProviderDetails.value.blockExplorerUrls?.[0] ?? '',
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
      l2ProviderUrls.value?.[0] ?? '',
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
      l2ProviderUrls.value?.[0] ?? '',
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
    const deployedProtocol = await getUsersLastFullyDeployedProtocol(
      web3ProvidersStore.provider.selectedAddress,
      web3ProvidersStore.l1FactoryContract,
      web3ProvidersStore.l2FactoryContract,
    )

    if (deployedProtocol) {
      protocol.value = deployedProtocol
    }
  } catch (error) {
    protocol.value = null
    ErrorHandler.process(error)
  }

  isInitializing.value = false
}

const copyDashboardLink = async () => {
  try {
    await _copy(dashboardLink.value)
  } catch (error) {
    ErrorHandler.process(error)
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

.main-page__dashboard-links {
  display: flex;
  gap: toRem(12);
  margin-top: toRem(20);
}
</style>
