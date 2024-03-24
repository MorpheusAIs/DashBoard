<template>
  <canvas ref="canvasElement" class="app-chart" />
</template>

<script lang="ts" setup>
import { ChartConfig } from '@/types'
import Chart from 'chart.js/auto'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  config: ChartConfig
}>()

let _chart: Chart | null = null

const canvasElement = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!canvasElement.value) return
  _chart = new Chart(canvasElement.value, props.config)
})

onBeforeUnmount(() => {
  _chart?.destroy()
})
</script>

<style lang="scss" scoped>
.app-chart {
  max-width: 100%;
}
</style>
