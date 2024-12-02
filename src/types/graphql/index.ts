import gql from 'graphql-tag'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  BigDecimal: { input: any; output: any }
  BigInt: { input: any; output: any }
  Bytes: { input: any; output: any }
  Int8: { input: any; output: any }
  Timestamp: { input: any; output: any }
}

export type AdminChanged = {
  __typename?: 'AdminChanged'
  blockNumber: Scalars['BigInt']['output']
  blockTimestamp: Scalars['BigInt']['output']
  id: Scalars['Bytes']['output']
  newAdmin: Scalars['Bytes']['output']
  previousAdmin: Scalars['Bytes']['output']
  transactionHash: Scalars['Bytes']['output']
}

export type AdminChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<AdminChanged_Filter>>>
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  newAdmin?: InputMaybe<Scalars['Bytes']['input']>
  newAdmin_contains?: InputMaybe<Scalars['Bytes']['input']>
  newAdmin_gt?: InputMaybe<Scalars['Bytes']['input']>
  newAdmin_gte?: InputMaybe<Scalars['Bytes']['input']>
  newAdmin_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  newAdmin_lt?: InputMaybe<Scalars['Bytes']['input']>
  newAdmin_lte?: InputMaybe<Scalars['Bytes']['input']>
  newAdmin_not?: InputMaybe<Scalars['Bytes']['input']>
  newAdmin_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  newAdmin_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<AdminChanged_Filter>>>
  previousAdmin?: InputMaybe<Scalars['Bytes']['input']>
  previousAdmin_contains?: InputMaybe<Scalars['Bytes']['input']>
  previousAdmin_gt?: InputMaybe<Scalars['Bytes']['input']>
  previousAdmin_gte?: InputMaybe<Scalars['Bytes']['input']>
  previousAdmin_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  previousAdmin_lt?: InputMaybe<Scalars['Bytes']['input']>
  previousAdmin_lte?: InputMaybe<Scalars['Bytes']['input']>
  previousAdmin_not?: InputMaybe<Scalars['Bytes']['input']>
  previousAdmin_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  previousAdmin_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
}

export enum AdminChanged_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  NewAdmin = 'newAdmin',
  PreviousAdmin = 'previousAdmin',
  TransactionHash = 'transactionHash',
}

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour',
}

export type BeaconUpgraded = {
  __typename?: 'BeaconUpgraded'
  beacon: Scalars['Bytes']['output']
  blockNumber: Scalars['BigInt']['output']
  blockTimestamp: Scalars['BigInt']['output']
  id: Scalars['Bytes']['output']
  transactionHash: Scalars['Bytes']['output']
}

export type BeaconUpgraded_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<BeaconUpgraded_Filter>>>
  beacon?: InputMaybe<Scalars['Bytes']['input']>
  beacon_contains?: InputMaybe<Scalars['Bytes']['input']>
  beacon_gt?: InputMaybe<Scalars['Bytes']['input']>
  beacon_gte?: InputMaybe<Scalars['Bytes']['input']>
  beacon_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  beacon_lt?: InputMaybe<Scalars['Bytes']['input']>
  beacon_lte?: InputMaybe<Scalars['Bytes']['input']>
  beacon_not?: InputMaybe<Scalars['Bytes']['input']>
  beacon_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  beacon_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<BeaconUpgraded_Filter>>>
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
}

export enum BeaconUpgraded_OrderBy {
  Beacon = 'beacon',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  TransactionHash = 'transactionHash',
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input']
}

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>
  number?: InputMaybe<Scalars['Int']['input']>
  number_gte?: InputMaybe<Scalars['Int']['input']>
}

export type Initialized = {
  __typename?: 'Initialized'
  blockNumber: Scalars['BigInt']['output']
  blockTimestamp: Scalars['BigInt']['output']
  id: Scalars['Bytes']['output']
  transactionHash: Scalars['Bytes']['output']
  version: Scalars['Int']['output']
}

export type Initialized_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<Initialized_Filter>>>
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<Initialized_Filter>>>
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  version?: InputMaybe<Scalars['Int']['input']>
  version_gt?: InputMaybe<Scalars['Int']['input']>
  version_gte?: InputMaybe<Scalars['Int']['input']>
  version_in?: InputMaybe<Array<Scalars['Int']['input']>>
  version_lt?: InputMaybe<Scalars['Int']['input']>
  version_lte?: InputMaybe<Scalars['Int']['input']>
  version_not?: InputMaybe<Scalars['Int']['input']>
  version_not_in?: InputMaybe<Array<Scalars['Int']['input']>>
}

export enum Initialized_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  TransactionHash = 'transactionHash',
  Version = 'version',
}

/**
 * The entity counts interactions in single tx
 *
 */
export type InteractionCount = {
  __typename?: 'InteractionCount'
  /** The counter of interactions in single tx */
  count: Scalars['BigInt']['output']
  /** The tx hash */
  id: Scalars['Bytes']['output']
}

export type InteractionCount_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<InteractionCount_Filter>>>
  count?: InputMaybe<Scalars['BigInt']['input']>
  count_gt?: InputMaybe<Scalars['BigInt']['input']>
  count_gte?: InputMaybe<Scalars['BigInt']['input']>
  count_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  count_lt?: InputMaybe<Scalars['BigInt']['input']>
  count_lte?: InputMaybe<Scalars['BigInt']['input']>
  count_not?: InputMaybe<Scalars['BigInt']['input']>
  count_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<InteractionCount_Filter>>>
}

export enum InteractionCount_OrderBy {
  Count = 'count',
  Id = 'id',
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type OverplusBridged = {
  __typename?: 'OverplusBridged'
  amount: Scalars['BigInt']['output']
  blockNumber: Scalars['BigInt']['output']
  blockTimestamp: Scalars['BigInt']['output']
  id: Scalars['Bytes']['output']
  transactionHash: Scalars['Bytes']['output']
  uniqueId: Scalars['Bytes']['output']
}

export type OverplusBridged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  amount?: InputMaybe<Scalars['BigInt']['input']>
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>
  amount_not?: InputMaybe<Scalars['BigInt']['input']>
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  and?: InputMaybe<Array<InputMaybe<OverplusBridged_Filter>>>
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<OverplusBridged_Filter>>>
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  uniqueId?: InputMaybe<Scalars['Bytes']['input']>
  uniqueId_contains?: InputMaybe<Scalars['Bytes']['input']>
  uniqueId_gt?: InputMaybe<Scalars['Bytes']['input']>
  uniqueId_gte?: InputMaybe<Scalars['Bytes']['input']>
  uniqueId_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  uniqueId_lt?: InputMaybe<Scalars['Bytes']['input']>
  uniqueId_lte?: InputMaybe<Scalars['Bytes']['input']>
  uniqueId_not?: InputMaybe<Scalars['Bytes']['input']>
  uniqueId_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  uniqueId_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
}

export enum OverplusBridged_OrderBy {
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  TransactionHash = 'transactionHash',
  UniqueId = 'uniqueId',
}

export type OwnershipTransferred = {
  __typename?: 'OwnershipTransferred'
  blockNumber: Scalars['BigInt']['output']
  blockTimestamp: Scalars['BigInt']['output']
  id: Scalars['Bytes']['output']
  newOwner: Scalars['Bytes']['output']
  previousOwner: Scalars['Bytes']['output']
  transactionHash: Scalars['Bytes']['output']
}

export type OwnershipTransferred_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<OwnershipTransferred_Filter>>>
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  newOwner?: InputMaybe<Scalars['Bytes']['input']>
  newOwner_contains?: InputMaybe<Scalars['Bytes']['input']>
  newOwner_gt?: InputMaybe<Scalars['Bytes']['input']>
  newOwner_gte?: InputMaybe<Scalars['Bytes']['input']>
  newOwner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  newOwner_lt?: InputMaybe<Scalars['Bytes']['input']>
  newOwner_lte?: InputMaybe<Scalars['Bytes']['input']>
  newOwner_not?: InputMaybe<Scalars['Bytes']['input']>
  newOwner_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  newOwner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<OwnershipTransferred_Filter>>>
  previousOwner?: InputMaybe<Scalars['Bytes']['input']>
  previousOwner_contains?: InputMaybe<Scalars['Bytes']['input']>
  previousOwner_gt?: InputMaybe<Scalars['Bytes']['input']>
  previousOwner_gte?: InputMaybe<Scalars['Bytes']['input']>
  previousOwner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  previousOwner_lt?: InputMaybe<Scalars['Bytes']['input']>
  previousOwner_lte?: InputMaybe<Scalars['Bytes']['input']>
  previousOwner_not?: InputMaybe<Scalars['Bytes']['input']>
  previousOwner_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  previousOwner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
}

export enum OwnershipTransferred_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  NewOwner = 'newOwner',
  PreviousOwner = 'previousOwner',
  TransactionHash = 'transactionHash',
}

export type Pool = {
  __typename?: 'Pool'
  claimLockPeriod: Scalars['BigInt']['output']
  decreaseInterval: Scalars['BigInt']['output']
  id: Scalars['Bytes']['output']
  initialReward: Scalars['BigInt']['output']
  interactions: Array<PoolInteraction>
  isPublic: Scalars['Boolean']['output']
  minimalStake: Scalars['BigInt']['output']
  payoutStart: Scalars['BigInt']['output']
  rewardDecrease: Scalars['BigInt']['output']
  totalStaked: Scalars['BigInt']['output']
  totalUsers: Scalars['BigInt']['output']
  withdrawLockPeriod: Scalars['BigInt']['output']
  withdrawLockPeriodAfterStake: Scalars['BigInt']['output']
}

export type PoolInteractionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<PoolInteraction_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  where?: InputMaybe<PoolInteraction_Filter>
}

export type PoolCreated = {
  __typename?: 'PoolCreated'
  blockNumber: Scalars['BigInt']['output']
  blockTimestamp: Scalars['BigInt']['output']
  id: Scalars['Bytes']['output']
  poolId: Scalars['BigInt']['output']
  pool_claimLockPeriod: Scalars['BigInt']['output']
  pool_decreaseInterval: Scalars['BigInt']['output']
  pool_initialReward: Scalars['BigInt']['output']
  pool_isPublic: Scalars['Boolean']['output']
  pool_minimalStake: Scalars['BigInt']['output']
  pool_payoutStart: Scalars['BigInt']['output']
  pool_rewardDecrease: Scalars['BigInt']['output']
  pool_withdrawLockPeriod: Scalars['BigInt']['output']
  pool_withdrawLockPeriodAfterStake: Scalars['BigInt']['output']
  transactionHash: Scalars['Bytes']['output']
}

export type PoolCreated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<PoolCreated_Filter>>>
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<PoolCreated_Filter>>>
  poolId?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  poolId_lt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_lte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_claimLockPeriod?: InputMaybe<Scalars['BigInt']['input']>
  pool_claimLockPeriod_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_claimLockPeriod_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_claimLockPeriod_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_claimLockPeriod_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_claimLockPeriod_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_claimLockPeriod_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_claimLockPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_decreaseInterval?: InputMaybe<Scalars['BigInt']['input']>
  pool_decreaseInterval_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_decreaseInterval_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_decreaseInterval_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_decreaseInterval_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_decreaseInterval_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_decreaseInterval_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_decreaseInterval_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_initialReward?: InputMaybe<Scalars['BigInt']['input']>
  pool_initialReward_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_initialReward_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_initialReward_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_initialReward_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_initialReward_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_initialReward_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_initialReward_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_isPublic?: InputMaybe<Scalars['Boolean']['input']>
  pool_isPublic_in?: InputMaybe<Array<Scalars['Boolean']['input']>>
  pool_isPublic_not?: InputMaybe<Scalars['Boolean']['input']>
  pool_isPublic_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>
  pool_minimalStake?: InputMaybe<Scalars['BigInt']['input']>
  pool_minimalStake_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_minimalStake_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_minimalStake_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_minimalStake_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_minimalStake_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_minimalStake_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_minimalStake_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_payoutStart?: InputMaybe<Scalars['BigInt']['input']>
  pool_payoutStart_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_payoutStart_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_payoutStart_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_payoutStart_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_payoutStart_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_payoutStart_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_payoutStart_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_rewardDecrease?: InputMaybe<Scalars['BigInt']['input']>
  pool_rewardDecrease_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_rewardDecrease_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_rewardDecrease_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_rewardDecrease_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_rewardDecrease_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_rewardDecrease_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_rewardDecrease_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_withdrawLockPeriod?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriodAfterStake?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriodAfterStake_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriodAfterStake_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriodAfterStake_in?: InputMaybe<
    Array<Scalars['BigInt']['input']>
  >
  pool_withdrawLockPeriodAfterStake_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriodAfterStake_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriodAfterStake_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriodAfterStake_not_in?: InputMaybe<
    Array<Scalars['BigInt']['input']>
  >
  pool_withdrawLockPeriod_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriod_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriod_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_withdrawLockPeriod_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriod_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriod_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
}

export enum PoolCreated_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  PoolId = 'poolId',
  PoolClaimLockPeriod = 'pool_claimLockPeriod',
  PoolDecreaseInterval = 'pool_decreaseInterval',
  PoolInitialReward = 'pool_initialReward',
  PoolIsPublic = 'pool_isPublic',
  PoolMinimalStake = 'pool_minimalStake',
  PoolPayoutStart = 'pool_payoutStart',
  PoolRewardDecrease = 'pool_rewardDecrease',
  PoolWithdrawLockPeriod = 'pool_withdrawLockPeriod',
  PoolWithdrawLockPeriodAfterStake = 'pool_withdrawLockPeriodAfterStake',
  TransactionHash = 'transactionHash',
}

export type PoolEdited = {
  __typename?: 'PoolEdited'
  blockNumber: Scalars['BigInt']['output']
  blockTimestamp: Scalars['BigInt']['output']
  id: Scalars['Bytes']['output']
  poolId: Scalars['BigInt']['output']
  pool_claimLockPeriod: Scalars['BigInt']['output']
  pool_decreaseInterval: Scalars['BigInt']['output']
  pool_initialReward: Scalars['BigInt']['output']
  pool_isPublic: Scalars['Boolean']['output']
  pool_minimalStake: Scalars['BigInt']['output']
  pool_payoutStart: Scalars['BigInt']['output']
  pool_rewardDecrease: Scalars['BigInt']['output']
  pool_withdrawLockPeriod: Scalars['BigInt']['output']
  pool_withdrawLockPeriodAfterStake: Scalars['BigInt']['output']
  transactionHash: Scalars['Bytes']['output']
}

export type PoolEdited_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<PoolEdited_Filter>>>
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<PoolEdited_Filter>>>
  poolId?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  poolId_lt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_lte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_claimLockPeriod?: InputMaybe<Scalars['BigInt']['input']>
  pool_claimLockPeriod_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_claimLockPeriod_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_claimLockPeriod_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_claimLockPeriod_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_claimLockPeriod_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_claimLockPeriod_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_claimLockPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_decreaseInterval?: InputMaybe<Scalars['BigInt']['input']>
  pool_decreaseInterval_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_decreaseInterval_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_decreaseInterval_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_decreaseInterval_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_decreaseInterval_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_decreaseInterval_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_decreaseInterval_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_initialReward?: InputMaybe<Scalars['BigInt']['input']>
  pool_initialReward_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_initialReward_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_initialReward_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_initialReward_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_initialReward_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_initialReward_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_initialReward_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_isPublic?: InputMaybe<Scalars['Boolean']['input']>
  pool_isPublic_in?: InputMaybe<Array<Scalars['Boolean']['input']>>
  pool_isPublic_not?: InputMaybe<Scalars['Boolean']['input']>
  pool_isPublic_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>
  pool_minimalStake?: InputMaybe<Scalars['BigInt']['input']>
  pool_minimalStake_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_minimalStake_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_minimalStake_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_minimalStake_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_minimalStake_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_minimalStake_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_minimalStake_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_payoutStart?: InputMaybe<Scalars['BigInt']['input']>
  pool_payoutStart_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_payoutStart_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_payoutStart_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_payoutStart_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_payoutStart_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_payoutStart_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_payoutStart_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_rewardDecrease?: InputMaybe<Scalars['BigInt']['input']>
  pool_rewardDecrease_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_rewardDecrease_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_rewardDecrease_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_rewardDecrease_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_rewardDecrease_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_rewardDecrease_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_rewardDecrease_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_withdrawLockPeriod?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriodAfterStake?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriodAfterStake_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriodAfterStake_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriodAfterStake_in?: InputMaybe<
    Array<Scalars['BigInt']['input']>
  >
  pool_withdrawLockPeriodAfterStake_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriodAfterStake_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriodAfterStake_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriodAfterStake_not_in?: InputMaybe<
    Array<Scalars['BigInt']['input']>
  >
  pool_withdrawLockPeriod_gt?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriod_gte?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriod_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pool_withdrawLockPeriod_lt?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriod_lte?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriod_not?: InputMaybe<Scalars['BigInt']['input']>
  pool_withdrawLockPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
}

export enum PoolEdited_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  PoolId = 'poolId',
  PoolClaimLockPeriod = 'pool_claimLockPeriod',
  PoolDecreaseInterval = 'pool_decreaseInterval',
  PoolInitialReward = 'pool_initialReward',
  PoolIsPublic = 'pool_isPublic',
  PoolMinimalStake = 'pool_minimalStake',
  PoolPayoutStart = 'pool_payoutStart',
  PoolRewardDecrease = 'pool_rewardDecrease',
  PoolWithdrawLockPeriod = 'pool_withdrawLockPeriod',
  PoolWithdrawLockPeriodAfterStake = 'pool_withdrawLockPeriodAfterStake',
  TransactionHash = 'transactionHash',
}

export type PoolInteraction = {
  __typename?: 'PoolInteraction'
  /** The amount of staked or withdrawn tokens */
  amount: Scalars['BigInt']['output']
  /** The tx hash */
  hash: Scalars['Bytes']['output']
  /** id forms from tx hash + counter */
  id: Scalars['Bytes']['output']
  /** True if the user staked, false if the user withdrawn */
  isStake: Scalars['Boolean']['output']
  /** The pool which was interacted */
  pool: Pool
  /** The current pool rate */
  rate: Scalars['BigInt']['output']
  /** The timestamp of tx */
  timestamp: Scalars['BigInt']['output']
  /** The total staked amount after interaction */
  totalStaked: Scalars['BigInt']['output']
  /** The user who interacted with the pool */
  userInPool: UserInPool
}

export type PoolInteraction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  amount?: InputMaybe<Scalars['BigInt']['input']>
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>
  amount_not?: InputMaybe<Scalars['BigInt']['input']>
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  and?: InputMaybe<Array<InputMaybe<PoolInteraction_Filter>>>
  hash?: InputMaybe<Scalars['Bytes']['input']>
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>
  hash_not?: InputMaybe<Scalars['Bytes']['input']>
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  isStake?: InputMaybe<Scalars['Boolean']['input']>
  isStake_in?: InputMaybe<Array<Scalars['Boolean']['input']>>
  isStake_not?: InputMaybe<Scalars['Boolean']['input']>
  isStake_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>
  or?: InputMaybe<Array<InputMaybe<PoolInteraction_Filter>>>
  pool?: InputMaybe<Scalars['String']['input']>
  pool_?: InputMaybe<Pool_Filter>
  pool_contains?: InputMaybe<Scalars['String']['input']>
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>
  pool_ends_with?: InputMaybe<Scalars['String']['input']>
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>
  pool_gt?: InputMaybe<Scalars['String']['input']>
  pool_gte?: InputMaybe<Scalars['String']['input']>
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>
  pool_lt?: InputMaybe<Scalars['String']['input']>
  pool_lte?: InputMaybe<Scalars['String']['input']>
  pool_not?: InputMaybe<Scalars['String']['input']>
  pool_not_contains?: InputMaybe<Scalars['String']['input']>
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>
  pool_starts_with?: InputMaybe<Scalars['String']['input']>
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>
  rate?: InputMaybe<Scalars['BigInt']['input']>
  rate_gt?: InputMaybe<Scalars['BigInt']['input']>
  rate_gte?: InputMaybe<Scalars['BigInt']['input']>
  rate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  rate_lt?: InputMaybe<Scalars['BigInt']['input']>
  rate_lte?: InputMaybe<Scalars['BigInt']['input']>
  rate_not?: InputMaybe<Scalars['BigInt']['input']>
  rate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  timestamp?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  totalStaked?: InputMaybe<Scalars['BigInt']['input']>
  totalStaked_gt?: InputMaybe<Scalars['BigInt']['input']>
  totalStaked_gte?: InputMaybe<Scalars['BigInt']['input']>
  totalStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  totalStaked_lt?: InputMaybe<Scalars['BigInt']['input']>
  totalStaked_lte?: InputMaybe<Scalars['BigInt']['input']>
  totalStaked_not?: InputMaybe<Scalars['BigInt']['input']>
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  userInPool?: InputMaybe<Scalars['String']['input']>
  userInPool_?: InputMaybe<UserInPool_Filter>
  userInPool_contains?: InputMaybe<Scalars['String']['input']>
  userInPool_contains_nocase?: InputMaybe<Scalars['String']['input']>
  userInPool_ends_with?: InputMaybe<Scalars['String']['input']>
  userInPool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>
  userInPool_gt?: InputMaybe<Scalars['String']['input']>
  userInPool_gte?: InputMaybe<Scalars['String']['input']>
  userInPool_in?: InputMaybe<Array<Scalars['String']['input']>>
  userInPool_lt?: InputMaybe<Scalars['String']['input']>
  userInPool_lte?: InputMaybe<Scalars['String']['input']>
  userInPool_not?: InputMaybe<Scalars['String']['input']>
  userInPool_not_contains?: InputMaybe<Scalars['String']['input']>
  userInPool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>
  userInPool_not_ends_with?: InputMaybe<Scalars['String']['input']>
  userInPool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>
  userInPool_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  userInPool_not_starts_with?: InputMaybe<Scalars['String']['input']>
  userInPool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>
  userInPool_starts_with?: InputMaybe<Scalars['String']['input']>
  userInPool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>
}

export enum PoolInteraction_OrderBy {
  Amount = 'amount',
  Hash = 'hash',
  Id = 'id',
  IsStake = 'isStake',
  Pool = 'pool',
  PoolClaimLockPeriod = 'pool__claimLockPeriod',
  PoolDecreaseInterval = 'pool__decreaseInterval',
  PoolId = 'pool__id',
  PoolInitialReward = 'pool__initialReward',
  PoolIsPublic = 'pool__isPublic',
  PoolMinimalStake = 'pool__minimalStake',
  PoolPayoutStart = 'pool__payoutStart',
  PoolRewardDecrease = 'pool__rewardDecrease',
  PoolTotalStaked = 'pool__totalStaked',
  PoolTotalUsers = 'pool__totalUsers',
  PoolWithdrawLockPeriod = 'pool__withdrawLockPeriod',
  PoolWithdrawLockPeriodAfterStake = 'pool__withdrawLockPeriodAfterStake',
  Rate = 'rate',
  Timestamp = 'timestamp',
  TotalStaked = 'totalStaked',
  UserInPool = 'userInPool',
  UserInPoolClaimed = 'userInPool__claimed',
  UserInPoolId = 'userInPool__id',
  UserInPoolStaked = 'userInPool__staked',
  UserInPoolUser = 'userInPool__user',
}

export type Pool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<Pool_Filter>>>
  claimLockPeriod?: InputMaybe<Scalars['BigInt']['input']>
  claimLockPeriod_gt?: InputMaybe<Scalars['BigInt']['input']>
  claimLockPeriod_gte?: InputMaybe<Scalars['BigInt']['input']>
  claimLockPeriod_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  claimLockPeriod_lt?: InputMaybe<Scalars['BigInt']['input']>
  claimLockPeriod_lte?: InputMaybe<Scalars['BigInt']['input']>
  claimLockPeriod_not?: InputMaybe<Scalars['BigInt']['input']>
  claimLockPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  decreaseInterval?: InputMaybe<Scalars['BigInt']['input']>
  decreaseInterval_gt?: InputMaybe<Scalars['BigInt']['input']>
  decreaseInterval_gte?: InputMaybe<Scalars['BigInt']['input']>
  decreaseInterval_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  decreaseInterval_lt?: InputMaybe<Scalars['BigInt']['input']>
  decreaseInterval_lte?: InputMaybe<Scalars['BigInt']['input']>
  decreaseInterval_not?: InputMaybe<Scalars['BigInt']['input']>
  decreaseInterval_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  initialReward?: InputMaybe<Scalars['BigInt']['input']>
  initialReward_gt?: InputMaybe<Scalars['BigInt']['input']>
  initialReward_gte?: InputMaybe<Scalars['BigInt']['input']>
  initialReward_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  initialReward_lt?: InputMaybe<Scalars['BigInt']['input']>
  initialReward_lte?: InputMaybe<Scalars['BigInt']['input']>
  initialReward_not?: InputMaybe<Scalars['BigInt']['input']>
  initialReward_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  interactions_?: InputMaybe<PoolInteraction_Filter>
  isPublic?: InputMaybe<Scalars['Boolean']['input']>
  isPublic_in?: InputMaybe<Array<Scalars['Boolean']['input']>>
  isPublic_not?: InputMaybe<Scalars['Boolean']['input']>
  isPublic_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>
  minimalStake?: InputMaybe<Scalars['BigInt']['input']>
  minimalStake_gt?: InputMaybe<Scalars['BigInt']['input']>
  minimalStake_gte?: InputMaybe<Scalars['BigInt']['input']>
  minimalStake_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  minimalStake_lt?: InputMaybe<Scalars['BigInt']['input']>
  minimalStake_lte?: InputMaybe<Scalars['BigInt']['input']>
  minimalStake_not?: InputMaybe<Scalars['BigInt']['input']>
  minimalStake_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  or?: InputMaybe<Array<InputMaybe<Pool_Filter>>>
  payoutStart?: InputMaybe<Scalars['BigInt']['input']>
  payoutStart_gt?: InputMaybe<Scalars['BigInt']['input']>
  payoutStart_gte?: InputMaybe<Scalars['BigInt']['input']>
  payoutStart_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  payoutStart_lt?: InputMaybe<Scalars['BigInt']['input']>
  payoutStart_lte?: InputMaybe<Scalars['BigInt']['input']>
  payoutStart_not?: InputMaybe<Scalars['BigInt']['input']>
  payoutStart_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  rewardDecrease?: InputMaybe<Scalars['BigInt']['input']>
  rewardDecrease_gt?: InputMaybe<Scalars['BigInt']['input']>
  rewardDecrease_gte?: InputMaybe<Scalars['BigInt']['input']>
  rewardDecrease_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  rewardDecrease_lt?: InputMaybe<Scalars['BigInt']['input']>
  rewardDecrease_lte?: InputMaybe<Scalars['BigInt']['input']>
  rewardDecrease_not?: InputMaybe<Scalars['BigInt']['input']>
  rewardDecrease_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  totalStaked?: InputMaybe<Scalars['BigInt']['input']>
  totalStaked_gt?: InputMaybe<Scalars['BigInt']['input']>
  totalStaked_gte?: InputMaybe<Scalars['BigInt']['input']>
  totalStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  totalStaked_lt?: InputMaybe<Scalars['BigInt']['input']>
  totalStaked_lte?: InputMaybe<Scalars['BigInt']['input']>
  totalStaked_not?: InputMaybe<Scalars['BigInt']['input']>
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  totalUsers?: InputMaybe<Scalars['BigInt']['input']>
  totalUsers_gt?: InputMaybe<Scalars['BigInt']['input']>
  totalUsers_gte?: InputMaybe<Scalars['BigInt']['input']>
  totalUsers_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  totalUsers_lt?: InputMaybe<Scalars['BigInt']['input']>
  totalUsers_lte?: InputMaybe<Scalars['BigInt']['input']>
  totalUsers_not?: InputMaybe<Scalars['BigInt']['input']>
  totalUsers_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  withdrawLockPeriod?: InputMaybe<Scalars['BigInt']['input']>
  withdrawLockPeriodAfterStake?: InputMaybe<Scalars['BigInt']['input']>
  withdrawLockPeriodAfterStake_gt?: InputMaybe<Scalars['BigInt']['input']>
  withdrawLockPeriodAfterStake_gte?: InputMaybe<Scalars['BigInt']['input']>
  withdrawLockPeriodAfterStake_in?: InputMaybe<
    Array<Scalars['BigInt']['input']>
  >
  withdrawLockPeriodAfterStake_lt?: InputMaybe<Scalars['BigInt']['input']>
  withdrawLockPeriodAfterStake_lte?: InputMaybe<Scalars['BigInt']['input']>
  withdrawLockPeriodAfterStake_not?: InputMaybe<Scalars['BigInt']['input']>
  withdrawLockPeriodAfterStake_not_in?: InputMaybe<
    Array<Scalars['BigInt']['input']>
  >
  withdrawLockPeriod_gt?: InputMaybe<Scalars['BigInt']['input']>
  withdrawLockPeriod_gte?: InputMaybe<Scalars['BigInt']['input']>
  withdrawLockPeriod_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  withdrawLockPeriod_lt?: InputMaybe<Scalars['BigInt']['input']>
  withdrawLockPeriod_lte?: InputMaybe<Scalars['BigInt']['input']>
  withdrawLockPeriod_not?: InputMaybe<Scalars['BigInt']['input']>
  withdrawLockPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
}

export enum Pool_OrderBy {
  ClaimLockPeriod = 'claimLockPeriod',
  DecreaseInterval = 'decreaseInterval',
  Id = 'id',
  InitialReward = 'initialReward',
  Interactions = 'interactions',
  IsPublic = 'isPublic',
  MinimalStake = 'minimalStake',
  PayoutStart = 'payoutStart',
  RewardDecrease = 'rewardDecrease',
  TotalStaked = 'totalStaked',
  TotalUsers = 'totalUsers',
  WithdrawLockPeriod = 'withdrawLockPeriod',
  WithdrawLockPeriodAfterStake = 'withdrawLockPeriodAfterStake',
}

export type Query = {
  __typename?: 'Query'
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>
  adminChanged?: Maybe<AdminChanged>
  adminChangeds: Array<AdminChanged>
  beaconUpgraded?: Maybe<BeaconUpgraded>
  beaconUpgradeds: Array<BeaconUpgraded>
  initialized?: Maybe<Initialized>
  initializeds: Array<Initialized>
  interactionCount?: Maybe<InteractionCount>
  interactionCounts: Array<InteractionCount>
  overplusBridged?: Maybe<OverplusBridged>
  overplusBridgeds: Array<OverplusBridged>
  ownershipTransferred?: Maybe<OwnershipTransferred>
  ownershipTransferreds: Array<OwnershipTransferred>
  pool?: Maybe<Pool>
  poolCreated?: Maybe<PoolCreated>
  poolCreateds: Array<PoolCreated>
  poolEdited?: Maybe<PoolEdited>
  poolEditeds: Array<PoolEdited>
  poolInteraction?: Maybe<PoolInteraction>
  poolInteractions: Array<PoolInteraction>
  pools: Array<Pool>
  referrer?: Maybe<Referrer>
  referrers: Array<Referrer>
  upgraded?: Maybe<Upgraded>
  upgradeds: Array<Upgraded>
  user?: Maybe<User>
  userClaimed?: Maybe<UserClaimed>
  userClaimeds: Array<UserClaimed>
  userInPool?: Maybe<UserInPool>
  userInPools: Array<UserInPool>
  userInteraction?: Maybe<UserInteraction>
  userInteractions: Array<UserInteraction>
  userReferrer?: Maybe<UserReferrer>
  userReferrers: Array<UserReferrer>
  userStaked?: Maybe<UserStaked>
  userStakeds: Array<UserStaked>
  userWithdrawn?: Maybe<UserWithdrawn>
  userWithdrawns: Array<UserWithdrawn>
  users: Array<User>
}

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>
}

export type QueryAdminChangedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryAdminChangedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<AdminChanged_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<AdminChanged_Filter>
}

export type QueryBeaconUpgradedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryBeaconUpgradedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<BeaconUpgraded_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<BeaconUpgraded_Filter>
}

export type QueryInitializedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryInitializedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Initialized_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Initialized_Filter>
}

export type QueryInteractionCountArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryInteractionCountsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<InteractionCount_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<InteractionCount_Filter>
}

export type QueryOverplusBridgedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryOverplusBridgedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<OverplusBridged_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<OverplusBridged_Filter>
}

export type QueryOwnershipTransferredArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryOwnershipTransferredsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<OwnershipTransferred_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<OwnershipTransferred_Filter>
}

export type QueryPoolArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryPoolCreatedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryPoolCreatedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<PoolCreated_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<PoolCreated_Filter>
}

export type QueryPoolEditedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryPoolEditedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<PoolEdited_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<PoolEdited_Filter>
}

export type QueryPoolInteractionArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryPoolInteractionsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<PoolInteraction_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<PoolInteraction_Filter>
}

export type QueryPoolsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Pool_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Pool_Filter>
}

export type QueryReferrerArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryReferrersArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Referrer_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Referrer_Filter>
}

export type QueryUpgradedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryUpgradedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Upgraded_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Upgraded_Filter>
}

export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryUserClaimedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryUserClaimedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<UserClaimed_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<UserClaimed_Filter>
}

export type QueryUserInPoolArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryUserInPoolsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<UserInPool_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<UserInPool_Filter>
}

export type QueryUserInteractionArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryUserInteractionsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<UserInteraction_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<UserInteraction_Filter>
}

export type QueryUserReferrerArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryUserReferrersArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<UserReferrer_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<UserReferrer_Filter>
}

export type QueryUserStakedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryUserStakedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<UserStaked_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<UserStaked_Filter>
}

export type QueryUserWithdrawnArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryUserWithdrawnsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<UserWithdrawn_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<UserWithdrawn_Filter>
}

export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<User_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<User_Filter>
}

export type Referrer = {
  __typename?: 'Referrer'
  /** id forms from user address + pool id  */
  id: Scalars['Bytes']['output']
  /** The pool ID */
  poolId: Scalars['BigInt']['output']
  /** The referrer total claimed */
  totalClaimed: Scalars['BigInt']['output']
  /** The referrer address */
  user: Scalars['Bytes']['output']
}

export type Referrer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<Referrer_Filter>>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<Referrer_Filter>>>
  poolId?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  poolId_lt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_lte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  totalClaimed?: InputMaybe<Scalars['BigInt']['input']>
  totalClaimed_gt?: InputMaybe<Scalars['BigInt']['input']>
  totalClaimed_gte?: InputMaybe<Scalars['BigInt']['input']>
  totalClaimed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  totalClaimed_lt?: InputMaybe<Scalars['BigInt']['input']>
  totalClaimed_lte?: InputMaybe<Scalars['BigInt']['input']>
  totalClaimed_not?: InputMaybe<Scalars['BigInt']['input']>
  totalClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  user?: InputMaybe<Scalars['Bytes']['input']>
  user_contains?: InputMaybe<Scalars['Bytes']['input']>
  user_gt?: InputMaybe<Scalars['Bytes']['input']>
  user_gte?: InputMaybe<Scalars['Bytes']['input']>
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  user_lt?: InputMaybe<Scalars['Bytes']['input']>
  user_lte?: InputMaybe<Scalars['Bytes']['input']>
  user_not?: InputMaybe<Scalars['Bytes']['input']>
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
}

export enum Referrer_OrderBy {
  Id = 'id',
  PoolId = 'poolId',
  TotalClaimed = 'totalClaimed',
  User = 'user',
}

export type Subscription = {
  __typename?: 'Subscription'
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>
  adminChanged?: Maybe<AdminChanged>
  adminChangeds: Array<AdminChanged>
  beaconUpgraded?: Maybe<BeaconUpgraded>
  beaconUpgradeds: Array<BeaconUpgraded>
  initialized?: Maybe<Initialized>
  initializeds: Array<Initialized>
  interactionCount?: Maybe<InteractionCount>
  interactionCounts: Array<InteractionCount>
  overplusBridged?: Maybe<OverplusBridged>
  overplusBridgeds: Array<OverplusBridged>
  ownershipTransferred?: Maybe<OwnershipTransferred>
  ownershipTransferreds: Array<OwnershipTransferred>
  pool?: Maybe<Pool>
  poolCreated?: Maybe<PoolCreated>
  poolCreateds: Array<PoolCreated>
  poolEdited?: Maybe<PoolEdited>
  poolEditeds: Array<PoolEdited>
  poolInteraction?: Maybe<PoolInteraction>
  poolInteractions: Array<PoolInteraction>
  pools: Array<Pool>
  referrer?: Maybe<Referrer>
  referrers: Array<Referrer>
  upgraded?: Maybe<Upgraded>
  upgradeds: Array<Upgraded>
  user?: Maybe<User>
  userClaimed?: Maybe<UserClaimed>
  userClaimeds: Array<UserClaimed>
  userInPool?: Maybe<UserInPool>
  userInPools: Array<UserInPool>
  userInteraction?: Maybe<UserInteraction>
  userInteractions: Array<UserInteraction>
  userReferrer?: Maybe<UserReferrer>
  userReferrers: Array<UserReferrer>
  userStaked?: Maybe<UserStaked>
  userStakeds: Array<UserStaked>
  userWithdrawn?: Maybe<UserWithdrawn>
  userWithdrawns: Array<UserWithdrawn>
  users: Array<User>
}

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>
}

export type SubscriptionAdminChangedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionAdminChangedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<AdminChanged_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<AdminChanged_Filter>
}

export type SubscriptionBeaconUpgradedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionBeaconUpgradedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<BeaconUpgraded_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<BeaconUpgraded_Filter>
}

export type SubscriptionInitializedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionInitializedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Initialized_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Initialized_Filter>
}

export type SubscriptionInteractionCountArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionInteractionCountsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<InteractionCount_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<InteractionCount_Filter>
}

export type SubscriptionOverplusBridgedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionOverplusBridgedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<OverplusBridged_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<OverplusBridged_Filter>
}

export type SubscriptionOwnershipTransferredArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionOwnershipTransferredsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<OwnershipTransferred_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<OwnershipTransferred_Filter>
}

export type SubscriptionPoolArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionPoolCreatedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionPoolCreatedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<PoolCreated_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<PoolCreated_Filter>
}

export type SubscriptionPoolEditedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionPoolEditedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<PoolEdited_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<PoolEdited_Filter>
}

export type SubscriptionPoolInteractionArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionPoolInteractionsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<PoolInteraction_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<PoolInteraction_Filter>
}

export type SubscriptionPoolsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Pool_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Pool_Filter>
}

export type SubscriptionReferrerArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionReferrersArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Referrer_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Referrer_Filter>
}

export type SubscriptionUpgradedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionUpgradedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Upgraded_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Upgraded_Filter>
}

export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionUserClaimedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionUserClaimedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<UserClaimed_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<UserClaimed_Filter>
}

export type SubscriptionUserInPoolArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionUserInPoolsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<UserInPool_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<UserInPool_Filter>
}

export type SubscriptionUserInteractionArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionUserInteractionsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<UserInteraction_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<UserInteraction_Filter>
}

export type SubscriptionUserReferrerArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionUserReferrersArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<UserReferrer_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<UserReferrer_Filter>
}

export type SubscriptionUserStakedArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionUserStakedsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<UserStaked_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<UserStaked_Filter>
}

export type SubscriptionUserWithdrawnArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars['ID']['input']
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionUserWithdrawnsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<UserWithdrawn_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<UserWithdrawn_Filter>
}

export type SubscriptionUsersArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<User_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<User_Filter>
}

export type Upgraded = {
  __typename?: 'Upgraded'
  blockNumber: Scalars['BigInt']['output']
  blockTimestamp: Scalars['BigInt']['output']
  id: Scalars['Bytes']['output']
  implementation: Scalars['Bytes']['output']
  transactionHash: Scalars['Bytes']['output']
}

export type Upgraded_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<Upgraded_Filter>>>
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  implementation?: InputMaybe<Scalars['Bytes']['input']>
  implementation_contains?: InputMaybe<Scalars['Bytes']['input']>
  implementation_gt?: InputMaybe<Scalars['Bytes']['input']>
  implementation_gte?: InputMaybe<Scalars['Bytes']['input']>
  implementation_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  implementation_lt?: InputMaybe<Scalars['Bytes']['input']>
  implementation_lte?: InputMaybe<Scalars['Bytes']['input']>
  implementation_not?: InputMaybe<Scalars['Bytes']['input']>
  implementation_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  implementation_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<Upgraded_Filter>>>
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
}

export enum Upgraded_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  Implementation = 'implementation',
  TransactionHash = 'transactionHash',
}

export type User = {
  __typename?: 'User'
  /** id forms from user address */
  id: Scalars['Bytes']['output']
  totalClaimed: Scalars['BigInt']['output']
}

export type UserClaimed = {
  __typename?: 'UserClaimed'
  amount: Scalars['BigInt']['output']
  blockNumber: Scalars['BigInt']['output']
  blockTimestamp: Scalars['BigInt']['output']
  id: Scalars['Bytes']['output']
  poolId: Scalars['BigInt']['output']
  receiver: Scalars['Bytes']['output']
  transactionHash: Scalars['Bytes']['output']
  user: Scalars['Bytes']['output']
}

export type UserClaimed_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  amount?: InputMaybe<Scalars['BigInt']['input']>
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>
  amount_not?: InputMaybe<Scalars['BigInt']['input']>
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  and?: InputMaybe<Array<InputMaybe<UserClaimed_Filter>>>
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<UserClaimed_Filter>>>
  poolId?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  poolId_lt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_lte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  receiver?: InputMaybe<Scalars['Bytes']['input']>
  receiver_contains?: InputMaybe<Scalars['Bytes']['input']>
  receiver_gt?: InputMaybe<Scalars['Bytes']['input']>
  receiver_gte?: InputMaybe<Scalars['Bytes']['input']>
  receiver_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  receiver_lt?: InputMaybe<Scalars['Bytes']['input']>
  receiver_lte?: InputMaybe<Scalars['Bytes']['input']>
  receiver_not?: InputMaybe<Scalars['Bytes']['input']>
  receiver_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  receiver_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  user?: InputMaybe<Scalars['Bytes']['input']>
  user_contains?: InputMaybe<Scalars['Bytes']['input']>
  user_gt?: InputMaybe<Scalars['Bytes']['input']>
  user_gte?: InputMaybe<Scalars['Bytes']['input']>
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  user_lt?: InputMaybe<Scalars['Bytes']['input']>
  user_lte?: InputMaybe<Scalars['Bytes']['input']>
  user_not?: InputMaybe<Scalars['Bytes']['input']>
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
}

export enum UserClaimed_OrderBy {
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  PoolId = 'poolId',
  Receiver = 'receiver',
  TransactionHash = 'transactionHash',
  User = 'user',
}

/**
 * The entity holds information about user's interaction with the pool
 *
 */
export type UserInPool = {
  __typename?: 'UserInPool'
  /** The amount of claimed tokens */
  claimed: Scalars['BigInt']['output']
  /** id forms from user address + pool id */
  id: Scalars['Bytes']['output']
  /** The array of interactions with the pool */
  interactions: Array<PoolInteraction>
  /** The pool which was interacted */
  pool: Pool
  /** The amount of staked tokens */
  staked: Scalars['BigInt']['output']
  /** The user who interacted with the pool */
  user: Scalars['Bytes']['output']
}

/**
 * The entity holds information about user's interaction with the pool
 *
 */
export type UserInPoolInteractionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<PoolInteraction_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars['Int']['input']>
  where?: InputMaybe<PoolInteraction_Filter>
}

export type UserInPool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<UserInPool_Filter>>>
  claimed?: InputMaybe<Scalars['BigInt']['input']>
  claimed_gt?: InputMaybe<Scalars['BigInt']['input']>
  claimed_gte?: InputMaybe<Scalars['BigInt']['input']>
  claimed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  claimed_lt?: InputMaybe<Scalars['BigInt']['input']>
  claimed_lte?: InputMaybe<Scalars['BigInt']['input']>
  claimed_not?: InputMaybe<Scalars['BigInt']['input']>
  claimed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  interactions_?: InputMaybe<PoolInteraction_Filter>
  or?: InputMaybe<Array<InputMaybe<UserInPool_Filter>>>
  pool?: InputMaybe<Scalars['String']['input']>
  pool_?: InputMaybe<Pool_Filter>
  pool_contains?: InputMaybe<Scalars['String']['input']>
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>
  pool_ends_with?: InputMaybe<Scalars['String']['input']>
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>
  pool_gt?: InputMaybe<Scalars['String']['input']>
  pool_gte?: InputMaybe<Scalars['String']['input']>
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>
  pool_lt?: InputMaybe<Scalars['String']['input']>
  pool_lte?: InputMaybe<Scalars['String']['input']>
  pool_not?: InputMaybe<Scalars['String']['input']>
  pool_not_contains?: InputMaybe<Scalars['String']['input']>
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>
  pool_starts_with?: InputMaybe<Scalars['String']['input']>
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>
  staked?: InputMaybe<Scalars['BigInt']['input']>
  staked_gt?: InputMaybe<Scalars['BigInt']['input']>
  staked_gte?: InputMaybe<Scalars['BigInt']['input']>
  staked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  staked_lt?: InputMaybe<Scalars['BigInt']['input']>
  staked_lte?: InputMaybe<Scalars['BigInt']['input']>
  staked_not?: InputMaybe<Scalars['BigInt']['input']>
  staked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  user?: InputMaybe<Scalars['Bytes']['input']>
  user_contains?: InputMaybe<Scalars['Bytes']['input']>
  user_gt?: InputMaybe<Scalars['Bytes']['input']>
  user_gte?: InputMaybe<Scalars['Bytes']['input']>
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  user_lt?: InputMaybe<Scalars['Bytes']['input']>
  user_lte?: InputMaybe<Scalars['Bytes']['input']>
  user_not?: InputMaybe<Scalars['Bytes']['input']>
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
}

export enum UserInPool_OrderBy {
  Claimed = 'claimed',
  Id = 'id',
  Interactions = 'interactions',
  Pool = 'pool',
  PoolClaimLockPeriod = 'pool__claimLockPeriod',
  PoolDecreaseInterval = 'pool__decreaseInterval',
  PoolId = 'pool__id',
  PoolInitialReward = 'pool__initialReward',
  PoolIsPublic = 'pool__isPublic',
  PoolMinimalStake = 'pool__minimalStake',
  PoolPayoutStart = 'pool__payoutStart',
  PoolRewardDecrease = 'pool__rewardDecrease',
  PoolTotalStaked = 'pool__totalStaked',
  PoolTotalUsers = 'pool__totalUsers',
  PoolWithdrawLockPeriod = 'pool__withdrawLockPeriod',
  PoolWithdrawLockPeriodAfterStake = 'pool__withdrawLockPeriodAfterStake',
  Staked = 'staked',
  User = 'user',
}

export type UserInteraction = {
  __typename?: 'UserInteraction'
  /** The user claimed rewards */
  claimedRewards: Scalars['BigInt']['output']
  /** The user deposited amount with multiplier */
  deposited: Scalars['BigInt']['output']
  /** The tx hash */
  id: Scalars['Bytes']['output']
  /** The user pending rewards */
  pendingRewards: Scalars['BigInt']['output']
  /** The pool ID */
  poolId: Scalars['BigInt']['output']
  /** The user rate */
  rate: Scalars['BigInt']['output']
  /** The timestamp of tx */
  timestamp: Scalars['BigInt']['output']
  /** The caller address */
  user: Scalars['Bytes']['output']
}

export type UserInteraction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<UserInteraction_Filter>>>
  claimedRewards?: InputMaybe<Scalars['BigInt']['input']>
  claimedRewards_gt?: InputMaybe<Scalars['BigInt']['input']>
  claimedRewards_gte?: InputMaybe<Scalars['BigInt']['input']>
  claimedRewards_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  claimedRewards_lt?: InputMaybe<Scalars['BigInt']['input']>
  claimedRewards_lte?: InputMaybe<Scalars['BigInt']['input']>
  claimedRewards_not?: InputMaybe<Scalars['BigInt']['input']>
  claimedRewards_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  deposited?: InputMaybe<Scalars['BigInt']['input']>
  deposited_gt?: InputMaybe<Scalars['BigInt']['input']>
  deposited_gte?: InputMaybe<Scalars['BigInt']['input']>
  deposited_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  deposited_lt?: InputMaybe<Scalars['BigInt']['input']>
  deposited_lte?: InputMaybe<Scalars['BigInt']['input']>
  deposited_not?: InputMaybe<Scalars['BigInt']['input']>
  deposited_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<UserInteraction_Filter>>>
  pendingRewards?: InputMaybe<Scalars['BigInt']['input']>
  pendingRewards_gt?: InputMaybe<Scalars['BigInt']['input']>
  pendingRewards_gte?: InputMaybe<Scalars['BigInt']['input']>
  pendingRewards_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  pendingRewards_lt?: InputMaybe<Scalars['BigInt']['input']>
  pendingRewards_lte?: InputMaybe<Scalars['BigInt']['input']>
  pendingRewards_not?: InputMaybe<Scalars['BigInt']['input']>
  pendingRewards_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  poolId?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  poolId_lt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_lte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  rate?: InputMaybe<Scalars['BigInt']['input']>
  rate_gt?: InputMaybe<Scalars['BigInt']['input']>
  rate_gte?: InputMaybe<Scalars['BigInt']['input']>
  rate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  rate_lt?: InputMaybe<Scalars['BigInt']['input']>
  rate_lte?: InputMaybe<Scalars['BigInt']['input']>
  rate_not?: InputMaybe<Scalars['BigInt']['input']>
  rate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  timestamp?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  user?: InputMaybe<Scalars['Bytes']['input']>
  user_contains?: InputMaybe<Scalars['Bytes']['input']>
  user_gt?: InputMaybe<Scalars['Bytes']['input']>
  user_gte?: InputMaybe<Scalars['Bytes']['input']>
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  user_lt?: InputMaybe<Scalars['Bytes']['input']>
  user_lte?: InputMaybe<Scalars['Bytes']['input']>
  user_not?: InputMaybe<Scalars['Bytes']['input']>
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
}

export enum UserInteraction_OrderBy {
  ClaimedRewards = 'claimedRewards',
  Deposited = 'deposited',
  Id = 'id',
  PendingRewards = 'pendingRewards',
  PoolId = 'poolId',
  Rate = 'rate',
  Timestamp = 'timestamp',
  User = 'user',
}

export type UserReferrer = {
  __typename?: 'UserReferrer'
  /** The amount of referred tokens */
  amount: Scalars['BigInt']['output']
  /** id forms from user address + referrer address + pool id  */
  id: Scalars['Bytes']['output']
  /** The pool ID */
  poolId: Scalars['BigInt']['output']
  /** The referrer address */
  referrer: Scalars['Bytes']['output']
  /** The timestamp of tx */
  timestamp: Scalars['BigInt']['output']
  /** The user address */
  user: Scalars['Bytes']['output']
}

export type UserReferrer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  amount?: InputMaybe<Scalars['BigInt']['input']>
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>
  amount_not?: InputMaybe<Scalars['BigInt']['input']>
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  and?: InputMaybe<Array<InputMaybe<UserReferrer_Filter>>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<UserReferrer_Filter>>>
  poolId?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  poolId_lt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_lte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  referrer?: InputMaybe<Scalars['Bytes']['input']>
  referrer_contains?: InputMaybe<Scalars['Bytes']['input']>
  referrer_gt?: InputMaybe<Scalars['Bytes']['input']>
  referrer_gte?: InputMaybe<Scalars['Bytes']['input']>
  referrer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  referrer_lt?: InputMaybe<Scalars['Bytes']['input']>
  referrer_lte?: InputMaybe<Scalars['Bytes']['input']>
  referrer_not?: InputMaybe<Scalars['Bytes']['input']>
  referrer_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  referrer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  timestamp?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  user?: InputMaybe<Scalars['Bytes']['input']>
  user_contains?: InputMaybe<Scalars['Bytes']['input']>
  user_gt?: InputMaybe<Scalars['Bytes']['input']>
  user_gte?: InputMaybe<Scalars['Bytes']['input']>
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  user_lt?: InputMaybe<Scalars['Bytes']['input']>
  user_lte?: InputMaybe<Scalars['Bytes']['input']>
  user_not?: InputMaybe<Scalars['Bytes']['input']>
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
}

export enum UserReferrer_OrderBy {
  Amount = 'amount',
  Id = 'id',
  PoolId = 'poolId',
  Referrer = 'referrer',
  Timestamp = 'timestamp',
  User = 'user',
}

export type UserStaked = {
  __typename?: 'UserStaked'
  amount: Scalars['BigInt']['output']
  blockNumber: Scalars['BigInt']['output']
  blockTimestamp: Scalars['BigInt']['output']
  id: Scalars['Bytes']['output']
  poolId: Scalars['BigInt']['output']
  transactionHash: Scalars['Bytes']['output']
  user: Scalars['Bytes']['output']
}

export type UserStaked_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  amount?: InputMaybe<Scalars['BigInt']['input']>
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>
  amount_not?: InputMaybe<Scalars['BigInt']['input']>
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  and?: InputMaybe<Array<InputMaybe<UserStaked_Filter>>>
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<UserStaked_Filter>>>
  poolId?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  poolId_lt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_lte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  user?: InputMaybe<Scalars['Bytes']['input']>
  user_contains?: InputMaybe<Scalars['Bytes']['input']>
  user_gt?: InputMaybe<Scalars['Bytes']['input']>
  user_gte?: InputMaybe<Scalars['Bytes']['input']>
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  user_lt?: InputMaybe<Scalars['Bytes']['input']>
  user_lte?: InputMaybe<Scalars['Bytes']['input']>
  user_not?: InputMaybe<Scalars['Bytes']['input']>
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
}

export enum UserStaked_OrderBy {
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  PoolId = 'poolId',
  TransactionHash = 'transactionHash',
  User = 'user',
}

export type UserWithdrawn = {
  __typename?: 'UserWithdrawn'
  amount: Scalars['BigInt']['output']
  blockNumber: Scalars['BigInt']['output']
  blockTimestamp: Scalars['BigInt']['output']
  id: Scalars['Bytes']['output']
  poolId: Scalars['BigInt']['output']
  transactionHash: Scalars['Bytes']['output']
  user: Scalars['Bytes']['output']
}

export type UserWithdrawn_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  amount?: InputMaybe<Scalars['BigInt']['input']>
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>
  amount_not?: InputMaybe<Scalars['BigInt']['input']>
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  and?: InputMaybe<Array<InputMaybe<UserWithdrawn_Filter>>>
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<UserWithdrawn_Filter>>>
  poolId?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_gte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  poolId_lt?: InputMaybe<Scalars['BigInt']['input']>
  poolId_lte?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not?: InputMaybe<Scalars['BigInt']['input']>
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  user?: InputMaybe<Scalars['Bytes']['input']>
  user_contains?: InputMaybe<Scalars['Bytes']['input']>
  user_gt?: InputMaybe<Scalars['Bytes']['input']>
  user_gte?: InputMaybe<Scalars['Bytes']['input']>
  user_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  user_lt?: InputMaybe<Scalars['Bytes']['input']>
  user_lte?: InputMaybe<Scalars['Bytes']['input']>
  user_not?: InputMaybe<Scalars['Bytes']['input']>
  user_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  user_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
}

export enum UserWithdrawn_OrderBy {
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  PoolId = 'poolId',
  TransactionHash = 'transactionHash',
  User = 'user',
}

export type User_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<User_Filter>>>
  id?: InputMaybe<Scalars['Bytes']['input']>
  id_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_gt?: InputMaybe<Scalars['Bytes']['input']>
  id_gte?: InputMaybe<Scalars['Bytes']['input']>
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  id_lt?: InputMaybe<Scalars['Bytes']['input']>
  id_lte?: InputMaybe<Scalars['Bytes']['input']>
  id_not?: InputMaybe<Scalars['Bytes']['input']>
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>
  or?: InputMaybe<Array<InputMaybe<User_Filter>>>
  totalClaimed?: InputMaybe<Scalars['BigInt']['input']>
  totalClaimed_gt?: InputMaybe<Scalars['BigInt']['input']>
  totalClaimed_gte?: InputMaybe<Scalars['BigInt']['input']>
  totalClaimed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  totalClaimed_lt?: InputMaybe<Scalars['BigInt']['input']>
  totalClaimed_lte?: InputMaybe<Scalars['BigInt']['input']>
  totalClaimed_not?: InputMaybe<Scalars['BigInt']['input']>
  totalClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>
}

export enum User_OrderBy {
  Id = 'id',
  TotalClaimed = 'totalClaimed',
}

export type _Block_ = {
  __typename?: '_Block_'
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>
  /** The block number */
  number: Scalars['Int']['output']
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>
}

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_'
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_
  /** The deployment ID */
  deployment: Scalars['String']['output']
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output']
}

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny',
}

export type GetTotalStakedPerDayQueryVariables = Exact<{
  date: Scalars['String']['input']
  timestamp: Scalars['BigInt']['input']
}>

export type GetTotalStakedPerDayQuery = {
  __typename?: 'Query'
  poolInteractions: Array<{ __typename?: 'PoolInteraction'; totalStaked: any }>
}

export type GetReferrersTotalClaimedQueryVariables = Exact<{
  poolId: Scalars['BigInt']['input']
  user: Scalars['Bytes']['input']
}>

export type GetReferrersTotalClaimedQuery = {
  __typename?: 'Query'
  referrers: Array<{ __typename?: 'Referrer'; totalClaimed: any }>
}

export type GetDepositedAmountUserReferrersQueryVariables = Exact<{
  poolId: Scalars['BigInt']['input']
  referrer: Scalars['Bytes']['input']
}>

export type GetDepositedAmountUserReferrersQuery = {
  __typename?: 'Query'
  userReferrers: Array<{ __typename?: 'UserReferrer'; amount: any }>
}

export type GetSpecificUserReferrersQueryVariables = Exact<{
  poolId: Scalars['BigInt']['input']
  referrer: Scalars['Bytes']['input']
  first: Scalars['Int']['input']
  skip: Scalars['Int']['input']
  orderDirection?: InputMaybe<OrderDirection>
}>

export type GetSpecificUserReferrersQuery = {
  __typename?: 'Query'
  userReferrers: Array<{
    __typename?: 'UserReferrer'
    amount: any
    id: any
    poolId: any
    user: any
  }>
}

export type GetUserYieldPerDayQueryVariables = Exact<{
  poolId: Scalars['BigInt']['input']
  poolIdBytes: Scalars['Bytes']['input']
  user: Scalars['Bytes']['input']
  fromTimestamp: Scalars['BigInt']['input']
  toTimestamp: Scalars['BigInt']['input']
}>

export type GetUserYieldPerDayQuery = {
  __typename?: 'Query'
  initialUserInteractions: Array<{
    __typename?: 'UserInteraction'
    timestamp: any
    rate: any
    deposited: any
    claimedRewards: any
    pendingRewards: any
  }>
  userInteractions: Array<{
    __typename?: 'UserInteraction'
    timestamp: any
    rate: any
    deposited: any
    claimedRewards: any
    pendingRewards: any
  }>
  poolInteractions: Array<{
    __typename?: 'PoolInteraction'
    timestamp: any
    rate: any
  }>
}

export const GetTotalStakedPerDay = gql`
  query GetTotalStakedPerDay($date: String!, $timestamp: BigInt!) {
    poolInteractions(
      first: 1
      orderDirection: desc
      where: { timestamp_lte: $timestamp, pool: $date }
      orderBy: timestamp
    ) {
      totalStaked
    }
  }
`
export const GetReferrersTotalClaimed = gql`
  query GetReferrersTotalClaimed($poolId: BigInt!, $user: Bytes!) {
    referrers(where: { user: $user, poolId: $poolId }) {
      totalClaimed
    }
  }
`
export const GetDepositedAmountUserReferrers = gql`
  query GetDepositedAmountUserReferrers($poolId: BigInt!, $referrer: Bytes!) {
    userReferrers(
      where: { poolId: $poolId, referrer: $referrer, amount_gt: "0" }
    ) {
      amount
    }
  }
`
export const GetSpecificUserReferrers = gql`
  query GetSpecificUserReferrers(
    $poolId: BigInt!
    $referrer: Bytes!
    $first: Int!
    $skip: Int!
    $orderDirection: OrderDirection
  ) {
    userReferrers(
      where: { poolId: $poolId, referrer: $referrer, amount_gt: "0" }
      first: $first
      skip: $skip
      orderDirection: $orderDirection
    ) {
      amount
      id
      poolId
      user
    }
  }
`
export const GetUserYieldPerDay = gql`
  query GetUserYieldPerDay(
    $poolId: BigInt!
    $poolIdBytes: Bytes!
    $user: Bytes!
    $fromTimestamp: BigInt!
    $toTimestamp: BigInt!
  ) {
    initialUserInteractions: userInteractions(
      orderBy: timestamp
      orderDirection: desc
      where: { user: $user, poolId: $poolId, timestamp_lt: $fromTimestamp }
      first: 1
    ) {
      timestamp
      rate
      deposited
      claimedRewards
      pendingRewards
    }
    userInteractions(
      orderBy: timestamp
      orderDirection: asc
      where: {
        user: $user
        poolId: $poolId
        timestamp_gt: $fromTimestamp
        timestamp_lt: $toTimestamp
      }
    ) {
      timestamp
      rate
      deposited
      claimedRewards
      pendingRewards
    }
    poolInteractions(
      orderBy: timestamp
      orderDirection: desc
      where: {
        rate_gt: 0
        timestamp_lt: $toTimestamp
        pool_: { id: $poolIdBytes }
      }
      first: 1
    ) {
      timestamp
      rate
    }
  }
`
