<template>
  <div class="info-dashboard" :class="{ 'info-dashboard--loading': isLoading }">
    <transition name="fade" mode="out-in">
      <div v-if="web3ProvidersStore.isConnected" class="info-dashboard__wrp">
        <app-chart :config="chartConfig" />
        <ul v-if="indicators?.length" class="info-dashboard__indicators">
          <li
            v-for="(indicator, idx) in indicators"
            :key="idx"
            class="info-dashboard__indicator"
          >
            <div class="info-dashboard__indicator-title-wrp">
              <app-icon
                class="info-dashboard__indicator-icon"
                :name="indicator.iconName"
              />
              <h5 class="info-dashboard__indicator-title">
                {{ indicator.title }}
              </h5>
            </div>
            <p class="info-dashboard__indicator-value">
              {{ indicator.value || '-' }}
            </p>
          </li>
        </ul>
        <div v-if="$slots.default" class="info-dashboard__slot-wrp">
          <slot />
        </div>
      </div>
      <div v-else class="info-dashboard__wrp">
        <img
          class="info-dashboard__logo"
          src="/branding/info-dashboard-logo.svg"
          alt="info-dashboard-logo"
        />
        <p class="info-dashboard__connection-msg">
          {{ $t('info-dashboard.connection-msg') }}
        </p>
        <connect-wallet-button class="info-dashboard__connect-wallet-btn" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { AMOUNT_OF_DEPOSIT_CHART_CONFIG } from '@/const'
import { useWeb3ProvidersStore } from '@/store'
import type { ChartConfig, InfoDashboardType } from '@/types'
import AppIcon from './AppIcon.vue'
import AppChart from './AppChart.vue'
import ConnectWalletButton from './ConnectWalletButton.vue'

withDefaults(
  defineProps<{
    indicators?: InfoDashboardType.Indicator[]
    isLoading?: boolean
  }>(),
  {
    indicators: () => [],
    isLoading: false,
  },
)

const mockData = [
  { month: 'March', day: 1, amount: 10000 },
  { month: 'March', day: 5, amount: 20000 },
  { month: 'March', day: 10, amount: 15000 },
  { month: 'March', day: 15, amount: 25000 },
  { month: 'March', day: 20, amount: 22000 },
  { month: 'March', day: 25, amount: 30000 },
  { month: 'March', day: 30, amount: 28000 },
]

const chartConfig: ChartConfig = { ...AMOUNT_OF_DEPOSIT_CHART_CONFIG }

chartConfig.data.labels = mockData.map(row => `${row.month} ${row.day}`)
chartConfig.data.datasets[0].data = mockData.map(row => row.amount)

const web3ProvidersStore = useWeb3ProvidersStore()
</script>

<style lang="scss" scoped>
.info-dashboard {
  padding: toRem(50) toRem(20) toRem(30);
  height: max-content;
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    -84deg,
    rgba(255, 255, 255, 0.48),
    rgba(255, 255, 255, 0.08)
  );
  background: linear-gradient(
      -84deg,
      rgba(57, 99, 58, 0.04),
      rgba(38, 57, 57, 0.5)
    )
    padding-box;

  @include respond-to(medium) {
    padding: toRem(20) toRem(16) toRem(22);
  }
}

.info-dashboard__wrp {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-dashboard__indicators {
  margin-top: toRem(16);
  width: 100%;
  display: grid;
  grid-gap: toRem(8);
  padding-top: toRem(24);
  border-top: toRem(2) solid #494949;
}

.info-dashboard__indicator {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  grid-gap: toRem(24);

  @include respond-to(medium) {
    grid-gap: toRem(16);
  }
}

.info-dashboard__indicator-title-wrp {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-gap: toRem(8);

  .info-dashboard--loading & {
    height: toRem(26);
    width: 100%;

    @include skeleton;

    @include respond-to(medium) {
      height: toRem(20);
    }
  }

  @include respond-to(medium) {
    grid-gap: toRem(4);
  }
}

.info-dashboard__indicator-icon {
  height: toRem(24);
  width: toRem(24);

  @include respond-to(medium) {
    height: toRem(20);
    width: toRem(20);
  }
}

.info-dashboard__indicator-title {
  @include body-3-regular;
}

.info-dashboard__indicator-value {
  justify-self: end;

  .info-dashboard--loading & {
    height: toRem(26);
    width: 100%;

    @include skeleton;

    @include respond-to(medium) {
      height: toRem(20);
    }
  }

  @include body-3-semi-bold;

  @include text-ellipsis;
}

.info-dashboard__slot-wrp {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: toRem(24);

  .info-dashboard__indicators + & {
    margin-top: toRem(28);

    @include respond-to(medium) {
      margin-top: toRem(24);
    }
  }
}

.info-dashboard__logo {
  height: toRem(220);
  width: toRem(160);

  @include respond-to(medium) {
    height: toRem(112);
    width: toRem(80);
  }
}

.info-dashboard__connection-msg {
  margin-top: toRem(24);
  text-align: center;
}

.info-dashboard .info-dashboard__connect-wallet-btn {
  margin-top: toRem(24);
  min-width: toRem(190);

  @include respond-to(medium) {
    min-width: toRem(162);
  }
}
</style>
