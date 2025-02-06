<template>
  <div class="delegator-info-page">
    <div class="delegator-info-page__wrapper">
      <app-button
        class="delegator-info-page__back-button"
        scheme="link"
        :text="$t('delegator-info-page.back-button')"
        :icon-left="ICON_NAMES.arrowLeft"
        @click="handleBack"
      />
      <delegation-info-title class="delegator-info-page__title" />
      <div class="delegator-info-page__content-wrapper">
        <delegator-info-cards class="delegator-info-page__info-cards" />
        <delegates-list
          class="delegator-info-page__list"
          @stake="isStakeModalShown = true"
        />
      </div>
    </div>
  </div>

  <delegate-tokens-modal
    v-if="subnetAddress"
    v-model:is-shown="isStakeModalShown"
    :delegate-address="subnetAddress"
  />
</template>

<script setup lang="ts">
import { AppButton } from '@/common'
import { ICON_NAMES } from '@/enums'
import DelegationInfoTitle from './components/DelegationInfoTitle.vue'
import DelegatorInfoCards from './components/DelegatorInfoCards.vue'
import DelegatesList from './components/DelegatesList.vue'
import DelegateTokensModal from '@/pages/DelegationPage/components/DelegateTokensModal.vue'
import { useWeb3ProvidersStore } from '@/store'
import { useExceptionContractsProvider } from '@/composables'
import { watch, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ROUTE_NAMES as $routes } from '@/enums'
import { utils } from 'ethers'
import { sleep } from '@/helpers'
import { ErrorHandler } from '@/helpers'

const route = useRoute()
const router = useRouter()
const web3ProvidersStore = useWeb3ProvidersStore()
const isStakeModalShown = ref(false)

const subnetAddress = computed(() => {
  return route.params.id as string
})

const DelegationPageProvider = useExceptionContractsProvider('DelegationPage')

const handleBack = async () => {
  try {
    // First switch to the correct chain
    if (DelegationPageProvider.value?.network?.chainId) {
      await web3ProvidersStore.provider.selectChain(
        utils.hexValue(Number(DelegationPageProvider.value.network.chainId)),
      )
      // Add a small delay to ensure chain switch completes
      await sleep(500)
    }

    // Then navigate back
    await router.push({
      name: $routes.appDelegation,
      query: { network: route.query.network },
    })
  } catch (error) {
    ErrorHandler.process(error)
  }
}

const loadPage = async () => {
  try {
    // Wait for network to be available
    if (!DelegationPageProvider.value?.network?.chainId) {
      return
    }

    await web3ProvidersStore.provider.selectChain(
      utils.hexValue(Number(DelegationPageProvider.value.network.chainId)),
    )
    // Add a small delay to ensure chain switch completes
    await sleep(500)
  } catch (error) {
    ErrorHandler.process(error)
  }
}

// Watch both route changes and chain changes
watch(
  [
    () => route.params.id,
    () => web3ProvidersStore.provider.chainId,
    () => DelegationPageProvider.value?.network?.chainId,
  ],
  async () => {
    await loadPage()
  },
  { immediate: true },
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

  @include respond-to(large) {
    flex-direction: column;
    gap: toRem(32);
  }
}

.delegator-info-page__info-cards {
  min-width: toRem(400);
}
</style>
