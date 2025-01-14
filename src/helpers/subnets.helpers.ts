import { config, NETWORK_IDS } from '@config'
import {
  SubnetItem,
  SubnetProvider,
  SubnetProviderWithSubnet,
  SubnetCounter,
  UsersCounter,
} from '@/types'
import { gql } from '@apollo/client'
import { DELEGATES_SORTING_TYPES, SORTING_ORDER } from '@/enums'

interface Sorting {
  order?: SORTING_ORDER
  type?: DELEGATES_SORTING_TYPES
  skip?: number
  first?: number
}

export function trimStringNumber(str: string, maxDecimals = 2) {
  const [integer, decimal] = str.split('.')
  let result = integer

  if (decimal) {
    result += `.${decimal.slice(0, maxDecimals)}`

    while (result[result.length - 1] === '0')
      result = result.slice(0, result.length - 1)

    if (result[result.length - 1] === '.') result = integer
  }

  return result
}

export async function fetchSubnets(
  type: NETWORK_IDS,
  address: string,
  sorting?: Sorting,
) {
  const apolloClient =
    type === NETWORK_IDS.mainnet
      ? config.secondMainnetApolloClient
      : config.secondTestnetApolloClient

  const query = gql`
    ${_generateSubnetsQuery(address, sorting)}
  `

  const { data } = await apolloClient.query<{
    subnets: SubnetItem[]
    counters: SubnetCounter[]
  }>({
    query,
    variables: {},
  })

  return data
}

export async function fetchOwnSubnets(
  type: NETWORK_IDS,
  address: string,
  sorting?: Sorting,
) {
  const apolloClient =
    type === NETWORK_IDS.mainnet
      ? config.secondMainnetApolloClient
      : config.secondTestnetApolloClient

  const query = gql`
    ${_generateOwnSubnetsQuery(address, sorting)}
  `

  const { data } = await apolloClient.query<{
    subnets: SubnetItem[]
    subnetUsers: SubnetProviderWithSubnet[]
  }>({
    query,
    variables: {},
  })

  return data
}

export async function fetchProviders(
  type: NETWORK_IDS,
  subnetId: string,
  sorting?: Sorting,
) {
  const apolloClient =
    type === NETWORK_IDS.mainnet
      ? config.secondMainnetApolloClient
      : config.secondTestnetApolloClient

  const query = gql`
    ${_generateProvidersQuery(subnetId, sorting)}
  `

  const { data } = await apolloClient.query<{
    subnetUsers: SubnetProvider[]
    subnets: UsersCounter[]
  }>({
    query,
    variables: {},
  })

  return data
}

export async function fetchSubnet(type: NETWORK_IDS, subnetId: string) {
  const apolloClient =
    type === NETWORK_IDS.mainnet
      ? config.secondMainnetApolloClient
      : config.secondTestnetApolloClient

  const query = gql`
    ${_generateSubnetQuery(subnetId)}
  `

  const { data } = await apolloClient.query<{
    subnets: SubnetItem[]
  }>({
    query,
    variables: {},
  })

  return data
}

export function _generateOwnSubnetsQuery(
  address: string,
  sorting?: Sorting,
): string {
  const sortingSubnetsString = sorting?.order
    ? `, orderBy: ${sorting?.type}, orderDirection: ${sorting?.order}`
    : ''

  const sortingUsersString = sorting?.order
    ? `, orderBy: subnet__${sorting?.type}, orderDirection: ${sorting?.order}`
    : ''

  const paginationString =
    sorting?.skip && sorting?.first
      ? `, skip: ${sorting?.skip}, first: ${sorting?.first}`
      : ''

  return `
    query GetSubnets {
      subnets(where: {owner: "${address}"}${sortingSubnetsString}${paginationString}) {
        id
        fee
        name
        owner
        totalClaimed
        totalStaked
        deregistrationOpensAt
      }
      subnetUsers(where: {address: "${address}"}${sortingUsersString}${paginationString}) {
        staked
        claimed
        address
        subnet {
          id
          fee
          name
          owner
          totalClaimed
          totalStaked
        }
      }
    }
  `
}

export function _generateSubnetsQuery(
  address: string,
  sorting?: Sorting,
): string {
  const sortingString = sorting?.order
    ? `, orderBy: ${sorting?.type}, orderDirection: ${sorting?.order}`
    : ''

  const paginationString =
    sorting?.skip !== undefined && sorting?.first !== undefined
      ? `, skip: ${sorting?.skip}, first: ${sorting?.first}`
      : ''

  return `
    query GetSubnets {
      subnets(where: {owner_not: "${address}"}${sortingString}${paginationString}) {
        id
        fee
        name
        owner
        totalStaked
        totalClaimed
        deregistrationOpensAt
      }
      counters {
        id
        totalSubnets
      }
    }
  `
}

export function _generateProvidersQuery(
  subnetId: string,
  sorting?: Sorting,
): string {
  const sortingString = sorting?.order
    ? `, orderBy: ${sorting?.type}, orderDirection: ${sorting?.order}`
    : ''

  const paginationString =
    sorting?.skip && sorting?.first
      ? `, skip: ${sorting?.skip}, first: ${sorting?.first}`
      : ''

  return `
    query GetProviders {
      subnetUsers(where: {subnet_: {id: "${subnetId}"}}${sortingString}${paginationString}) {
        id
        staked
        claimed
        address
      }
      subnets(where: {id: "${subnetId}"}) {
        fee
        totalUsers
        deregistrationOpensAt
      }
    }
  `
}

export function _generateSubnetQuery(subnetId: string): string {
  return `
    query GetSubnet {
      subnets(where: {id: "${subnetId}"}) {
        id
        fee
        name
        owner
        totalStaked
        totalClaimed
        deregistrationOpensAt
      }
    }
  `
}
