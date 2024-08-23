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
  // Development
  VITE_ENVIRONMENT: string
  VITE_PORT: string

  // General
  VITE_APP_NAME: string
  VITE_APP_DESCRIPTION: string
  VITE_APP_URL: string
  VITE_APP_MAINNET_GRAPHQL_API_URL: string
  VITE_APP_TESTNET_GRAPHQL_API_URL: string
  VITE_APP_WALLET_CONNECT_PROJECT_ID: string
  VITE_APP_BUILD_VERSION: string

  // Testnet
  VITE_APP_ERC1967_PROXY_TESTNET_CONTRACT_ADDRESS: string
  VITE_APP_STETH_TESTNET_CONTRACT_ADDRESS: string
  VITE_APP_MOR_TESTNET_CONTRACT_ADDRESS: string
  VITE_APP_ENDPOINT_TESTNET_CONTRACT_ADDRESS: string
  VITE_APP_L1_FACTORY_TESTNET_CONTRACT_ADDRESS: string
  VITE_APP_L2_FACTORY_TESTNET_CONTRACT_ADDRESS: string

  // Mainnet
  VITE_APP_ERC1967_PROXY_MAINNET_CONTRACT_ADDRESS: string
  VITE_APP_STETH_MAINNET_CONTRACT_ADDRESS: string
  VITE_APP_MOR_MAINNET_CONTRACT_ADDRESS: string
  VITE_APP_ENDPOINT_MAINNET_CONTRACT_ADDRESS: string
  VITE_APP_L1_FACTORY_MAINNET_CONTRACT_ADDRESS: string
  VITE_APP_L2_FACTORY_MAINNET_CONTRACT_ADDRESS: string
}

declare global {
  interface Document {
    ENV: ImportMetaEnv
  }
}
