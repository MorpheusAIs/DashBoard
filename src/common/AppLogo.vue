<template>
  <div class="app-logo">
    <router-link
      class="app-logo__link"
      :to="{ name: $routes.app }"
      @click="onClick"
    >
      <svg class="app-logo__img">
        <use href="/branding/logo.svg#logo" />
      </svg>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { ROUTE_NAMES } from '@/enums'
import { useRoute } from '@/router'

const route = useRoute()

const onClick = () => {
  if (route.name === ROUTE_NAMES.appCapital) window.location.reload()
}
</script>

<style lang="scss" scoped>
.app-logo__img {
  display: block;
  height: toRem(40);
  width: toRem(90);
  color: var(--text-secondary-light);
  transition: color var(--transition-duration-fast)
    var(--transition-timing-default);

  .app-logo__link:hover &,
  .app-logo__link:focus &,
  .app-logo__link:active & {
    color: var(--primary-main);
  }

  @include respond-to(medium) {
    height: toRem(24);
    width: toRem(56);
  }
}
</style>
