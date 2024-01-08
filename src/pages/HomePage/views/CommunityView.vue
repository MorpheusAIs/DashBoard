<template>
  <div class="community-view">
    <info-bar
      status="public"
      :title="$t('home-page.community-view.info-bar.title')"
      :subtitle="$t('home-page.community-view.info-bar.subtitle')"
      :description="$t('home-page.community-view.info-bar.description')"
      :indicators="mockBarIndicators"
    >
      <div class="community-view__bar-buttons-wrp">
        <app-button
          class="community-view__bar-button"
          :text="$t('home-page.community-view.deposit-btn')"
        />
        <app-button
          class="community-view__bar-button"
          scheme="link"
          color="none"
          :text="$t('home-page.community-view.external-link')"
          :icon-right="$icons.externalLink"
        />
      </div>
    </info-bar>
    <info-dashboard :indicators="mockDashboardIndicators">
      <div class="community-view__dashboard-buttons-wrp">
        <app-button
          class="community-view__dashboard-button"
          color="secondary"
          :text="$t('home-page.community-view.withdraw-btn')"
        />
        <app-button
          class="community-view__dashboard-button"
          :text="$t('home-page.community-view.claim-btn')"
        />
      </div>
      <p class="community-view__dashboard-description">
        {{ $t('home-page.community-view.dashboard-description') }}
      </p>
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
    title: $t('home-page.community-view.total-invested-title'),
    value: '1 000.67 stETH',
  },
  {
    title: $t('home-page.community-view.daily-reward-title'),
    value: '100 MOR',
  },
  {
    title: $t('home-page.community-view.started-at-title'),
    value: '15 Sep 2023 at 13:42',
  },
  {
    title: $t('home-page.community-view.withdraw-at-title'),
    value: '1 Jan 2024 at 05:12',
    note: $t('home-page.community-view.withdraw-at-note'),
  },
  {
    title: $t('home-page.community-view.claim-at-title'),
    value: '1 Jan 2024 at 03:12',
    note: $t('home-page.community-view.claim-at-note'),
  },
]

const mockDashboardIndicators: InfoDashboardType.Indicator[] = [
  {
    iconName: ICON_NAMES.ethereum,
    title: $t('home-page.community-view.user-invested-title'),
    value: '13 stETH',
  },
  {
    iconName: ICON_NAMES.arbitrum,
    title: $t('home-page.community-view.available-to-claim-title'),
    value: '20 MOR',
  },
]
</script>

<style lang="scss" scoped>
.community-view__bar-buttons-wrp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(16);

  @include respond-to(medium) {
    flex-direction: column;
    gap: toRem(8);
  }
}

.community-view__bar-button {
  &:first-child {
    @include respond-to(medium) {
      width: 100%;
    }
  }
}

.community-view__dashboard-buttons-wrp {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(16);

  @include respond-to(medium) {
    grid-gap: toRem(12);
  }
}

.community-view .community-view__dashboard-button {
  width: 100%;
}

.community-view__dashboard-description {
  $color: #cccccc;

  margin-top: toRem(24);
  color: $color;

  @include body-5-regular;
}
</style>
