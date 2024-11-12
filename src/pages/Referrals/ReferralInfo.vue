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
      :text="$t('referral-info.button-txt')"
      @click="becomeReferrer"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n, useReferral } from '@/composables'
import { AppButton } from '@/common'
import ReferralInfoCards from './ReferralInfoCards.vue'

defineProps<{
  poolId: number
}>()

const { t } = useI18n()
const { becomeReferrer } = useReferral()

const description = computed(() => [
  t('referral-info.description-1'),
  t('referral-info.description-2'),
  t('referral-info.description-3'),
])
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
}
</style>
