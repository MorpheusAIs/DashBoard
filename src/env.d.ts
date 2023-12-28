/// <reference types="vite/client" />
import { config } from '@config'
import { ICON_NAMES, ROUTE_NAMES } from '@/enums'
import { WritableComputedRef } from 'vue'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $routes: typeof ROUTE_NAMES
    $icons: typeof ICON_NAMES
    $config: typeof config
    $locale: WritableComputedRef
  }
}

interface ImportMetaEnv {
  VITE_ENVIRONMENT: string
  VITE_PORT: string
  VITE_API_URL: string
  VITE_APP_NAME: string
}

declare global {
  interface Document {
    ENV: ImportMetaEnv
  }
}
