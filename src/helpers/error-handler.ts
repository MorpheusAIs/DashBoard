import log from 'loglevel'
import { bus, BUS_EVENTS } from '@/helpers'
import { i18n } from '@/localization'

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
    let errorMessage = ''

    if (error instanceof Error)
      switch (error.constructor) {
        default: {
          errorMessage = i18n.global.t('errors.default')
        }
      }

    return errorMessage
  }
}
