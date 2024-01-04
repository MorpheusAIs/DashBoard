<template>
  <main class="home-page">
    <app-tabs :tabs="tabs" />
  </main>
</template>

<script lang="ts" setup>
import { AppTabs } from '@/common'
import { ROUTE_NAMES } from '@/enums'
import { Tab } from '@/types'

const tabs: Tab[] = [
  {
    title: 'Community',
    id: 'community',
    route: { name: ROUTE_NAMES.app },
  },
  {
    title: 'Coders',
    id: 'coders',
    route: { name: ROUTE_NAMES.uiKit },
  },
  {
    title: 'Compute',
    id: 'compute',
    route: { name: ROUTE_NAMES.uiKit },
  },
  {
    title: 'Capital',
    id: 'capital',
    route: { name: ROUTE_NAMES.uiKit },
  },
]
</script>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: toRem(70);
}
</style>
