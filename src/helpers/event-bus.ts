import { EventEmitter } from '@distributedlab/tools'

export enum BUS_EVENTS {
  error = 'error',
  warning = 'warning',
  success = 'success',
  info = 'info',
  changedUserBalance = 'changed-user-balance',
  changedPoolData = 'changed-pool-data',
  changedCurrentUserReward = 'changed-current-user-reward',
  changedCurrentUserRefReward = 'changed-current-user-ref-reward',
}

export type DefaultBusEventMap = {
  [BUS_EVENTS.success]: unknown
  [BUS_EVENTS.error]: unknown
  [BUS_EVENTS.warning]: unknown
  [BUS_EVENTS.info]: unknown
  [BUS_EVENTS.changedUserBalance]: unknown
  [BUS_EVENTS.changedPoolData]: unknown
  [BUS_EVENTS.changedCurrentUserReward]: unknown
  [BUS_EVENTS.changedCurrentUserRefReward]: unknown
}

export const bus = new EventEmitter<DefaultBusEventMap>()
