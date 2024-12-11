export type DelegationUser = {
  address: string
  tokensDelegated: string
  networkFee: string
}

export type DelegationUserCard = {
  title: string
  amount: string
  buttonText?: string
}

export type DelegatesUser = {
  address: string
  tokensDelegated: string
  tokensClaimed: string
}
