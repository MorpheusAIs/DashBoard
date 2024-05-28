<template>
  <main class="main-page">
    <div class="main-page__wrp">
      <h2>{{ $t('mor20-ecosystem.main-page.title') }}</h2>
      <div class="main-page__content-wrp">
        <template v-if="hasContractsMocked && cards.length">
          <ul class="main-page__cards">
            <li v-for="(card, idx) in cards" :key="idx">
              <info-card :card="card" />
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
import { ICON_NAMES } from '@/enums'
import { type InfoCardType } from '@/types'
import { computed, ref } from 'vue'

const { t } = useI18n()

const cards = computed<InfoCardType.Card[]>(() => [
  {
    title: t('mor20-ecosystem.main-page.info-card.token.title'),
    icon: ICON_NAMES.arbitrumAlt,
    description: t('mor20-ecosystem.main-page.info-card.token.description'),
    address: '0xaFDE42318...363385bb23671aA8',
    link: '#',
  },
  {
    title: t('mor20-ecosystem.main-page.info-card.distribution.title'),
    icon: ICON_NAMES.ethereumAlt,
    description: t(
      'mor20-ecosystem.main-page.info-card.distribution.description',
    ),
    address: '0xaFDE42318...363385bb23671aA8',
    link: '#',
  },
  {
    title: t('mor20-ecosystem.main-page.info-card.l1-sender.title'),
    icon: ICON_NAMES.ethereumAlt,
    description: t('mor20-ecosystem.main-page.info-card.l1-sender.description'),
    address: '0xaFDE42318...363385bb23671aA8',
    link: '#',
  },
  {
    title: t('mor20-ecosystem.main-page.info-card.l2-msg-receiver.title'),
    icon: ICON_NAMES.arbitrumAlt,
    description: t(
      'mor20-ecosystem.main-page.info-card.l2-msg-receiver.description',
    ),
    address: '0xaFDE42318...363385bb23671aA8',
    link: '#',
  },
  {
    title: t('mor20-ecosystem.main-page.info-card.l2-token-receiver.title'),
    icon: ICON_NAMES.arbitrumAlt,
    description: t(
      'mor20-ecosystem.main-page.info-card.l2-token-receiver.description',
    ),
    address: '0xaFDE42318...363385bb23671aA8',
    link: '#',
  },
])

const hasContractsMocked = ref(false)
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
