import { useI18n } from 'vue-i18n'
import { ICON_NAMES } from '@/enums'
import isObject from 'lodash/isObject'
import { TYPE, useToast } from 'vue-toastification'

import { DefaultToast } from '@/common'
import { CommonNotificationTypes, NotificationObjectPayload } from '@/types'

const MINUTE = 60 * 1000

export const useNotifications = () => {
  const toast = useToast()

  const { t } = useI18n({ useScope: 'global' })

  const defaultTitles = {
    [TYPE.SUCCESS]: t('notification.default-title-success'),
    [TYPE.ERROR]: t('notification.default-title-error'),
    [TYPE.WARNING]: t('notification.default-title-warning'),
    [TYPE.INFO]: t('notification.default-title-info'),
    [TYPE.DEFAULT]: t('notification.default-title-default'),
  }
  const defaultMessages = {
    [TYPE.DEFAULT]: t('notification.default-message-default'),
    [TYPE.INFO]: t('notification.default-message-info'),
    [TYPE.SUCCESS]: t('notification.default-message-success'),
    [TYPE.ERROR]: t('notification.default-message-error'),
    [TYPE.WARNING]: t('notification.default-message-warning'),
  }
  const defaultIconNames = {
    [TYPE.DEFAULT]: ICON_NAMES.exclamationCircle,
    [TYPE.INFO]: ICON_NAMES.exclamationCircle,
    [TYPE.SUCCESS]: ICON_NAMES.checkCircle,
    [TYPE.ERROR]: ICON_NAMES.xCircle,
    [TYPE.WARNING]: ICON_NAMES.shieldExclamation,
  }

  const showToast = (
    messageType = 'default' as CommonNotificationTypes,
    payload?: string | NotificationObjectPayload,
  ) => {
    let title = ''
    let message = ''
    let iconName: ICON_NAMES | undefined

    if (isObject(payload)) {
      const msgPayload = payload as NotificationObjectPayload

      title = msgPayload.title || ''
      message = msgPayload.message
      iconName = msgPayload.iconName
    } else if (payload) {
      message = payload as string
    } else {
      message = defaultMessages[messageType]
    }

    if (!title) {
      title = defaultTitles[messageType]
    }
    if (!iconName) {
      iconName = defaultIconNames[messageType]
    }

    return toast(
      {
        component: DefaultToast,
        props: {
          ...(title && { title }),
          message,
          ...(iconName && { iconName }),
        },
      },
      {
        icon: false,
        type: {
          default: TYPE.DEFAULT,
          info: TYPE.INFO,
          success: TYPE.SUCCESS,
          error: TYPE.ERROR,
          warning: TYPE.WARNING,
        }[messageType],
        toastClassName: 'default-toast',
        timeout: MINUTE / 2,
        closeOnClick: false,
      },
    )
  }

  const removeToast = (id: string | number) => toast.dismiss(id)

  return { showToast, removeToast }
}

export * from 'vue-toastification'
