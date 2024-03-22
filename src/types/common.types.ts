import type { ICON_NAMES } from '@/enums'
import type { RouteLocationRaw } from 'vue-router'
import type { providers } from 'ethers'

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

export type FieldOption<T = unknown> = {
  value: T
  title: string
}

export type Tab = {
  title: string
  id: string
  route?: RouteLocationRaw
  href?: string
}

export type Provider =
  | providers.Web3Provider
  | providers.StaticJsonRpcProvider
  | providers.FallbackProvider
