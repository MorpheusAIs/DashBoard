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
    $t: (key: string, values?: Record<string, string>) => string
  }
}

interface ImportMetaEnv {
  // Development
  VITE_ENVIRONMENT: string
  VITE_PORT: string

  // General
  VITE_APP_NAME: string
  VITE_APP_DESCRIPTION: string
  VITE_APP_URL: string
  VITE_APP_WALLET_CONNECT_PROJECT_ID: string
}

declare global {
  interface Document {
    ENV: ImportMetaEnv
  }
}
