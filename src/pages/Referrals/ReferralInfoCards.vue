<template>
  <div class="referral-info-cars">
    <referral-info-card
      v-for="tier in humanizedTiers"
      :key="tier.percent"
      :from-deposited="tier.fromDeposited"
      :to-deposited="tier.toDeposited"
      :percent="tier.percent"
      :tier-number="tier.tierNumber"
    />
  </div>
</template>

<script setup lang="ts">
import ReferralInfoCard from './ReferralInfoCard.vue'
import { useReferralInfo } from '@/composables'
import { computed } from 'vue'
import { ethers } from 'ethers'

type HumanizedTier = {
  tierNumber: number
  fromDeposited: number
  toDeposited: number
  percent: string
}

const PERCENTS_DECIMALS = 23

const props = defineProps<{
  poolId: number
}>()

// TODO: REFACTOR REPEATED TIERS LOGIC

const { tiers } = useReferralInfo(props.poolId)

const humanizedTiers = computed(() => {
  return tiers.value.reduce((acc, tier, index) => {
    const amountInEth = parseFloat(ethers.utils.formatUnits(tier.amount))
    const percent = ethers.utils.formatUnits(tier.multiplier, PERCENTS_DECIMALS)

    const toDeposited =
      index < tiers.value.length - 1
        ? parseFloat(
            ethers.utils.formatUnits(tiers.value[index + 1].amount, 18),
          )
        : 0

    acc.push({
      tierNumber: index,
      fromDeposited: amountInEth,
      toDeposited,
      percent,
    })

    return acc
  }, [] as HumanizedTier[])
})
</script>

<style scoped lang="scss">
.referral-info-cars {
  display: flex;
  gap: toRem(20);
  justify-content: center;

  @include respond-to(xmedium) {
    display: grid;
    max-width: fit-content;
    margin: 0 auto;
    grid-template-columns: repeat(2, 1fr);
    flex-direction: column;
  }

  @include respond-to(tablet) {
    display: flex;
    flex-direction: column;
  }
}
</style>
