<template>
  <div class="referrals">
    <div class="referrals__content-wrp">
      <component
        :is="refComponent"
        :pool-id="poolId"
        @become-referrer="becomeReferrer"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ReferralInfo from './ReferralInfo.vue'
import ReferralSystem from './ReferralSystem.vue'
import { computed, ref } from 'vue'
import { useReferral } from '@/composables'

defineProps<{
  poolId: number
}>()

const isRefSystemPage = ref(false)

const { isReferrer } = useReferral()

const refComponent = computed(() =>
  isRefSystemPage.value || isReferrer.value ? ReferralSystem : ReferralInfo,
)

const becomeReferrer = () => {
  isRefSystemPage.value = true
}
</script>

<style scoped lang="scss">
.referrals {
  $z-index: 1;

  flex: 1;
  position: relative;
  z-index: $z-index;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:before {
    $z-index: -1;

    position: absolute;
    z-index: $z-index;
    bottom: toRem(-700);
    left: toRem(-700);
    content: '';
    display: block;
    height: toRem(1400);
    width: toRem(1400);
    background: radial-gradient(#215244, transparent 60%);

    @include respond-to(medium) {
      margin: 0 auto;
      bottom: toRem(-1700);
      left: unset;
      height: toRem(2600);
      width: toRem(2600);
    }
  }

  &:after {
    $z-index: -1;

    position: absolute;
    top: toRem(-440);
    right: toRem(-1030);
    z-index: $z-index;
    content: '';
    display: block;
    height: toRem(1400);
    width: toRem(1400);
    background: radial-gradient(#215244, transparent 60%);

    @include respond-to(medium) {
      display: none;
    }
  }
}

.referrals__content-wrp {
  display: flex;
  flex-direction: column;
  flex: 1;

  @include page-wrp;
}
</style>
