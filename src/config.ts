import packageJson from '../package.json'
import { LogLevelDesc } from 'loglevel'
import pickBy from 'lodash/pickBy'
import mapKeys from 'lodash/mapKeys'

export const config = {
  // General
  NAME: import.meta.env.VITE_APP_NAME,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,
  LOG_LEVEL: 'trace' as LogLevelDesc,

  // Testnet
  ERC1967_PROXY_TESTNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_ERC1967_PROXY_TESTNET_CONTRACT_ADDRESS,
  STETH_TESTNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_STETH_TESTNET_CONTRACT_ADDRESS,
  MOR_TESTNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_MOR_TESTNET_CONTRACT_ADDRESS,
  ENDPOINT_TESTNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_ENDPOINT_TESTNET_CONTRACT_ADDRESS,

  // Mainnet
  ERC1967_PROXY_MAINNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_ERC1967_PROXY_MAINNET_CONTRACT_ADDRESS,
  STETH_MAINNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_STETH_MAINNET_CONTRACT_ADDRESS,
  MOR_MAINNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_MOR_MAINNET_CONTRACT_ADDRESS,
  ENDPOINT_MAINNET_CONTRACT_ADDRESS: import.meta.env
    .VITE_APP_ENDPOINT_MAINNET_CONTRACT_ADDRESS,
} as const

Object.assign(config, _mapEnvCfg(import.meta.env))
Object.assign(config, _mapEnvCfg(document.ENV))

function _mapEnvCfg(env: ImportMetaEnv | typeof document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
    (v, k) => k.replace(/^VITE_APP_/, ''),
  )
}
