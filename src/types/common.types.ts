import type { ICON_NAMES } from '@/enums'
import { RouteLocationRaw } from 'vue-router'

export type CommonNotificationTypes =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'default'

export type NotificationObjectPayload = {
  title?: string
  message: string
  iconName?: ICON_NAMES // FIXME
}

export type NotificationPayload = string | NotificationObjectPayload

export type FieldOption = {
  value: string | number
  title: string
}

export type Tab = {
  title: string
  id: string
  route?: RouteLocationRaw
}
