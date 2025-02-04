import { EthereumChains } from '@config'
import { BuilderProjectFragment } from '@/types/graphql'

export type BuilderProject = { chain?: EthereumChains } & BuilderProjectFragment
