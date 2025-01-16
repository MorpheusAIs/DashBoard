import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
  Int8: any;
  Timestamp: any;
};

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type BuildersProject = {
  __typename?: 'BuildersProject';
  admin: Scalars['Bytes'];
  claimLockEnd: Scalars['BigInt'];
  id: Scalars['Bytes'];
  minimalDeposit: Scalars['BigInt'];
  name: Scalars['String'];
  startsAt: Scalars['BigInt'];
  totalClaimed: Scalars['BigInt'];
  totalStaked: Scalars['BigInt'];
  totalUsers: Scalars['BigInt'];
  withdrawLockPeriodAfterDeposit: Scalars['BigInt'];
};

export type BuildersProject_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  admin?: InputMaybe<Scalars['Bytes']>;
  admin_contains?: InputMaybe<Scalars['Bytes']>;
  admin_gt?: InputMaybe<Scalars['Bytes']>;
  admin_gte?: InputMaybe<Scalars['Bytes']>;
  admin_in?: InputMaybe<Array<Scalars['Bytes']>>;
  admin_lt?: InputMaybe<Scalars['Bytes']>;
  admin_lte?: InputMaybe<Scalars['Bytes']>;
  admin_not?: InputMaybe<Scalars['Bytes']>;
  admin_not_contains?: InputMaybe<Scalars['Bytes']>;
  admin_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  and?: InputMaybe<Array<InputMaybe<BuildersProject_Filter>>>;
  claimLockEnd?: InputMaybe<Scalars['BigInt']>;
  claimLockEnd_gt?: InputMaybe<Scalars['BigInt']>;
  claimLockEnd_gte?: InputMaybe<Scalars['BigInt']>;
  claimLockEnd_in?: InputMaybe<Array<Scalars['BigInt']>>;
  claimLockEnd_lt?: InputMaybe<Scalars['BigInt']>;
  claimLockEnd_lte?: InputMaybe<Scalars['BigInt']>;
  claimLockEnd_not?: InputMaybe<Scalars['BigInt']>;
  claimLockEnd_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  minimalDeposit?: InputMaybe<Scalars['BigInt']>;
  minimalDeposit_gt?: InputMaybe<Scalars['BigInt']>;
  minimalDeposit_gte?: InputMaybe<Scalars['BigInt']>;
  minimalDeposit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  minimalDeposit_lt?: InputMaybe<Scalars['BigInt']>;
  minimalDeposit_lte?: InputMaybe<Scalars['BigInt']>;
  minimalDeposit_not?: InputMaybe<Scalars['BigInt']>;
  minimalDeposit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  or?: InputMaybe<Array<InputMaybe<BuildersProject_Filter>>>;
  startsAt?: InputMaybe<Scalars['BigInt']>;
  startsAt_gt?: InputMaybe<Scalars['BigInt']>;
  startsAt_gte?: InputMaybe<Scalars['BigInt']>;
  startsAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startsAt_lt?: InputMaybe<Scalars['BigInt']>;
  startsAt_lte?: InputMaybe<Scalars['BigInt']>;
  startsAt_not?: InputMaybe<Scalars['BigInt']>;
  startsAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalClaimed?: InputMaybe<Scalars['BigInt']>;
  totalClaimed_gt?: InputMaybe<Scalars['BigInt']>;
  totalClaimed_gte?: InputMaybe<Scalars['BigInt']>;
  totalClaimed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalClaimed_lt?: InputMaybe<Scalars['BigInt']>;
  totalClaimed_lte?: InputMaybe<Scalars['BigInt']>;
  totalClaimed_not?: InputMaybe<Scalars['BigInt']>;
  totalClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStaked?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_lte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalUsers?: InputMaybe<Scalars['BigInt']>;
  totalUsers_gt?: InputMaybe<Scalars['BigInt']>;
  totalUsers_gte?: InputMaybe<Scalars['BigInt']>;
  totalUsers_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalUsers_lt?: InputMaybe<Scalars['BigInt']>;
  totalUsers_lte?: InputMaybe<Scalars['BigInt']>;
  totalUsers_not?: InputMaybe<Scalars['BigInt']>;
  totalUsers_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  withdrawLockPeriodAfterDeposit?: InputMaybe<Scalars['BigInt']>;
  withdrawLockPeriodAfterDeposit_gt?: InputMaybe<Scalars['BigInt']>;
  withdrawLockPeriodAfterDeposit_gte?: InputMaybe<Scalars['BigInt']>;
  withdrawLockPeriodAfterDeposit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  withdrawLockPeriodAfterDeposit_lt?: InputMaybe<Scalars['BigInt']>;
  withdrawLockPeriodAfterDeposit_lte?: InputMaybe<Scalars['BigInt']>;
  withdrawLockPeriodAfterDeposit_not?: InputMaybe<Scalars['BigInt']>;
  withdrawLockPeriodAfterDeposit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum BuildersProject_OrderBy {
  Admin = 'admin',
  ClaimLockEnd = 'claimLockEnd',
  Id = 'id',
  MinimalDeposit = 'minimalDeposit',
  Name = 'name',
  StartsAt = 'startsAt',
  TotalClaimed = 'totalClaimed',
  TotalStaked = 'totalStaked',
  TotalUsers = 'totalUsers',
  WithdrawLockPeriodAfterDeposit = 'withdrawLockPeriodAfterDeposit'
}

export type BuildersUser = {
  __typename?: 'BuildersUser';
  address: Scalars['Bytes'];
  buildersProjectId: Scalars['Bytes'];
  id: Scalars['Bytes'];
  lastStake: Scalars['BigInt'];
  staked: Scalars['BigInt'];
};

export type BuildersUser_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_gt?: InputMaybe<Scalars['Bytes']>;
  address_gte?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_lt?: InputMaybe<Scalars['Bytes']>;
  address_lte?: InputMaybe<Scalars['Bytes']>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  and?: InputMaybe<Array<InputMaybe<BuildersUser_Filter>>>;
  buildersProjectId?: InputMaybe<Scalars['Bytes']>;
  buildersProjectId_contains?: InputMaybe<Scalars['Bytes']>;
  buildersProjectId_gt?: InputMaybe<Scalars['Bytes']>;
  buildersProjectId_gte?: InputMaybe<Scalars['Bytes']>;
  buildersProjectId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  buildersProjectId_lt?: InputMaybe<Scalars['Bytes']>;
  buildersProjectId_lte?: InputMaybe<Scalars['Bytes']>;
  buildersProjectId_not?: InputMaybe<Scalars['Bytes']>;
  buildersProjectId_not_contains?: InputMaybe<Scalars['Bytes']>;
  buildersProjectId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lastStake?: InputMaybe<Scalars['BigInt']>;
  lastStake_gt?: InputMaybe<Scalars['BigInt']>;
  lastStake_gte?: InputMaybe<Scalars['BigInt']>;
  lastStake_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastStake_lt?: InputMaybe<Scalars['BigInt']>;
  lastStake_lte?: InputMaybe<Scalars['BigInt']>;
  lastStake_not?: InputMaybe<Scalars['BigInt']>;
  lastStake_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  or?: InputMaybe<Array<InputMaybe<BuildersUser_Filter>>>;
  staked?: InputMaybe<Scalars['BigInt']>;
  staked_gt?: InputMaybe<Scalars['BigInt']>;
  staked_gte?: InputMaybe<Scalars['BigInt']>;
  staked_in?: InputMaybe<Array<Scalars['BigInt']>>;
  staked_lt?: InputMaybe<Scalars['BigInt']>;
  staked_lte?: InputMaybe<Scalars['BigInt']>;
  staked_not?: InputMaybe<Scalars['BigInt']>;
  staked_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum BuildersUser_OrderBy {
  Address = 'address',
  BuildersProjectId = 'buildersProjectId',
  Id = 'id',
  LastStake = 'lastStake',
  Staked = 'staked'
}

export type Counter = {
  __typename?: 'Counter';
  id: Scalars['Bytes'];
  totalBuildersProjects: Scalars['BigInt'];
  totalSubnets: Scalars['BigInt'];
};

export type Counter_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Counter_Filter>>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<Counter_Filter>>>;
  totalBuildersProjects?: InputMaybe<Scalars['BigInt']>;
  totalBuildersProjects_gt?: InputMaybe<Scalars['BigInt']>;
  totalBuildersProjects_gte?: InputMaybe<Scalars['BigInt']>;
  totalBuildersProjects_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalBuildersProjects_lt?: InputMaybe<Scalars['BigInt']>;
  totalBuildersProjects_lte?: InputMaybe<Scalars['BigInt']>;
  totalBuildersProjects_not?: InputMaybe<Scalars['BigInt']>;
  totalBuildersProjects_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSubnets?: InputMaybe<Scalars['BigInt']>;
  totalSubnets_gt?: InputMaybe<Scalars['BigInt']>;
  totalSubnets_gte?: InputMaybe<Scalars['BigInt']>;
  totalSubnets_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSubnets_lt?: InputMaybe<Scalars['BigInt']>;
  totalSubnets_lte?: InputMaybe<Scalars['BigInt']>;
  totalSubnets_not?: InputMaybe<Scalars['BigInt']>;
  totalSubnets_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Counter_OrderBy {
  Id = 'id',
  TotalBuildersProjects = 'totalBuildersProjects',
  TotalSubnets = 'totalSubnets'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Provider = {
  __typename?: 'Provider';
  endpoint: Scalars['String'];
  id: Scalars['Bytes'];
  stake: Scalars['BigInt'];
};

export type Provider_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Provider_Filter>>>;
  endpoint?: InputMaybe<Scalars['String']>;
  endpoint_contains?: InputMaybe<Scalars['String']>;
  endpoint_contains_nocase?: InputMaybe<Scalars['String']>;
  endpoint_ends_with?: InputMaybe<Scalars['String']>;
  endpoint_ends_with_nocase?: InputMaybe<Scalars['String']>;
  endpoint_gt?: InputMaybe<Scalars['String']>;
  endpoint_gte?: InputMaybe<Scalars['String']>;
  endpoint_in?: InputMaybe<Array<Scalars['String']>>;
  endpoint_lt?: InputMaybe<Scalars['String']>;
  endpoint_lte?: InputMaybe<Scalars['String']>;
  endpoint_not?: InputMaybe<Scalars['String']>;
  endpoint_not_contains?: InputMaybe<Scalars['String']>;
  endpoint_not_contains_nocase?: InputMaybe<Scalars['String']>;
  endpoint_not_ends_with?: InputMaybe<Scalars['String']>;
  endpoint_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  endpoint_not_in?: InputMaybe<Array<Scalars['String']>>;
  endpoint_not_starts_with?: InputMaybe<Scalars['String']>;
  endpoint_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  endpoint_starts_with?: InputMaybe<Scalars['String']>;
  endpoint_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<Provider_Filter>>>;
  stake?: InputMaybe<Scalars['BigInt']>;
  stake_gt?: InputMaybe<Scalars['BigInt']>;
  stake_gte?: InputMaybe<Scalars['BigInt']>;
  stake_in?: InputMaybe<Array<Scalars['BigInt']>>;
  stake_lt?: InputMaybe<Scalars['BigInt']>;
  stake_lte?: InputMaybe<Scalars['BigInt']>;
  stake_not?: InputMaybe<Scalars['BigInt']>;
  stake_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Provider_OrderBy {
  Endpoint = 'endpoint',
  Id = 'id',
  Stake = 'stake'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  buildersProject?: Maybe<BuildersProject>;
  buildersProjects: Array<BuildersProject>;
  buildersUser?: Maybe<BuildersUser>;
  buildersUsers: Array<BuildersUser>;
  counter?: Maybe<Counter>;
  counters: Array<Counter>;
  provider?: Maybe<Provider>;
  providers: Array<Provider>;
  subnet?: Maybe<Subnet>;
  subnetUser?: Maybe<SubnetUser>;
  subnetUsers: Array<SubnetUser>;
  subnets: Array<Subnet>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryBuildersProjectArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBuildersProjectsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuildersProject_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BuildersProject_Filter>;
};


export type QueryBuildersUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBuildersUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuildersUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BuildersUser_Filter>;
};


export type QueryCounterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCountersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Counter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Counter_Filter>;
};


export type QueryProviderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProvidersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Provider_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Provider_Filter>;
};


export type QuerySubnetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySubnetUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySubnetUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SubnetUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SubnetUser_Filter>;
};


export type QuerySubnetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Subnet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Subnet_Filter>;
};

export type Subnet = {
  __typename?: 'Subnet';
  createdAt: Scalars['BigInt'];
  deregistrationOpensAt: Scalars['BigInt'];
  endpoint: Scalars['String'];
  fee: Scalars['BigInt'];
  id: Scalars['Bytes'];
  isDeregistered: Scalars['Boolean'];
  name: Scalars['String'];
  owner: Scalars['Bytes'];
  totalClaimed: Scalars['BigInt'];
  totalStaked: Scalars['BigInt'];
  totalUsers: Scalars['BigInt'];
};

export type SubnetUser = {
  __typename?: 'SubnetUser';
  address: Scalars['Bytes'];
  claimed: Scalars['BigInt'];
  id: Scalars['Bytes'];
  staked: Scalars['BigInt'];
  subnet: Subnet;
};

export type SubnetUser_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_gt?: InputMaybe<Scalars['Bytes']>;
  address_gte?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_lt?: InputMaybe<Scalars['Bytes']>;
  address_lte?: InputMaybe<Scalars['Bytes']>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  and?: InputMaybe<Array<InputMaybe<SubnetUser_Filter>>>;
  claimed?: InputMaybe<Scalars['BigInt']>;
  claimed_gt?: InputMaybe<Scalars['BigInt']>;
  claimed_gte?: InputMaybe<Scalars['BigInt']>;
  claimed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  claimed_lt?: InputMaybe<Scalars['BigInt']>;
  claimed_lte?: InputMaybe<Scalars['BigInt']>;
  claimed_not?: InputMaybe<Scalars['BigInt']>;
  claimed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<SubnetUser_Filter>>>;
  staked?: InputMaybe<Scalars['BigInt']>;
  staked_gt?: InputMaybe<Scalars['BigInt']>;
  staked_gte?: InputMaybe<Scalars['BigInt']>;
  staked_in?: InputMaybe<Array<Scalars['BigInt']>>;
  staked_lt?: InputMaybe<Scalars['BigInt']>;
  staked_lte?: InputMaybe<Scalars['BigInt']>;
  staked_not?: InputMaybe<Scalars['BigInt']>;
  staked_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  subnet?: InputMaybe<Scalars['String']>;
  subnet_?: InputMaybe<Subnet_Filter>;
  subnet_contains?: InputMaybe<Scalars['String']>;
  subnet_contains_nocase?: InputMaybe<Scalars['String']>;
  subnet_ends_with?: InputMaybe<Scalars['String']>;
  subnet_ends_with_nocase?: InputMaybe<Scalars['String']>;
  subnet_gt?: InputMaybe<Scalars['String']>;
  subnet_gte?: InputMaybe<Scalars['String']>;
  subnet_in?: InputMaybe<Array<Scalars['String']>>;
  subnet_lt?: InputMaybe<Scalars['String']>;
  subnet_lte?: InputMaybe<Scalars['String']>;
  subnet_not?: InputMaybe<Scalars['String']>;
  subnet_not_contains?: InputMaybe<Scalars['String']>;
  subnet_not_contains_nocase?: InputMaybe<Scalars['String']>;
  subnet_not_ends_with?: InputMaybe<Scalars['String']>;
  subnet_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  subnet_not_in?: InputMaybe<Array<Scalars['String']>>;
  subnet_not_starts_with?: InputMaybe<Scalars['String']>;
  subnet_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  subnet_starts_with?: InputMaybe<Scalars['String']>;
  subnet_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum SubnetUser_OrderBy {
  Address = 'address',
  Claimed = 'claimed',
  Id = 'id',
  Staked = 'staked',
  Subnet = 'subnet',
  SubnetCreatedAt = 'subnet__createdAt',
  SubnetDeregistrationOpensAt = 'subnet__deregistrationOpensAt',
  SubnetEndpoint = 'subnet__endpoint',
  SubnetFee = 'subnet__fee',
  SubnetId = 'subnet__id',
  SubnetIsDeregistered = 'subnet__isDeregistered',
  SubnetName = 'subnet__name',
  SubnetOwner = 'subnet__owner',
  SubnetTotalClaimed = 'subnet__totalClaimed',
  SubnetTotalStaked = 'subnet__totalStaked',
  SubnetTotalUsers = 'subnet__totalUsers'
}

export type Subnet_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Subnet_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  deregistrationOpensAt?: InputMaybe<Scalars['BigInt']>;
  deregistrationOpensAt_gt?: InputMaybe<Scalars['BigInt']>;
  deregistrationOpensAt_gte?: InputMaybe<Scalars['BigInt']>;
  deregistrationOpensAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  deregistrationOpensAt_lt?: InputMaybe<Scalars['BigInt']>;
  deregistrationOpensAt_lte?: InputMaybe<Scalars['BigInt']>;
  deregistrationOpensAt_not?: InputMaybe<Scalars['BigInt']>;
  deregistrationOpensAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  endpoint?: InputMaybe<Scalars['String']>;
  endpoint_contains?: InputMaybe<Scalars['String']>;
  endpoint_contains_nocase?: InputMaybe<Scalars['String']>;
  endpoint_ends_with?: InputMaybe<Scalars['String']>;
  endpoint_ends_with_nocase?: InputMaybe<Scalars['String']>;
  endpoint_gt?: InputMaybe<Scalars['String']>;
  endpoint_gte?: InputMaybe<Scalars['String']>;
  endpoint_in?: InputMaybe<Array<Scalars['String']>>;
  endpoint_lt?: InputMaybe<Scalars['String']>;
  endpoint_lte?: InputMaybe<Scalars['String']>;
  endpoint_not?: InputMaybe<Scalars['String']>;
  endpoint_not_contains?: InputMaybe<Scalars['String']>;
  endpoint_not_contains_nocase?: InputMaybe<Scalars['String']>;
  endpoint_not_ends_with?: InputMaybe<Scalars['String']>;
  endpoint_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  endpoint_not_in?: InputMaybe<Array<Scalars['String']>>;
  endpoint_not_starts_with?: InputMaybe<Scalars['String']>;
  endpoint_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  endpoint_starts_with?: InputMaybe<Scalars['String']>;
  endpoint_starts_with_nocase?: InputMaybe<Scalars['String']>;
  fee?: InputMaybe<Scalars['BigInt']>;
  fee_gt?: InputMaybe<Scalars['BigInt']>;
  fee_gte?: InputMaybe<Scalars['BigInt']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee_lt?: InputMaybe<Scalars['BigInt']>;
  fee_lte?: InputMaybe<Scalars['BigInt']>;
  fee_not?: InputMaybe<Scalars['BigInt']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  isDeregistered?: InputMaybe<Scalars['Boolean']>;
  isDeregistered_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isDeregistered_not?: InputMaybe<Scalars['Boolean']>;
  isDeregistered_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  or?: InputMaybe<Array<InputMaybe<Subnet_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_gt?: InputMaybe<Scalars['Bytes']>;
  owner_gte?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']>;
  owner_lte?: InputMaybe<Scalars['Bytes']>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  totalClaimed?: InputMaybe<Scalars['BigInt']>;
  totalClaimed_gt?: InputMaybe<Scalars['BigInt']>;
  totalClaimed_gte?: InputMaybe<Scalars['BigInt']>;
  totalClaimed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalClaimed_lt?: InputMaybe<Scalars['BigInt']>;
  totalClaimed_lte?: InputMaybe<Scalars['BigInt']>;
  totalClaimed_not?: InputMaybe<Scalars['BigInt']>;
  totalClaimed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStaked?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_lte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalUsers?: InputMaybe<Scalars['BigInt']>;
  totalUsers_gt?: InputMaybe<Scalars['BigInt']>;
  totalUsers_gte?: InputMaybe<Scalars['BigInt']>;
  totalUsers_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalUsers_lt?: InputMaybe<Scalars['BigInt']>;
  totalUsers_lte?: InputMaybe<Scalars['BigInt']>;
  totalUsers_not?: InputMaybe<Scalars['BigInt']>;
  totalUsers_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Subnet_OrderBy {
  CreatedAt = 'createdAt',
  DeregistrationOpensAt = 'deregistrationOpensAt',
  Endpoint = 'endpoint',
  Fee = 'fee',
  Id = 'id',
  IsDeregistered = 'isDeregistered',
  Name = 'name',
  Owner = 'owner',
  TotalClaimed = 'totalClaimed',
  TotalStaked = 'totalStaked',
  TotalUsers = 'totalUsers'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  buildersProject?: Maybe<BuildersProject>;
  buildersProjects: Array<BuildersProject>;
  buildersUser?: Maybe<BuildersUser>;
  buildersUsers: Array<BuildersUser>;
  counter?: Maybe<Counter>;
  counters: Array<Counter>;
  provider?: Maybe<Provider>;
  providers: Array<Provider>;
  subnet?: Maybe<Subnet>;
  subnetUser?: Maybe<SubnetUser>;
  subnetUsers: Array<SubnetUser>;
  subnets: Array<Subnet>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionBuildersProjectArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBuildersProjectsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuildersProject_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BuildersProject_Filter>;
};


export type SubscriptionBuildersUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBuildersUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuildersUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BuildersUser_Filter>;
};


export type SubscriptionCounterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCountersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Counter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Counter_Filter>;
};


export type SubscriptionProviderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProvidersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Provider_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Provider_Filter>;
};


export type SubscriptionSubnetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSubnetUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSubnetUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SubnetUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SubnetUser_Filter>;
};


export type SubscriptionSubnetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Subnet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Subnet_Filter>;
};

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type BuilderProjectFragment = { __typename?: 'BuildersProject', admin: any, claimLockEnd: any, id: any, minimalDeposit: any, name: string, startsAt: any, totalClaimed: any, totalStaked: any, totalUsers: any, withdrawLockPeriodAfterDeposit: any };

export type GetBuildersProjectsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuildersProject_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;


export type GetBuildersProjectsQuery = { __typename?: 'Query', buildersProjects: Array<{ __typename?: 'BuildersProject', admin: any, claimLockEnd: any, id: any, minimalDeposit: any, name: string, startsAt: any, totalClaimed: any, totalStaked: any, totalUsers: any, withdrawLockPeriodAfterDeposit: any }> };

export type GetBuildersProjectsByIdsQueryVariables = Exact<{
  id_in?: InputMaybe<Array<Scalars['Bytes']> | Scalars['Bytes']>;
}>;


export type GetBuildersProjectsByIdsQuery = { __typename?: 'Query', buildersProjects: Array<{ __typename?: 'BuildersProject', admin: any, claimLockEnd: any, id: any, minimalDeposit: any, name: string, startsAt: any, totalClaimed: any, totalStaked: any, totalUsers: any, withdrawLockPeriodAfterDeposit: any }> };

export type GetBuildersProjectQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
}>;


export type GetBuildersProjectQuery = { __typename?: 'Query', buildersProject?: { __typename?: 'BuildersProject', admin: any, claimLockEnd: any, id: any, minimalDeposit: any, name: string, startsAt: any, totalClaimed: any, totalStaked: any, totalUsers: any, withdrawLockPeriodAfterDeposit: any } | null };

export type GetAccountUserBuildersProjectsIdsQueryVariables = Exact<{
  address?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetAccountUserBuildersProjectsIdsQuery = { __typename?: 'Query', buildersUsers: Array<{ __typename?: 'BuildersUser', buildersProjectId: any }> };

export type GetBuildersProjectUsersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  buildersProjectId?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetBuildersProjectUsersQuery = { __typename?: 'Query', buildersUsers: Array<{ __typename?: 'BuildersUser', address: any, buildersProjectId: any, id: any, staked: any, lastStake: any }> };

export type GetUserAccountBuildersProjectQueryVariables = Exact<{
  buildersProjectId?: InputMaybe<Scalars['Bytes']>;
  address?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetUserAccountBuildersProjectQuery = { __typename?: 'Query', buildersUsers: Array<{ __typename?: 'BuildersUser', id: any, staked: any, lastStake: any }> };

export type GetBuildersCountersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBuildersCountersQuery = { __typename?: 'Query', counters: Array<{ __typename?: 'Counter', id: any, totalBuildersProjects: any, totalSubnets: any }> };

export const BuilderProject = gql`
    fragment BuilderProject on BuildersProject {
  admin
  claimLockEnd
  id
  minimalDeposit
  name
  startsAt
  totalClaimed
  totalStaked
  totalUsers
  withdrawLockPeriodAfterDeposit
}
    `;
export const GetBuildersProjects = gql`
    query getBuildersProjects($first: Int = 10, $skip: Int = 10, $orderBy: BuildersProject_orderBy, $orderDirection: OrderDirection) {
  buildersProjects(
    first: $first
    skip: $skip
    orderBy: $orderBy
    orderDirection: $orderDirection
  ) {
    ...BuilderProject
  }
}
    ${BuilderProject}`;
export const GetBuildersProjectsByIds = gql`
    query getBuildersProjectsByIds($id_in: [Bytes!] = "") {
  buildersProjects(where: {id_in: $id_in}) {
    ...BuilderProject
  }
}
    ${BuilderProject}`;
export const GetBuildersProject = gql`
    query getBuildersProject($id: ID = "") {
  buildersProject(id: $id) {
    ...BuilderProject
  }
}
    ${BuilderProject}`;
export const GetAccountUserBuildersProjectsIds = gql`
    query GetAccountUserBuildersProjectsIds($address: Bytes = "") {
  buildersUsers(where: {address: $address}) {
    buildersProjectId
  }
}
    `;
export const GetBuildersProjectUsers = gql`
    query getBuildersProjectUsers($first: Int = 10, $skip: Int = 10, $buildersProjectId: Bytes = "") {
  buildersUsers(
    first: $first
    skip: $skip
    where: {buildersProjectId: $buildersProjectId}
  ) {
    address
    buildersProjectId
    id
    staked
    lastStake
  }
}
    `;
export const GetUserAccountBuildersProject = gql`
    query getUserAccountBuildersProject($buildersProjectId: Bytes = "", $address: Bytes = "") {
  buildersUsers(where: {buildersProjectId: $buildersProjectId, address: $address}) {
    id
    staked
    lastStake
  }
}
    `;
export const GetBuildersCounters = gql`
    query GetBuildersCounters {
  counters {
    id
    totalBuildersProjects
    totalSubnets
  }
}
    `;