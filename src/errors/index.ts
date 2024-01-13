import { errors as errorsOfW3P } from '@distributedlab/w3p'
import * as runtimeErrors from './runtime.errors'

export const errors = {
  ...runtimeErrors,
  ...errorsOfW3P,
}
