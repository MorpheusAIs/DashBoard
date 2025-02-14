import { EventEmitter } from '@distributedlab/tools'
import { EthereumChains } from '@config'

export enum BUS_EVENTS {
  error = 'error',
  warning = 'warning',
  success = 'success',
  info = 'info',
  changedUserBalance = 'changed-user-balance',
  changedPoolData = 'changed-pool-data',
  changedCurrentUserReward = 'changed-current-user-reward',
  changedCurrentUserRefReward = 'changed-current-user-ref-reward',
  changedDelegation = 'changed-delegation',
  navbarChainSwitched = 'navbar-chain-switched',
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
  [BUS_EVENTS.changedDelegation]: unknown
  [BUS_EVENTS.navbarChainSwitched]: EthereumChains
}

export const bus = new EventEmitter<DefaultBusEventMap>()
