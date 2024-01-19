import { EventEmitter } from '@distributedlab/tools'

export enum BUS_EVENTS {
  error = 'error',
  warning = 'warning',
  success = 'success',
  info = 'info',
  changedUserBalance = 'changed-user-balance',
  changedPoolUserData = 'changed-pool-user-data',
}

export type DefaultBusEventMap = {
  [BUS_EVENTS.success]: unknown
  [BUS_EVENTS.error]: unknown
  [BUS_EVENTS.warning]: unknown
  [BUS_EVENTS.info]: unknown
  [BUS_EVENTS.changedUserBalance]: unknown
  [BUS_EVENTS.changedPoolUserData]: unknown
}

export const bus = new EventEmitter<DefaultBusEventMap>()
