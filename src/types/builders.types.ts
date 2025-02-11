import { EthereumChains } from '@config'
import { BuilderSubnetDefaultFragment } from '@/types/graphql'

export type BuilderProject = {
  chain?: EthereumChains
} & BuilderSubnetDefaultFragment
