<template>
  <ol class="step-tabs">
    <li
      v-for="(stepTab, idx) in stepTabs"
      :key="stepTab.id"
      :class="{
        'step-tabs__step--current': currentStepTab.id === stepTab.id,
        'step-tabs__step--passed': idx < currentStepTabIdx,
      }"
      class="step-tabs__step"
    >
      <transition name="fade" mode="out-in">
        <template v-if="idx < currentStepTabIdx">
          <app-icon class="step-tabs__step-icon" :name="$icons.checkCircle" />
        </template>
        <template v-else>
          <span class="step-tabs__step-order"> {{ `${idx + 1}.` }}</span>
        </template>
      </transition>
      {{ stepTab.title }}
    </li>
  </ol>
</template>

<script lang="ts" setup>
import { AppIcon } from '@/common'
import { computed } from 'vue'
import { type StepTab } from '../types'

const props = defineProps<{
  currentStepTab: StepTab
  stepTabs: StepTab[]
}>()

const currentStepTabIdx = computed<number>(() =>
  props.stepTabs.findIndex(step => step.id === props.currentStepTab.id),
)
</script>

<style lang="scss" scoped>
.step-tabs {
  display: flex;
  align-items: center;
  gap: toRem(12);
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
    rgba(255, 255, 255, 0.48) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
  transition: calc(var(--transition-duration-fast) * 2)
    var(--transition-timing-default);
  transition-property: opacity, color;

  &--current {
    color: var(--primary-main);
    border-image-source: var(--primary-main);
  }

  &--passed {
    color: var(--primary-main);
    border-image-source: var(--primary-main);
    opacity: 0.4;
  }

  @include body-3-medium;
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
