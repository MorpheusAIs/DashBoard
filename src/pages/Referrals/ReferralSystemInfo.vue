<template>
  <div class="referral-system-info">
    <h1 class="referral-system-info__title">
      {{ $t('referral-system-info.title') }}
    </h1>
    <div class="referral-system-info__desc-wrp">
      <span class="referral-system-info__desc">
        {{ $t('referral-system-info.description-1') }}
      </span>
      <span class="referral-system-info__desc">
        {{ $t('referral-system-info.description-2') }}
      </span>
    </div>
    <div class="referral-system-info__ref-link-wrapper">
      <span class="referral-system-info__ref-link-text">
        {{ $t('referral-system-info.ref-address') }}
      </span>
      <div class="referral-system-info__ref-button-wrp">
        <app-button
          class="referral-system-info__ref-button"
          scheme="link"
          color="none"
          target="_blank"
          rel="noopener noreferrer"
          :href="refLink"
          :text="refLink"
        />
        <copy-button
          class="referral-system-info__copy-button"
          :content="refLink"
          :message="$t('referral-system-info.coppied-text')"
        />
      </div>
    </div>
    <referees-list
      v-if="refsCount"
      class="referral-system-info__referees-list"
      :pool-id="poolId"
    />
  </div>
</template>

<script setup lang="ts">
import { AppButton, CopyButton } from '@/common'
import { computed, watch } from 'vue'
import { ROUTE_NAMES } from '@/enums'
import { useRouter, useRoute } from 'vue-router'
import { useWeb3ProvidersStore } from '@/store'
import RefereesList from '@/pages/Referrals/RefereesList/index.vue'
import { useReferralInfo } from '@/composables'

const props = defineProps<{
  poolId: number
}>()

const web3ProvidersStore = useWeb3ProvidersStore()
const router = useRouter()
const route = useRoute()
const { refsCount, getDepositedAmountByUser } = useReferralInfo(props.poolId)

const refLink = computed(() => {
  const link = router.resolve({
    name: ROUTE_NAMES.appCapital,
    query: {
      referrer: route.query.user || web3ProvidersStore.address,
      network: route.query.network,
    },
  }).href
  return `${window.location.origin}${link}`
})

watch(
  [
    () => route.query.user,
    () => route.query.network,
    () => web3ProvidersStore.address,
  ],
  getDepositedAmountByUser(route.query.user || web3ProvidersStore.address),
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
.referral-system-info {
  max-width: toRem(582);

  @include respond-to(medium) {
    max-width: 100%;
  }
}

.referral-system-info__title {
  font-size: toRem(54);
  line-height: toRem(81);
  font-weight: 700;
}

.referral-system-info__ref-button-wrp {
  display: flex;
  gap: toRem(8);
  margin-top: toRem(8);

  @include respond-to(medium) {
    justify-content: space-between;
  }
}

.referral-system-info__ref-button {
  width: 100%;

  @include respond-to(medium) {
    width: fit-content;
  }
}

.referral-system-info__copy-button {
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.5;
  }
}

.referral-system-info__desc-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(12);
  padding: toRem(24) 0 toRem(40);
  border-bottom: toRem(2) solid var(--border-tertiary-main);
}

.referral-system-info__desc {
  font-size: toRem(17);
}

.referral-system-info__ref-link-wrapper {
  padding-top: toRem(24);
}

.referral-system-info__ref-link-text {
  font-size: toRem(18);
  color: var(--text-tertiary-main);
}

.referral-system-info__referees-list {
  margin-top: toRem(56);
}
</style>
