<template>
  <div class="ref-rates-slider">
    <div class="ref-rates-slider__head">
      <h4 class="ref-rates-slider__title">
        {{ $t('ref-rates-slider.title') }}
      </h4>
      <div class="ref-rates-slider__head-buttons">
        <app-button
          class="ref-rates-slider__head-button"
          size="none"
          color="secondary"
          :icon-left="$icons.arrowLeft"
          @click="decreaseStep"
        />
        <app-button
          class="ref-rates-slider__head-button"
          size="none"
          color="secondary"
          :icon-left="$icons.arrowLeft"
          @click="increaseStep"
        />
      </div>
    </div>
    <div class="ref-rates-slider__card-wrp">
      <transition name="fade" mode="out-in">
        <referral-info-card
          class="ref-rates-slider__card"
          :key="currentStep"
          :from-deposited="currentHumanizedTier?.fromDeposited"
          :to-deposited="currentHumanizedTier?.toDeposited"
          :percent="currentHumanizedTier?.percent"
          :tier-number="currentHumanizedTier?.tierNumber"
        />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { AppButton } from '@/common'
import { useReferralInfo } from '@/composables'
import { ethers } from 'ethers'
import ReferralInfoCard from './ReferralInfoCard.vue'

type HumanizedTier = {
  tierNumber: number
  fromDeposited: number
  toDeposited: number
  percent: string
}

const STEPS = [0, 1, 2, 3]

const PERCENTS_DECIMALS = 23

const props = defineProps<{
  poolId: number
}>()

// TODO: REFACTOR REPEATED TIERS LOGIC

const { tiers } = useReferralInfo(props.poolId)

const currentStep = ref(STEPS[0])

const decreaseStep = () => {
  if (currentStep.value === STEPS[0]) {
    currentStep.value = STEPS[STEPS.length - 1]
    return
  }
  currentStep.value -= 1
}

const increaseStep = () => {
  if (currentStep.value === STEPS[STEPS.length - 1]) {
    currentStep.value = STEPS[0]
    return
  }
  currentStep.value += 1
}

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

const currentHumanizedTier = computed(
  () => humanizedTiers.value[currentStep.value],
)
</script>

<style scoped lang="scss">
.ref-rates-slider__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ref-rates-slider__head-buttons {
  display: flex;
  gap: toRem(12);
}

.ref-rates-slider__head-button {
  width: toRem(40);
  height: toRem(40);

  &:last-child {
    transform: rotate(180deg);
  }
}

.ref-rates-slider__card-wrp {
  margin-top: toRem(16);
}

.ref-rates-slider__card {
  width: 100%;
}
</style>
