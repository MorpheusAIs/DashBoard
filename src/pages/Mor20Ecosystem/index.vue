<template>
  <main class="mor20-ecosystem-page">
    <h2>{{ $t('mor20-ecosystem-page.title') }}</h2>
    <div class="mor20-ecosystem-page__content-wrp">
      <template v-if="hasContracts && cards.length">
        <ul class="mor20-ecosystem-page__cards">
          <li v-for="(card, idx) in cards" :key="idx">
            <info-card :card="card" />
          </li>
        </ul>
      </template>
      <template v-else>
        <div class="mor20-ecosystem-page__content">
          <img
            class="mor20-ecosystem-page__logo"
            src="/branding/mor20-ecosystem-logo.png"
            alt="mor20-ecosystem-logo"
          />
          <p class="mor20-ecosystem-page__instruction">
            {{ $t('mor20-ecosystem-page.instruction') }}
          </p>
          <app-button
            class="mor20-ecosystem-page__btn"
            :text="$t('mor20-ecosystem-page.create-contract-btn')"
            @click="hasContracts = true"
          />
        </div>
      </template>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { AppButton, InfoCard } from '@/common'
import { useI18n } from '@/composables'
import { ICON_NAMES } from '@/enums'
import { type InfoCardType } from '@/types'
import { ref } from 'vue'

const { t } = useI18n()

const cards: InfoCardType.Card[] = [
  {
    title: t('mor20-ecosystem-page.info-card.token.title'),
    icon: ICON_NAMES.arbitrumAlt,
    description: t('mor20-ecosystem-page.info-card.token.description'),
    address: '0xaFDE42318...363385bb23671aA8',
    link: '#',
  },
  {
    title: t('mor20-ecosystem-page.info-card.distribution.title'),
    icon: ICON_NAMES.ethereumAlt,
    description: t('mor20-ecosystem-page.info-card.distribution.description'),
    address: '0xaFDE42318...363385bb23671aA8',
    link: '#',
  },
  {
    title: t('mor20-ecosystem-page.info-card.l1-sender.title'),
    icon: ICON_NAMES.ethereumAlt,
    description: t('mor20-ecosystem-page.info-card.l1-sender.description'),
    address: '0xaFDE42318...363385bb23671aA8',
    link: '#',
  },
  {
    title: t('mor20-ecosystem-page.info-card.l2-msg-receiver.title'),
    icon: ICON_NAMES.arbitrumAlt,
    description: t(
      'mor20-ecosystem-page.info-card.l2-msg-receiver.description',
    ),
    address: '0xaFDE42318...363385bb23671aA8',
    link: '#',
  },
  {
    title: t('mor20-ecosystem-page.info-card.l2-token-receiver.title'),
    icon: ICON_NAMES.arbitrumAlt,
    description: t(
      'mor20-ecosystem-page.info-card.l2-token-receiver.description',
    ),
    address: '0xaFDE42318...363385bb23671aA8',
    link: '#',
  },
]

const hasContracts = ref(false)
</script>

<style lang="scss" scoped>
.mor20-ecosystem-page {
  margin: 0 auto;
  width: 100%;
  max-width: toRem(1240);
}

.mor20-ecosystem-page__content-wrp {
  margin-top: toRem(30);
}

.mor20-ecosystem-page__content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mor20-ecosystem-page__logo {
  height: toRem(405);
  width: toRem(360);
}

.mor20-ecosystem-page__instruction {
  margin-top: toRem(30);
  max-width: toRem(550);
  text-align: center;

  @include body-1-regular;
}

.mor20-ecosystem-page__btn {
  margin-top: toRem(36);
}

.mor20-ecosystem-page__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: toRem(314);
  grid-gap: toRem(20);
}
</style>
