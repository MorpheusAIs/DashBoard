<template>
  <div class="referral-info">
    <h1 class="referral-info__title">
      {{ $t('referral-info.title') }}
    </h1>
    <div class="referral-info__description-wrp">
      <span
        v-for="item in description"
        class="referral-info__description"
        :key="item"
      >
        {{ item }}
      </span>
    </div>
    <h3 class="referral-info__subtitle">
      {{ $t('referral-info.subtitle') }}
    </h3>
    <div class="referral-info__tier-info-wrp">
      <referral-info-cards :pool-id="poolId" />
    </div>
    <app-button
      class="referral-info__button"
      :text="buttonText"
      @click="tryUpdateRefState"
    />
  </div>
</template>

<script setup lang="ts">
import ReferralInfoCards from './ReferralInfoCards.vue'

import { useI18n, useReferral } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import { AppButton } from '@/common'
import { computed } from 'vue'
import { ErrorHandler } from '@/helpers'

defineProps<{
  poolId: number
}>()

const emit = defineEmits<{
  (e: 'become-referrer'): void
}>()

const { t } = useI18n()
const { becomeReferrer } = useReferral()
const web3ProvidersStore = useWeb3ProvidersStore()

const description = computed(() => [
  t('referral-info.description-1'),
  t('referral-info.description-2'),
  t('referral-info.description-3'),
])

const updateRefState = () => {
  becomeReferrer()
  emit('become-referrer')
}

const buttonText = computed(() => {
  return web3ProvidersStore.provider.isConnected
    ? t('referral-info.button-txt')
    : t('referral-info.connect-wallet')
})

const tryUpdateRefState = async () => {
  if (!web3ProvidersStore.provider.isConnected) {
    try {
      await web3ProvidersStore.provider.connect()
    } catch (e) {
      ErrorHandler.process(e)
    }

    return
  }

  updateRefState()
}
</script>

<style scoped lang="scss">
.referral-info__title {
  font-weight: 700;
  font-size: toRem(54);
  margin-top: toRem(64);
  text-align: center;
}

.referral-info__description-wrp {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: toRem(820);
  margin: toRem(24) auto toRem(48);
  gap: toRem(16);

  @include respond-to(medium) {
    max-width: 100%;
    padding: 0 toRem(24);
  }
}

.referral-info__description {
  text-align: center;
  font-size: toRem(17);
}

.referral-info__subtitle {
  font-weight: 700;
  font-size: toRem(32);
  text-align: center;
}

.referral-info__tier-info-wrp {
  max-width: toRem(1240);
  margin: toRem(24) auto toRem(48);
}

.referral-info__button {
  margin: 0 auto toRem(100);
  width: toRem(382);

  @include respond-to(xsmall) {
    width: toRem(300);
  }
}
</style>
