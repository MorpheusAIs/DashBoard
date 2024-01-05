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
        scheme="link"
        color="none"
        class="app-navbar__link"
      />
    </nav>
    <app-button color="secondary" :text="$t('app-navbar.connect-wallet-btn')" />
  </div>
</template>

<script lang="ts" setup>
import { useContext, useNavLinks } from '@/composables'
import AppButton from './AppButton.vue'
import AppLogo from './AppLogo.vue'

const { $t } = useContext()
const { links } = useNavLinks()
</script>

<style lang="scss" scoped>
$z-index: 1000;

.app-navbar {
  position: sticky;
  top: 0;
  z-index: $z-index;
  height: toRem(88);
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
