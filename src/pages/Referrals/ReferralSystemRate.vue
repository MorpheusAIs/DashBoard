<template>
  <div class="referral-system-rate">
    <h5 class="referral-system-rate__title">
      {{ $t('referral-system-rate.rate') }}
    </h5>
    <div class="referral-system-rate__card">
      <h3 class="referral-system-rate__tier">
        {{
          $t('referral-system-rate.title', { tier: referralData?.tier ?? 0 })
        }}
      </h3>
      <div class="referral-system-rate__info-wrp">
        <div
          v-for="item in info"
          class="referral-system-rate__info"
          :key="item.value"
        >
          <span class="referral-system-rate__info-title">
            {{ item.title }}
          </span>
          <span class="referral-system-rate__info-value">
            {{ item.value }}
          </span>
        </div>
      </div>
      <div class="referral-system-rate__mor-wrp">
        <h4 class="referral-system-rate__mor-value">
          {{ availableToClaim || 0 }}
        </h4>
        <span class="referral-system-rate__available-to-claim">
          {{
            $t('referral-system-rate.available-to-claim', {
              symbol: web3ProvidersStore.rewardsTokenSymbol,
            })
          }}
        </span>
      </div>
      <app-button
        v-if="!isClaimButtonHidden"
        class="referral-system-rate__button"
        :text="
          $t('referral-system-rate.button-text', {
            symbol: web3ProvidersStore.rewardsTokenSymbol,
          })
        "
        :disabled="!Boolean(availableToClaim)"
        @click="emit('claim-ref-bonus')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppButton } from '@/common'
import { computed } from 'vue'
import { useI18n } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import { ReferralData } from '@/types'
import { ethers } from 'ethers'
import { useRoute } from 'vue-router'

const ROUND_DIGITS = 5
const PERCENTS_DECIMALS = 23

const emit = defineEmits<{
  (e: 'claim-ref-bonus'): void
}>()

const props = defineProps<{
  poolId: number
  referralData: ReferralData
}>()

const route = useRoute()
const web3ProvidersStore = useWeb3ProvidersStore()
const { t } = useI18n()

const availableToClaim = computed(() =>
  parseFloat(
    parseFloat(
      ethers.utils.formatUnits(props.referralData.currentReward),
    ).toFixed(5),
  ),
)

const isClaimButtonHidden = computed(
  () =>
    Boolean(route.query.user) &&
    route.query.user !== web3ProvidersStore.address,
)

const info = computed(() => [
  {
    title: t('referral-system-rate.deposited-text'),
    value: `${
      props.referralData?.amountStaked?.gt(0)
        ? ethers.utils.formatUnits(props.referralData?.amountStaked)
        : 0
    } ${web3ProvidersStore.depositTokenSymbol}`,
  },
  {
    title: t('referral-system-rate.bonus-text'),
    value: `${
      props.referralData?.multiplier
        ? ethers.utils.formatUnits(
            props.referralData?.multiplier,
            PERCENTS_DECIMALS,
          )
        : 0
    }%`,
  },
  {
    title: t('referral-system-rate.earned-text', {
      symbol: web3ProvidersStore.rewardsTokenSymbol,
    }),
    value: `${
      props.referralData?.totalClaimed
        ? parseFloat(
            parseFloat(
              ethers.utils.formatUnits(props.referralData?.totalClaimed),
            ).toFixed(ROUND_DIGITS),
          )
        : 0
    }`,
  },
])
</script>

<style scoped lang="scss">
.referral-system-rate__title {
  font-size: toRem(18);
  font-weight: 500;
}

.referral-system-rate__card {
  display: flex;
  flex-direction: column;
  margin-top: toRem(16);
  gap: toRem(32);
  padding: toRem(24) toRem(24) toRem(48) toRem(24);
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: var(--card-border-gradient);
  background: var(--card-background-gradient);
}

.referral-system-rate__tier {
  font-size: toRem(24);
  font-weight: 600;
  color: var(--primary-main);
}

.referral-system-rate__info-wrp {
  display: flex;
  flex-direction: column;
  gap: toRem(9);
}

.referral-system-rate__info {
  display: flex;
  justify-content: space-between;
  gap: toRem(32);
}

.referral-system-rate__info-title {
  font-size: toRem(18);
  color: var(--text-tertiary-main);

  @include respond-to(small) {
    font-size: toRem(14);
  }
}

.referral-system-rate__info-value {
  font-size: toRem(18);
  font-weight: 700;

  @include respond-to(small) {
    font-size: toRem(14);
  }
}

.referral-system-rate__mor-value {
  font-size: toRem(54);
  font-weight: 700;
  line-height: toRem(81);
}

.referral-system-rate__available-to-claim {
  font-size: toRem(17);
}

.referral-system-rate__button {
  width: 100%;
}
</style>
