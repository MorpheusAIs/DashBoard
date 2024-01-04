<template>
  <div class="app-navbar">
    <app-logo />
    <div class="app-navbar__links-wrp">
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
    </div>
    <app-button
      color="secondary"
      :text="$t('app-navbar.connect-wallet-btn')"
      :route="{ name: $routes.uiKit }"
    />
  </div>
</template>

<script lang="ts" setup>
import { AppLogo } from '@/common'
import { useContext } from '@/composables'
import { ROUTE_NAMES } from '@/enums'
import AppButton from './AppButton.vue'

const { $t } = useContext()

const links = [
  {
    text: $t('app-navbar.token-contract-link'),
    route: { name: ROUTE_NAMES.app },
  },
  {
    text: $t('app-navbar.chat-app-link'),
    href: '',
  },
]
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

.app-navbar__links-wrp {
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
