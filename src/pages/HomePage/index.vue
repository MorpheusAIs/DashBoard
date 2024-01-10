<template>
  <main class="home-page">
    <div class="home-page__content-wrp">
      <app-tabs :tabs="tabs" />
      <router-view class="home-page__view" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { AppTabs } from '@/common'
import { useContext } from '@/composables'
import { ROUTE_NAMES } from '@/enums'
import { type Tab } from '@/types'

const { $t } = useContext()

const tabs: Tab[] = [
  {
    title: $t('home-page.community-tab'),
    id: 'community',
    route: { name: ROUTE_NAMES.appCommunity },
  },
  {
    title: $t('home-page.coders-tab'),
    id: 'coders',
    route: { name: ROUTE_NAMES.appCoders },
  },
  {
    title: $t('home-page.compute-tab'),
    id: 'compute',
    route: { name: ROUTE_NAMES.appCompute },
  },
  {
    title: $t('home-page.capital-tab'),
    id: 'capital',
    route: { name: ROUTE_NAMES.appCapital },
  },
]
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
  width: 100%;
  max-width: toRem(912);
}

.home-page .home-page__view {
  margin-top: toRem(64);
  display: grid;
  grid-template-columns: 1fr toRem(420);
  grid-gap: toRem(68);

  @include respond-to(medium) {
    margin-top: toRem(30);
    grid-template-columns: 1fr;
    grid-gap: toRem(28);
  }
}
</style>