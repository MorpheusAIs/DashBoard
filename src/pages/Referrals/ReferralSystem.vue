<template>
  <div class="referral-system">
    <template v-if="isLoaded">
      <error-message
        v-if="isLoadFailed"
        class="referral-system__system-message"
        :message="$t('referral-system.error-message')"
      />
      <template v-else>
        <referral-system-info :pool-id="poolId" />
        <div class="referral-system__rate-wrapper">
          <referral-system-rate
            :pool-id="poolId"
            :referral-data="referralData"
            @claim-ref-bonus="openRefBonusModal"
          />
          <ref-rates-slider :pool-id="poolId" />
        </div>
      </template>
    </template>
    <loader v-else class="referral-system__system-message" />
    <ref-bonus-modal
      v-model:is-shown="isRefBonusModalOpened"
      :pool-id="poolId"
      :current-reward="referralData?.currentReward"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ReferralSystemInfo from './ReferralSystemInfo.vue'
import ReferralSystemRate from './ReferralSystemRate.vue'
import RefRatesSlider from './RefRatesSlider.vue'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'
import { ReferralData } from '@/types'
import { useRoute } from 'vue-router'
import { useWeb3ProvidersStore } from '@/store'
import { useReferralInfo } from '@/composables'
import { bus, BUS_EVENTS, ErrorHandler } from '@/helpers'
import { ErrorMessage, Loader } from '@/common'
import RefBonusModal from '@/pages/Referrals/RefBonusModal.vue'

const props = defineProps<{
  poolId: number
}>()

const route = useRoute()
const web3ProvidersStore = useWeb3ProvidersStore()
const { getRefData } = useReferralInfo(props.poolId)

const isLoaded = ref(false)
const isLoadFailed = ref(false)
const referralData = ref<ReferralData>()
const isRefBonusModalOpened = ref(false)

const openRefBonusModal = () => (isRefBonusModalOpened.value = true)

const init = async () => {
  isLoaded.value = false
  try {
    if (!route.query.user && !web3ProvidersStore.address) {
      await router.push({ name: ROUTE_NAMES.app })
      return
    }
    referralData.value = await getRefData(
      (route.query.user as string) || web3ProvidersStore.address,
    )
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.process(e)
  }
  isLoaded.value = true
}

onMounted(() => {
  init()
  bus.on(BUS_EVENTS.changedCurrentUserRefReward, init)
})

onBeforeUnmount(() => {
  bus.off(BUS_EVENTS.changedCurrentUserRefReward, init)
})

watch(
  [
    () => route.query.user,
    () => route.query.network,
    () => web3ProvidersStore.address,
  ],
  init,
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
.referral-system {
  display: flex;
  flex: 1;
  position: relative;
  gap: toRem(68);
  justify-content: center;
  padding: toRem(56) 0;

  @include respond-to(medium) {
    flex-direction: column;
    padding: toRem(36);
  }
}

.referral-system__rate-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(32);
}

.referral-system__system-message {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translateX(50%) translateY(-50%);
}
</style>
