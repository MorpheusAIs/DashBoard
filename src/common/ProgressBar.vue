<template>
  <div class="progress-bar" :style="{ '--progress': `${progressPercent}%` }">
    <p class="progress-bar__title">
      {{ title }}
    </p>
    <h4>{{ `${progressPercent}%` }}</h4>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  title: string
  progress: number
  total: number
}>()

const progressPercent = computed<number>(() =>
  Number(((props.progress / props.total) * 100).toFixed(2)),
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
}

.progress-bar__title {
  text-align: center;

  @include body-3-regular;
}
</style>
