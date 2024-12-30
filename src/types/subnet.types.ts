export type SubnetCounter = {
  totalSubnets: string
}

export type UsersCounter = {
  totalUsers: string
}

export type SubnetItem = {
  id: string
  fee: string
  name: string
  owner: string
  totalClaimed: string
  totalStaked: string
  totalUsers: string
}

export type SubnetProvider = {
  staked: string
  claimed: string
  address: string
}

export type SubnetProviderWithSubnet = SubnetProvider & {
  subnet: SubnetItem
}

export type DelegationUserCard = {
  title: string
  amount: string
  buttonText?: string
}
