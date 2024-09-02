<template>
  <ol class="step-tabs">
    <li
      v-for="(step, idx) in steps"
      :key="step.id"
      :class="{
        'step-tabs__step--current': currentStep.id === step.id,
        'step-tabs__step--submitted': step.isSubmitted,
      }"
      class="step-tabs__step"
    >
      <transition name="fade" mode="out-in">
        <template v-if="step.isSubmitted">
          <app-icon class="step-tabs__step-icon" :name="$icons.checkCircle" />
        </template>
        <template v-else>
          <span class="step-tabs__step-order"> {{ `${idx + 1}.` }}</span>
        </template>
      </transition>
      {{ step.title }}
    </li>
  </ol>
</template>

<script lang="ts" setup>
import { AppIcon } from '@/common'
import { type Step } from '../types'

defineProps<{
  currentStep: Step
  steps: Step[]
}>()
</script>

<style lang="scss" scoped>
.step-tabs {
  display: flex;
  align-items: center;
  gap: toRem(12);

  @include respond-to(tablet) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(xsmall) {
    grid-template-columns: unset;
  }
}

.step-tabs__step {
  $color: #cccccc;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(6);
  color: $color;
  width: 100%;
  height: toRem(46);
  max-width: toRem(274);
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    95.36deg,
    rgba(var(--white-rgb), 0.48) 0%,
    rgba(var(--white-rgb), 0.08) 100%
  );
  transition: calc(var(--transition-duration-fast) * 2)
    var(--transition-timing-default);
  transition-property: opacity, color;

  &--current {
    color: var(--primary-main);
    border-image-source: var(--primary-main);
  }

  &--submitted {
    color: var(--primary-main);
    border-image-source: var(--primary-main);

    &:not(.step-tabs__step--current) {
      opacity: 0.4;
    }
  }

  @include body-3-medium;

  @include respond-to(medium) {
    max-width: unset;
  }

  @include respond-to(tablet) {
    &:nth-child(3) {
      grid-column: 1/3;
    }
  }

  @include respond-to(xsmall) {
    &:nth-child(3) {
      grid-column: unset;
    }
  }
}

.step-tabs__step-order {
  font: inherit;
  color: inherit;
}

.step-tabs__step-icon {
  height: toRem(20);
  width: toRem(20);
}
</style>
