<template>
  <!-- Featurebase widget will be injected by the SDK -->
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

type FeaturebaseConfig = {
  organization: string
  theme: 'light' | 'dark'
  placement: 'right' | 'left'
  locale: string
  metadata?: Record<string, string>
}

type FeaturebaseFunction = {
  (command: 'initialize_feedback_widget', config: FeaturebaseConfig): void
  (command: string, ...args: unknown[]): void
}

declare global {
  interface Window {
    Featurebase?: FeaturebaseFunction & {
      q?: Array<[string, ...unknown[]]>
    }
  }
}

onMounted(() => {
  // Initialize Featurebase SDK
  ;(function (e: typeof window, t: Document) {
    const a = 'featurebase-sdk'
    function n() {
      if (!t.getElementById(a)) {
        const script = t.createElement('script')
        script.id = a
        script.src = 'https://do.featurebase.app/js/sdk.js'
        const firstScript = t.getElementsByTagName('script')[0]
        firstScript?.parentNode?.insertBefore(script, firstScript)
      }
    }
    if (typeof e.Featurebase !== 'function') {
      e.Featurebase = function (...args) {
        ;(e.Featurebase!.q = e.Featurebase!.q || []).push(args)
      }
    }
    if (t.readyState === 'complete' || t.readyState === 'interactive') {
      n()
    } else {
      t.addEventListener('DOMContentLoaded', n)
    }
  })(window, document)

  // Initialize the feedback widget
  window.Featurebase?.('initialize_feedback_widget', {
    organization: import.meta.env.VITE_FEATUREBASE_ORG_ID || 'morpheus',
    theme: 'light',
    placement: 'right',
    locale: 'en',
    metadata: {
      appVersion: import.meta.env.VITE_APP_VERSION,
      environment: import.meta.env.MODE,
    },
  })
})
</script>

<style scoped>
/* The widget is injected into the DOM automatically */
</style>
