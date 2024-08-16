import { CUSTOM_ERRORS } from '@/enums'

export class UnknownCurrencyError extends Error {
  constructor() {
    super()
    this.name = CUSTOM_ERRORS.unknownCurrency
  }
}

export class FieldNotFoundError extends Error {
  constructor() {
    super()
    this.name = CUSTOM_ERRORS.fieldNotFound
  }
}

export class UserAddressError extends Error {
  constructor() {
    super()
    this.name = CUSTOM_ERRORS.userAddress
  }
}

export class FallbackProviderError extends Error {
  constructor() {
    super()
    this.name = CUSTOM_ERRORS.fallbackProvider
  }
}

export class PoolDataNotFoundError extends Error {
  constructor() {
    super()
    this.name = CUSTOM_ERRORS.poolDataNotFound
  }
}
