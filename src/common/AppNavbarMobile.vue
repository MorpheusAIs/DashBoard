<template>
  <div class="app-navbar-mobile">
    <app-logo />
    <button
      class="app-navbar-mobile__burger-btn"
      @click="isExtShown = !isExtShown"
    >
      <transition name="fade" mode="out-in">
        <icon
          class="app-navbar-mobile__burger-icon"
          :key="String(isExtShown)"
          :name="!isExtShown ? $icons.menuAlt1 : $icons.x"
        />
      </transition>
    </button>
    <transition name="fade" appear>
      <div v-if="isExtShown" class="app-navbar-mobile__ext-wrp">
        <transition name="slide" appear>
          <div class="app-navbar-mobile__ext">
            <nav class="app-navbar-mobile__nav">
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
                class="app-navbar-mobile__link"
                @click="closeExt"
              />
            </nav>
            <connect-wallet-button
              v-if="!web3ProvidersStore.provider.isConnected"
              class="app-navbar-mobile__connect-wallet-btn"
              color="secondary"
              :text="$t('app-navbar.connect-wallet-btn')"
            />
            <div v-else class="app-navbar-mobile__wallet-info-wrp">
              <wallet-dashboard />
              <wallet-balances />
            </div>
          </div>
        </transition>
        <button
          class="app-navbar-mobile__ext-backdrop"
          tabindex="-1"
          @click="closeExt"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useContext, useNavLinks } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import AppButton from './AppButton.vue'
import AppLogo from './AppLogo.vue'
import ConnectWalletButton from './ConnectWalletButton.vue'
import Icon from './Icon.vue'
import WalletBalances from './WalletBalances.vue'
import WalletDashboard from './WalletDashboard.vue'
import { ref } from 'vue'

const { $t } = useContext()
const { links } = useNavLinks()
const web3ProvidersStore = useWeb3ProvidersStore()

const isExtShown = ref(false)

const closeExt = () => {
  isExtShown.value = false
}
</script>

<style scoped lang="scss">
$background: #010201;
$z-index: 1000;

.app-navbar-mobile {
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
  background: $background;
  border-bottom: toRem(1) solid #444449;
}

.app-navbar-mobile__burger-icon {
  height: toRem(24);
  width: toRem(24);
  color: var(--text-secondary-light);
  transition: var(--transition-duration-fast) var(--transition-timing-default);

  .app-navbar-mobile__burger-btn:not([disabled]):hover &,
  .app-navbar-mobile__burger-btn:not([disabled]):focus &,
  .app-navbar-mobile__burger-btn:not([disabled]):active & {
    color: var(--primary-main);
  }
}

.app-navbar-mobile__ext-wrp {
  position: fixed;
  overflow: hidden;
  inset: var(--app-navbar-height) 0 0;
  background: var(--backdrop-modal);
  width: 100%;
}

.app-navbar-mobile__ext {
  display: flex;
  flex-direction: column;
  background: $background;
  padding: toRem(28) var(--app-padding-right) toRem(32) var(--app-padding-left);
}

.app-navbar-mobile__nav {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-navbar-mobile .app-navbar-mobile__link {
  &.router-link-active {
    @include respond-to(medium) {
      font-family: var(--app-font-family);
      font-size: toRem(18);
      font-weight: 600;
      line-height: toRem(26);
      letter-spacing: 0;
    }
  }

  @include respond-to(medium) {
    font-family: var(--app-font-family);
    font-size: toRem(18);
    font-weight: 400;
    line-height: toRem(26);
    letter-spacing: 0;
  }
}

.app-navbar-mobile .app-navbar-mobile__connect-wallet-btn {
  margin: toRem(76) auto 0;
  min-width: toRem(202);
}

.app-navbar-mobile__wallet-info-wrp {
  display: flex;
  align-items: center;
  gap: toRem(20);
  margin: toRem(76) auto 0;
}

.app-navbar-mobile__ext-backdrop {
  $z-index: -1;

  position: absolute;
  cursor: default;
  z-index: $z-index;
  inset: 0;
}

.slide-enter-active {
  animation: slide-in var(--transition-duration-fast)
    var(--transition-timing-default);
}

.slide-leave-active {
  animation: slide-in var(--transition-duration-fast)
    var(--transition-timing-default) reverse;
}

@keyframes slide-in {
  from {
    transform: translateY(-100%);
  }

  to {
    transform: translateY(0);
  }
}
</style>
