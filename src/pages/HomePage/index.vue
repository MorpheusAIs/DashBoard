<template>
  <main class="home-page">
    <div class="home-page__content-wrp">
      <app-tabs v-if="isTabsShown" :tabs="tabs" class="home-page__tabs" />
      <router-view v-slot="{ Component }" class="home-page__view">
        <keep-alive>
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
      </router-view>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { AppTabs } from '@/common'
import { useI18n } from '@/composables'
import { NETWORK_IDS, ROUTE_NAMES } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import { type Tab } from '@/types'
import { config } from '@config'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useI18n()
const web3ProvidersStore = useWeb3ProvidersStore()

const tabs = computed<Tab[]>(() => [
  {
    title: t('home-page.capital-tab'),
    id: 'capital',
    route: { name: ROUTE_NAMES.appCapital },
  },
  {
    title: t('home-page.coders-tab'),
    id: 'coders',
    href: config.CODE_CONTRIBUTION_URL,
  },
  {
    title: t('home-page.compute-tab'),
    id: 'compute',
    href: config.COMPUTE_CONTRIBUTION_URL,
  },
  {
    title: t('home-page.builders-tab'),
    id: 'builders',
    ...{
      [NETWORK_IDS.mainnet]: {
        href: config.COMMUNITY_CONTRIBUTION_URL,
      },
      [NETWORK_IDS.testnet]: {
        route: { name: ROUTE_NAMES.appBuildersList },
      },
    }[web3ProvidersStore.networkId],
  },
])

const isTabsShown = computed(
  () =>
    ![ROUTE_NAMES.appDashboardCapital, ROUTE_NAMES.appBuildersItem].find(
      el => el === route.name,
    ),
)
</script>

<style lang="scss" scoped>
.home-page {
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

.home-page__content-wrp {
  @include page-wrp;
}

.home-page__tabs {
  margin-bottom: toRem(64);
}

.home-page .home-page__view {
  display: grid;
  grid-template-columns: 1fr minmax(0, toRem(704));
  grid-gap: toRem(30);

  @include respond-to(medium) {
    margin-top: toRem(30);
    grid-template-columns: 1fr;
    grid-gap: toRem(28);
  }
}
</style>
