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
      <div class="delegator-info-page__content-wrapper">
        <delegator-info-cards class="delegator-info-page__info-cards" />
        <delegates-list class="delegator-info-page__list" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppButton } from '@/common'
import { ICON_NAMES } from '@/enums'
import DelegationInfoTitle from './components/DelegationInfoTitle.vue'
import DelegatorInfoCards from './components/DelegatorInfoCards.vue'
import DelegatesList from './components/DelegatesList.vue'
import { useWeb3ProvidersStore } from '@/store'

const web3ProvidersStore = useWeb3ProvidersStore()

web3ProvidersStore.provider.selectChain(
  web3ProvidersStore.selectedNetworkByType.l2.chainId,
)
</script>

<style scoped lang="scss">
.delegator-info-page {
  padding: var(--app-padding);
}

.delegator-info-page__back-button {
  color: var(--text-secondary-light);
}

.delegator-info-page__title {
  margin-top: toRem(56);
}

.delegator-info-page__content-wrapper {
  display: flex;
  gap: toRem(66);
  justify-content: space-evenly;
  margin-top: toRem(24);
}

.delegator-info-page__info-cards {
  min-width: toRem(400);
}
</style>
