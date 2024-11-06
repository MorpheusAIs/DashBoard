<template>
  <div class="referral-system">
    <referral-system-info />
    <div class="referral-system__rate-wrapper">
      <referral-system-rate @claim-ref-bonus="openRefBonusModal" />
      <ref-rates-slider :pool-id="poolId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReferralSystemInfo from './ReferralSystemInfo.vue'
import ReferralSystemRate from './ReferralSystemRate.vue'
import RefRatesSlider from './RefRatesSlider.vue'

defineProps<{
  poolId: number
}>()

const isRefBonusModalOpened = ref(false)

const openRefBonusModal = () => (isRefBonusModalOpened.value = true)
</script>

<style scoped lang="scss">
.referral-system {
  display: flex;
  gap: toRem(68);
  justify-content: center;
  padding: toRem(56) 0;
}

.referral-system__rate-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(32);
}
</style>
