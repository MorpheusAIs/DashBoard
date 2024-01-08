<template>
  <div class="coders-view">
    <info-bar
      status="private"
      :title="$t('home-page.coders-view.info-bar.title')"
      :subtitle="$t('home-page.coders-view.info-bar.subtitle')"
      :description="$t('home-page.coders-view.info-bar.description')"
      :indicators="mockBarIndicators"
    />
    <info-dashboard :indicators="mockDashboardIndicators">
      <app-button
        class="coders-view__dashboard-btn"
        :text="$t('home-page.coders-view.claim-btn')"
      />
    </info-dashboard>
  </div>
</template>

<script lang="ts" setup>
import { AppButton, InfoBar, InfoDashboard } from '@/common'
import { useContext } from '@/composables'
import { ICON_NAMES } from '@/enums'
import type { InfoBarType, InfoDashboardType } from '@/types'

const { $t } = useContext()

const mockBarIndicators: InfoBarType.Indicator[] = [
  {
    title: $t('home-page.coders-view.daily-reward-title'),
    value: '100 MOR',
  },
  {
    title: $t('home-page.coders-view.started-at-title'),
    value: '15 Sep 2023',
  },
  {
    title: $t('home-page.coders-view.claim-at-title'),
    value: '1 Jan 2024 at 05:02',
    note: $t('home-page.coders-view.claim-at-note'),
  },
]

const mockDashboardIndicators: InfoDashboardType.Indicator[] = [
  {
    iconName: ICON_NAMES.arbitrum,
    title: $t('home-page.coders-view.total-earning-title'),
    value: '20 MOR',
  },
  {
    iconName: ICON_NAMES.arbitrum,
    title: $t('home-page.coders-view.available-to-claim-title'),
    value: '12 MOR',
  },
]
</script>

<style lang="scss" scoped>
.coders-view .coders-view__dashboard-btn {
  min-width: toRem(184);

  @include respond-to(medium) {
    width: 100%;
  }
}
</style>
