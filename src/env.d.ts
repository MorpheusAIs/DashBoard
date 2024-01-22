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
  VITE_APP_ERC1967_PROXY_CONTRACT_ADDRESS: string
  VITE_APP_STETH_CONTRACT_ADDRESS: string
  VITE_APP_MOR_CONTRACT_ADDRESS: string
  VITE_APP_IS_MAINNET: string
}

declare global {
  interface Document {
    ENV: ImportMetaEnv
  }
}
