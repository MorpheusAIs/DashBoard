<template>
  <div class="app-navbar">
    <app-logo />
    <nav class="app-navbar__nav">
      <app-button
        v-for="(link, idx) in links"
        :key="idx"
        :text="link.text"
        :href="link.href"
        :route="link.route"
        :target="link.href ? '_blank' : undefined"
        :rel="link.href ? 'noopener noreferrer' : undefined"
        scheme="link"
        color="none"
        class="app-navbar__link"
      />
    </nav>
    <transition name="fade" mode="out-in">
      <connect-wallet-button
        v-if="!web3ProvidersStore.provider.isConnected"
        color="secondary"
        :text="$t('app-navbar.connect-wallet-btn')"
      />
      <wallet-dashboard v-else />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useContext, useNavLinks } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import AppButton from './AppButton.vue'
import AppLogo from './AppLogo.vue'
import ConnectWalletButton from './ConnectWalletButton.vue'
import WalletDashboard from '@/common/WalletDashboard.vue'

const { $t } = useContext()
const { links } = useNavLinks()
const web3ProvidersStore = useWeb3ProvidersStore()
</script>

<style lang="scss" scoped>
$z-index: 1000;

.app-navbar {
  position: fixed;
  z-index: $z-index;
  top: 0;
  height: var(--app-navbar-height);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(24);
  padding: 0 var(--app-padding-right) 0 var(--app-padding-left);
  background: #010201;
  border-bottom: toRem(1) solid #444449;
}

.app-navbar__nav {
  display: flex;
  gap: toRem(48);
}

.app-navbar .app-navbar__link {
  @include body-3-regular;

  &.router-link-active {
    @include body-3-semi-bold;
  }
}
</style>
