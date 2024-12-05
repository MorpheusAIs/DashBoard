import { DELEGATION_RIGHTS } from '@/enums'

export type DelegationUser = {
  address: string
  tokensStaked: string
}

export type DelegationUserCard = {
  title: string
  amount: string
  buttonText?: string
}

export type DelegatesUser = {
  address: string
  tokensStaked: string
  tokensDelegated: string
  delegationRights: DELEGATION_RIGHTS
}
