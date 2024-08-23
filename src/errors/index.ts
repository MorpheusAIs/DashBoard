import * as runtimeErrors from './runtime.errors'
import * as customErrors from './custom.errors'

export const errors = {
  ...runtimeErrors,
  ...customErrors,
}
