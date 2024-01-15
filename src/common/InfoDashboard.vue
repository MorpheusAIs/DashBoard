<template>
  <div class="info-dashboard">
    <transition name="fade" mode="out-in">
      <div
        v-if="web3ProvidersStore.provider.isConnected"
        class="info-dashboard__wrp"
      >
        <progress-bar
          class="info-dashboard__progress-bar"
          :title="$t('info-dashboard.progress-bar-title')"
          :progress="56.5"
          :total="100"
        />
        <ul v-if="indicators?.length" class="info-dashboard__indicators">
          <li
            v-for="(indicator, idx) in indicators"
            :key="idx"
            class="info-dashboard__indicator"
          >
            <div class="info-dashboard__indicator-title-wrp">
              <icon
                class="info-dashboard__indicator-icon"
                :name="indicator.iconName"
              />
              <h5 class="info-dashboard__indicator-title">
                {{ indicator.title }}
              </h5>
            </div>
            <p class="info-dashboard__indicator-value">
              {{ indicator.value }}
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
        <connect-wallet-button
          class="info-dashboard__connect-wallet-btn"
          :text="$t('info-dashboard.connect-wallet-btn')"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { type InfoDashboardType } from '@/types'
import { useWeb3ProvidersStore } from '@/store'
import ConnectWalletButton from './ConnectWalletButton.vue'
import Icon from './Icon.vue'
import ProgressBar from './ProgressBar.vue'

defineProps<{
  indicators?: InfoDashboardType.Indicator[]
}>()

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

.info-dashboard__progress-bar {
  height: toRem(156);
  width: toRem(156);

  @include respond-to(medium) {
    height: toRem(126);
    width: toRem(126);
  }
}

.info-dashboard__indicators {
  margin-top: toRem(24);
  width: 100%;
  display: grid;
  grid-gap: toRem(8);
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
  text-align: right;

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
