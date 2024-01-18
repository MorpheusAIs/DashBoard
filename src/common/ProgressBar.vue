<template>
  <div
    class="progress-bar"
    :class="{ 'progress-bar--loading': isLoading }"
    :style="{ '--progress': `${progressPercent}%` }"
  >
    <p class="progress-bar__title">
      {{ title }}
    </p>
    <h4 class="progress-bar__percent">
      {{ `${progressPercent}%` }}
    </h4>
  </div>
</template>

<script lang="ts" setup>
import { type ProgressBarType } from '@/types'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    progress: ProgressBarType.Progress
    isLoading?: boolean
  }>(),
  { isLoading: false },
)

const progressPercent = computed<number>(() =>
  props.progress.value.mul(100).div(props.progress.total).toNumber(),
)
</script>

<style lang="scss" scoped>
$z-index: 1;

.progress-bar {
  position: relative;
  z-index: $z-index;
  aspect-ratio: 1/1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:before {
    $z-index: -1;

    content: '';
    position: absolute;
    z-index: $z-index;
    inset: 0;
    display: block;
    background: conic-gradient(
      #ffffff,
      #fbc969 var(--progress),
      #313a36 var(--progress)
    );
    border-radius: inherit;
  }

  &:after {
    $z-index: -1;

    content: '';
    position: absolute;
    z-index: $z-index;
    inset: toRem(12);
    display: block;
    background: #0d1510;
    border-radius: inherit;

    @include respond-to(medium) {
      background: #12241f;
    }
  }

  &--loading {
    gap: toRem(8);

    @include skeleton;

    border-radius: 50%;
  }
}

.progress-bar__title {
  text-align: center;

  .progress-bar--loading & {
    @include skeleton;
  }

  @include body-3-regular;
}

.progress-bar__percent {
  .progress-bar--loading & {
    height: toRem(34);
    width: 100%;
    max-width: 50%;

    @include skeleton;

    @include respond-to(medium) {
      height: toRem(30);
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(-35deg);
  }

  to {
    transform: rotate(325deg);
  }
}
</style>
