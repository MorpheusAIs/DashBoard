import packageJson from '../package.json'
import { LogLevelDesc } from 'loglevel'
import pickBy from 'lodash/pickBy'
import mapKeys from 'lodash/mapKeys'

export const config = {
  API_URL: import.meta.env.VITE_API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_BUILD_VERSION,
} as const

Object.assign(config, _mapEnvCfg(import.meta.env))
Object.assign(config, _mapEnvCfg(document.ENV))

function _mapEnvCfg(env: ImportMetaEnv | typeof document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_')),
    (v, k) => k.replace(/^VITE_/, ''),
  )
}
