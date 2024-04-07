<template>
  <div class="app-chart" :class="{ 'app-chart--loading': isLoading }">
    <canvas ref="canvasElement" class="app-chart__canvas" />
  </div>
</template>

<script lang="ts" setup>
import { ErrorHandler } from '@/helpers'
import { ChartConfig } from '@/types'
import Chart from 'chart.js/auto'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    config: ChartConfig
    isLoading?: boolean
  }>(),
  {
    isLoading: false,
  },
)

let _chart: Chart | null = null

const canvasElement = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!canvasElement.value) return
  _chart = new Chart(canvasElement.value, props.config)
})

onBeforeUnmount(() => {
  _chart?.destroy()
})

watch(
  () => props.config,
  () => {
    if (!_chart) return

    try {
      _chart.update()
    } catch (error) {
      ErrorHandler.process(error)
    }
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.app-chart {
  &--loading {
    @include skeleton;

    border-radius: 0;
  }
}

.app-chart__canvas {
  max-width: 100%;
}
</style>
