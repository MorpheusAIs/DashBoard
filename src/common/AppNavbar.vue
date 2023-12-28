<template>
  <div class="app-navbar">
    <app-logo class="app-navbar__logo" />

    <app-button
      class="app-navbar__link"
      :scheme="'flat'"
      :text="$routes.uiKit"
      :route="{ name: $routes.uiKit }"
    />

    <app-button
      class="app-navbar__link"
      :scheme="'flat'"
      :text="$routes.complexForm"
      :route="{ name: $routes.complexForm }"
    />
  </div>
</template>

<script lang="ts" setup>
import { AppLogo } from '@/common'
import AppButton from '@/common/AppButton.vue'
</script>

<style lang="scss" scoped>
.app-navbar {
  display: flex;
  align-items: center;
  gap: toRem(24);
  padding: toRem(24) var(--app-padding-right) toRem(24) var(--app-padding-left);
  background: var(--background-primary-main);
  border-bottom: var(--border-primary-main);

  @include respond-to(tablet) {
    flex-wrap: wrap;
  }
}

.app-navbar__logo {
  margin-right: auto;

  @include respond-to(xsmall) {
    width: 100%;
    margin-bottom: toRem(24);
  }
}

.app-navbar__link {
  opacity: 0.25;

  &:first-child {
    margin-left: auto;
  }

  &.router-link-active {
    opacity: 1;
  }
}
</style>
