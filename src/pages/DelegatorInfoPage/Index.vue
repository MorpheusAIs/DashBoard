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
import { useExceptionContractsProvider } from '@/composables'
import { watch } from 'vue'

const web3ProvidersStore = useWeb3ProvidersStore()

const DelegationPageProvider = useExceptionContractsProvider('DelegationPage')

watch(DelegationPageProvider.value.network, () => {
  if (DelegationPageProvider.value.network === undefined) {
    return
  }

  web3ProvidersStore.provider.selectChain(
    String(DelegationPageProvider.value.network.chainId),
  )
})
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

  @include respond-to(large) {
    flex-direction: column;
    gap: toRem(32);
  }
}

.delegator-info-page__info-cards {
  min-width: toRem(400);
}
</style>
