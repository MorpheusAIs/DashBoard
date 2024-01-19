import { EventEmitter } from '@distributedlab/tools'

export enum BUS_EVENTS {
  error = 'error',
  warning = 'warning',
  success = 'success',
  info = 'info',
  updatedUserAllowance = 'updated-user-allowance',
  updatedUserDeposit = 'updated-user-deposit',
}

export type DefaultBusEventMap = {
  [BUS_EVENTS.success]: unknown
  [BUS_EVENTS.error]: unknown
  [BUS_EVENTS.warning]: unknown
  [BUS_EVENTS.info]: unknown
  [BUS_EVENTS.updatedUserAllowance]: unknown
  [BUS_EVENTS.updatedUserDeposit]: unknown
}

export const bus = new EventEmitter<DefaultBusEventMap>()
