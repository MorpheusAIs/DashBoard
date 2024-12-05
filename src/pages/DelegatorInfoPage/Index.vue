<template>
  <div class="delegator-info-page">
    <div class="delegator-info-page__wrapper">
      <app-button
        class="delegator-info-page__back-button"
        scheme="link"
        :text="$t('delegator-info-page.back-button')"
        :icon-left="ICON_NAMES.arrowLeft"
        :route="{ name: $routes.appDelegation }"
      />
      <delegation-info-title class="delegator-info-page__title" />
      <delegator-info-cards class="delegator-info-page__info-cards" />
      <delegates-list class="delegator-info-page__list" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppButton } from '@/common'
import { ICON_NAMES } from '@/enums'
import DelegationInfoTitle from './components/DelegationInfoTitle.vue'
import DelegatorInfoCards from './components/DelegatorInfoCards.vue'
import DelegatesList from './components/DelegatesList.vue'
</script>

<style scoped lang="scss">
.delegator-info-page {
  padding: var(--app-padding);
}

.delegator-info-page__back-button {
  color: var(--text-secondary-light);
}

.delegator-info-page__wrapper {
  @include page-wrp;
}

.delegator-info-page__title {
  margin-top: toRem(56);
}

.delegator-info-page__info-cards {
  margin: toRem(32) 0;
}
</style>
