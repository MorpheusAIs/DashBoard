import { errors } from '@/errors'
import { bus, BUS_EVENTS } from '@/helpers'
import { i18n } from '@/localization'
import { capitalize } from './text.helpers'
import log from 'loglevel'

export class ErrorHandler {
  static process(error: Error | unknown, errorMessage = ''): void {
    const msgTranslation = errorMessage || ErrorHandler._getErrorMessage(error)
    bus.emit(BUS_EVENTS.error, msgTranslation)

    ErrorHandler.processWithoutFeedback(error)
  }

  static processWithoutFeedback(error: Error | unknown): void {
    log.error(error)
  }

  static _getErrorMessage(error: Error | unknown): string {
    const { t } = i18n.global
    let errorMessage = ''

    if (error instanceof Error) {
      switch (error.constructor) {
        case errors.ProviderChainNotFoundError:
          errorMessage = t('errors.provider-chain-not-found-error')
          break
        case errors.ProviderUserRejectedRequest:
          errorMessage = t('errors.provider-user-rejected-request')
          break
        case errors.ProviderUnauthorized:
          errorMessage = t('errors.provider-unauthorized')
          break
        case errors.ProviderUnsupportedMethod:
          errorMessage = t('errors.provider-unsupported-method')
          break
        case errors.ProviderDisconnected:
          errorMessage = t('errors.provider-disconnected')
          break
        case errors.ProviderChainDisconnected:
          errorMessage = t('errors.provider-chain-disconnected')
          break
        case errors.ProviderParseError:
          errorMessage = t('errors.provider-parse-error')
          break
        case errors.ProviderInvalidRequest:
          errorMessage = t('errors.provider-invalid-request')
          break
        case errors.ProviderMethodNotFound:
          errorMessage = t('errors.provider-method-not-found')
          break
        case errors.ProviderInvalidParams:
          errorMessage = t('errors.provider-invalid-params')
          break
        case errors.ProviderInternalError:
          errorMessage = t('errors.provider-internal-error')
          break
        case errors.ProviderInvalidInput:
          errorMessage = t('errors.provider-invalid-input')
          break
        case errors.ProviderResourceNotFound:
          errorMessage = t('errors.provider-resource-not-found')
          break
        case errors.ProviderResourceUnavailable:
          errorMessage = t('errors.provider-resource-unavailable')
          break
        case errors.ProviderTransactionRejected:
          errorMessage = t('errors.provider-transaction-rejected')
          break
        case errors.ProviderMethodNotSupported:
          errorMessage = t('errors.provider-method-not-supported')
          break
        case errors.ProviderLimitExceeded:
          errorMessage = t('errors.provider-limit-exceeded')
          break
        case errors.ProviderJsonRpcVersionNotSupported:
          errorMessage = t('errors.provider-json-rpc-version-not-supported')
          break
        default: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const reason = (error as any)?.reason

          errorMessage =
            typeof reason === 'string' && reason.length
              ? capitalize(reason)
              : t('errors.default')
        }
      }
    }

    return errorMessage
  }
}
