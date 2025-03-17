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

export type BuilderSubnet = {
  __typename?: 'BuilderSubnet';
  builderUsers: Array<BuilderUser>;
  description: Scalars['String'];
  fee: Scalars['BigInt'];
  feeTreasury: Scalars['Bytes'];
  id: Scalars['Bytes'];
  image: Scalars['String'];
  maxClaimLockEnd: Scalars['BigInt'];
  minStake: Scalars['BigInt'];
  name: Scalars['String'];
  owner: Scalars['Bytes'];
  slug: Scalars['String'];
  startsAt: Scalars['BigInt'];
  totalClaimed: Scalars['BigInt'];
  totalStaked: Scalars['BigInt'];
  totalUsers: Scalars['BigInt'];
  website: Scalars['String'];
  withdrawLockPeriodAfterStake: Scalars['BigInt'];
};


export type BuilderSubnetBuilderUsersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuilderUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<BuilderUser_Filter>;
};

export type BuilderSubnet_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<BuilderSubnet_Filter>>>;
  builderUsers_?: InputMaybe<BuilderUser_Filter>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_contains_nocase?: InputMaybe<Scalars['String']>;
  description_ends_with?: InputMaybe<Scalars['String']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']>;
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_starts_with?: InputMaybe<Scalars['String']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']>;
  fee?: InputMaybe<Scalars['BigInt']>;
  feeTreasury?: InputMaybe<Scalars['Bytes']>;
  feeTreasury_contains?: InputMaybe<Scalars['Bytes']>;
  feeTreasury_gt?: InputMaybe<Scalars['Bytes']>;
  feeTreasury_gte?: InputMaybe<Scalars['Bytes']>;
  feeTreasury_in?: InputMaybe<Array<Scalars['Bytes']>>;
  feeTreasury_lt?: InputMaybe<Scalars['Bytes']>;
  feeTreasury_lte?: InputMaybe<Scalars['Bytes']>;
  feeTreasury_not?: InputMaybe<Scalars['Bytes']>;
  feeTreasury_not_contains?: InputMaybe<Scalars['Bytes']>;
  feeTreasury_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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
  image?: InputMaybe<Scalars['String']>;
  image_contains?: InputMaybe<Scalars['String']>;
  image_contains_nocase?: InputMaybe<Scalars['String']>;
  image_ends_with?: InputMaybe<Scalars['String']>;
  image_ends_with_nocase?: InputMaybe<Scalars['String']>;
  image_gt?: InputMaybe<Scalars['String']>;
  image_gte?: InputMaybe<Scalars['String']>;
  image_in?: InputMaybe<Array<Scalars['String']>>;
  image_lt?: InputMaybe<Scalars['String']>;
  image_lte?: InputMaybe<Scalars['String']>;
  image_not?: InputMaybe<Scalars['String']>;
  image_not_contains?: InputMaybe<Scalars['String']>;
  image_not_contains_nocase?: InputMaybe<Scalars['String']>;
  image_not_ends_with?: InputMaybe<Scalars['String']>;
  image_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  image_not_in?: InputMaybe<Array<Scalars['String']>>;
  image_not_starts_with?: InputMaybe<Scalars['String']>;
  image_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  image_starts_with?: InputMaybe<Scalars['String']>;
  image_starts_with_nocase?: InputMaybe<Scalars['String']>;
  maxClaimLockEnd?: InputMaybe<Scalars['BigInt']>;
  maxClaimLockEnd_gt?: InputMaybe<Scalars['BigInt']>;
  maxClaimLockEnd_gte?: InputMaybe<Scalars['BigInt']>;
  maxClaimLockEnd_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxClaimLockEnd_lt?: InputMaybe<Scalars['BigInt']>;
  maxClaimLockEnd_lte?: InputMaybe<Scalars['BigInt']>;
  maxClaimLockEnd_not?: InputMaybe<Scalars['BigInt']>;
  maxClaimLockEnd_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  minStake?: InputMaybe<Scalars['BigInt']>;
  minStake_gt?: InputMaybe<Scalars['BigInt']>;
  minStake_gte?: InputMaybe<Scalars['BigInt']>;
  minStake_in?: InputMaybe<Array<Scalars['BigInt']>>;
  minStake_lt?: InputMaybe<Scalars['BigInt']>;
  minStake_lte?: InputMaybe<Scalars['BigInt']>;
  minStake_not?: InputMaybe<Scalars['BigInt']>;
  minStake_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  or?: InputMaybe<Array<InputMaybe<BuilderSubnet_Filter>>>;
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
  slug?: InputMaybe<Scalars['String']>;
  slug_contains?: InputMaybe<Scalars['String']>;
  slug_contains_nocase?: InputMaybe<Scalars['String']>;
  slug_ends_with?: InputMaybe<Scalars['String']>;
  slug_ends_with_nocase?: InputMaybe<Scalars['String']>;
  slug_gt?: InputMaybe<Scalars['String']>;
  slug_gte?: InputMaybe<Scalars['String']>;
  slug_in?: InputMaybe<Array<Scalars['String']>>;
  slug_lt?: InputMaybe<Scalars['String']>;
  slug_lte?: InputMaybe<Scalars['String']>;
  slug_not?: InputMaybe<Scalars['String']>;
  slug_not_contains?: InputMaybe<Scalars['String']>;
  slug_not_contains_nocase?: InputMaybe<Scalars['String']>;
  slug_not_ends_with?: InputMaybe<Scalars['String']>;
  slug_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  slug_not_in?: InputMaybe<Array<Scalars['String']>>;
  slug_not_starts_with?: InputMaybe<Scalars['String']>;
  slug_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  slug_starts_with?: InputMaybe<Scalars['String']>;
  slug_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  website?: InputMaybe<Scalars['String']>;
  website_contains?: InputMaybe<Scalars['String']>;
  website_contains_nocase?: InputMaybe<Scalars['String']>;
  website_ends_with?: InputMaybe<Scalars['String']>;
  website_ends_with_nocase?: InputMaybe<Scalars['String']>;
  website_gt?: InputMaybe<Scalars['String']>;
  website_gte?: InputMaybe<Scalars['String']>;
  website_in?: InputMaybe<Array<Scalars['String']>>;
  website_lt?: InputMaybe<Scalars['String']>;
  website_lte?: InputMaybe<Scalars['String']>;
  website_not?: InputMaybe<Scalars['String']>;
  website_not_contains?: InputMaybe<Scalars['String']>;
  website_not_contains_nocase?: InputMaybe<Scalars['String']>;
  website_not_ends_with?: InputMaybe<Scalars['String']>;
  website_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  website_not_in?: InputMaybe<Array<Scalars['String']>>;
  website_not_starts_with?: InputMaybe<Scalars['String']>;
  website_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  website_starts_with?: InputMaybe<Scalars['String']>;
  website_starts_with_nocase?: InputMaybe<Scalars['String']>;
  withdrawLockPeriodAfterStake?: InputMaybe<Scalars['BigInt']>;
  withdrawLockPeriodAfterStake_gt?: InputMaybe<Scalars['BigInt']>;
  withdrawLockPeriodAfterStake_gte?: InputMaybe<Scalars['BigInt']>;
  withdrawLockPeriodAfterStake_in?: InputMaybe<Array<Scalars['BigInt']>>;
  withdrawLockPeriodAfterStake_lt?: InputMaybe<Scalars['BigInt']>;
  withdrawLockPeriodAfterStake_lte?: InputMaybe<Scalars['BigInt']>;
  withdrawLockPeriodAfterStake_not?: InputMaybe<Scalars['BigInt']>;
  withdrawLockPeriodAfterStake_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum BuilderSubnet_OrderBy {
  BuilderUsers = 'builderUsers',
  Description = 'description',
  Fee = 'fee',
  FeeTreasury = 'feeTreasury',
  Id = 'id',
  Image = 'image',
  MaxClaimLockEnd = 'maxClaimLockEnd',
  MinStake = 'minStake',
  Name = 'name',
  Owner = 'owner',
  Slug = 'slug',
  StartsAt = 'startsAt',
  TotalClaimed = 'totalClaimed',
  TotalStaked = 'totalStaked',
  TotalUsers = 'totalUsers',
  Website = 'website',
  WithdrawLockPeriodAfterStake = 'withdrawLockPeriodAfterStake'
}

export type BuilderUser = {
  __typename?: 'BuilderUser';
  address: Scalars['Bytes'];
  builderSubnet: BuilderSubnet;
  claimLockEnd: Scalars['BigInt'];
  claimed: Scalars['BigInt'];
  id: Scalars['Bytes'];
  lastStake: Scalars['BigInt'];
  staked: Scalars['BigInt'];
};

export type BuilderUser_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<BuilderUser_Filter>>>;
  builderSubnet?: InputMaybe<Scalars['String']>;
  builderSubnet_?: InputMaybe<BuilderSubnet_Filter>;
  builderSubnet_contains?: InputMaybe<Scalars['String']>;
  builderSubnet_contains_nocase?: InputMaybe<Scalars['String']>;
  builderSubnet_ends_with?: InputMaybe<Scalars['String']>;
  builderSubnet_ends_with_nocase?: InputMaybe<Scalars['String']>;
  builderSubnet_gt?: InputMaybe<Scalars['String']>;
  builderSubnet_gte?: InputMaybe<Scalars['String']>;
  builderSubnet_in?: InputMaybe<Array<Scalars['String']>>;
  builderSubnet_lt?: InputMaybe<Scalars['String']>;
  builderSubnet_lte?: InputMaybe<Scalars['String']>;
  builderSubnet_not?: InputMaybe<Scalars['String']>;
  builderSubnet_not_contains?: InputMaybe<Scalars['String']>;
  builderSubnet_not_contains_nocase?: InputMaybe<Scalars['String']>;
  builderSubnet_not_ends_with?: InputMaybe<Scalars['String']>;
  builderSubnet_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  builderSubnet_not_in?: InputMaybe<Array<Scalars['String']>>;
  builderSubnet_not_starts_with?: InputMaybe<Scalars['String']>;
  builderSubnet_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  builderSubnet_starts_with?: InputMaybe<Scalars['String']>;
  builderSubnet_starts_with_nocase?: InputMaybe<Scalars['String']>;
  claimLockEnd?: InputMaybe<Scalars['BigInt']>;
  claimLockEnd_gt?: InputMaybe<Scalars['BigInt']>;
  claimLockEnd_gte?: InputMaybe<Scalars['BigInt']>;
  claimLockEnd_in?: InputMaybe<Array<Scalars['BigInt']>>;
  claimLockEnd_lt?: InputMaybe<Scalars['BigInt']>;
  claimLockEnd_lte?: InputMaybe<Scalars['BigInt']>;
  claimLockEnd_not?: InputMaybe<Scalars['BigInt']>;
  claimLockEnd_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  lastStake?: InputMaybe<Scalars['BigInt']>;
  lastStake_gt?: InputMaybe<Scalars['BigInt']>;
  lastStake_gte?: InputMaybe<Scalars['BigInt']>;
  lastStake_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastStake_lt?: InputMaybe<Scalars['BigInt']>;
  lastStake_lte?: InputMaybe<Scalars['BigInt']>;
  lastStake_not?: InputMaybe<Scalars['BigInt']>;
  lastStake_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  or?: InputMaybe<Array<InputMaybe<BuilderUser_Filter>>>;
  staked?: InputMaybe<Scalars['BigInt']>;
  staked_gt?: InputMaybe<Scalars['BigInt']>;
  staked_gte?: InputMaybe<Scalars['BigInt']>;
  staked_in?: InputMaybe<Array<Scalars['BigInt']>>;
  staked_lt?: InputMaybe<Scalars['BigInt']>;
  staked_lte?: InputMaybe<Scalars['BigInt']>;
  staked_not?: InputMaybe<Scalars['BigInt']>;
  staked_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum BuilderUser_OrderBy {
  Address = 'address',
  BuilderSubnet = 'builderSubnet',
  BuilderSubnetDescription = 'builderSubnet__description',
  BuilderSubnetFee = 'builderSubnet__fee',
  BuilderSubnetFeeTreasury = 'builderSubnet__feeTreasury',
  BuilderSubnetId = 'builderSubnet__id',
  BuilderSubnetImage = 'builderSubnet__image',
  BuilderSubnetMaxClaimLockEnd = 'builderSubnet__maxClaimLockEnd',
  BuilderSubnetMinStake = 'builderSubnet__minStake',
  BuilderSubnetName = 'builderSubnet__name',
  BuilderSubnetOwner = 'builderSubnet__owner',
  BuilderSubnetSlug = 'builderSubnet__slug',
  BuilderSubnetStartsAt = 'builderSubnet__startsAt',
  BuilderSubnetTotalClaimed = 'builderSubnet__totalClaimed',
  BuilderSubnetTotalStaked = 'builderSubnet__totalStaked',
  BuilderSubnetTotalUsers = 'builderSubnet__totalUsers',
  BuilderSubnetWebsite = 'builderSubnet__website',
  BuilderSubnetWithdrawLockPeriodAfterStake = 'builderSubnet__withdrawLockPeriodAfterStake',
  ClaimLockEnd = 'claimLockEnd',
  Claimed = 'claimed',
  Id = 'id',
  LastStake = 'lastStake',
  Staked = 'staked'
}

export type Counter = {
  __typename?: 'Counter';
  id: Scalars['Bytes'];
  totalBuilderProjects: Scalars['BigInt'];
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
  totalBuilderProjects?: InputMaybe<Scalars['BigInt']>;
  totalBuilderProjects_gt?: InputMaybe<Scalars['BigInt']>;
  totalBuilderProjects_gte?: InputMaybe<Scalars['BigInt']>;
  totalBuilderProjects_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalBuilderProjects_lt?: InputMaybe<Scalars['BigInt']>;
  totalBuilderProjects_lte?: InputMaybe<Scalars['BigInt']>;
  totalBuilderProjects_not?: InputMaybe<Scalars['BigInt']>;
  totalBuilderProjects_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  TotalBuilderProjects = 'totalBuilderProjects',
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
  builderSubnet?: Maybe<BuilderSubnet>;
  builderSubnets: Array<BuilderSubnet>;
  builderUser?: Maybe<BuilderUser>;
  builderUsers: Array<BuilderUser>;
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


export type QueryBuilderSubnetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBuilderSubnetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuilderSubnet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BuilderSubnet_Filter>;
};


export type QueryBuilderUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBuilderUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuilderUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BuilderUser_Filter>;
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
  builderSubnet?: Maybe<BuilderSubnet>;
  builderSubnets: Array<BuilderSubnet>;
  builderUser?: Maybe<BuilderUser>;
  builderUsers: Array<BuilderUser>;
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


export type SubscriptionBuilderSubnetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBuilderSubnetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuilderSubnet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BuilderSubnet_Filter>;
};


export type SubscriptionBuilderUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBuilderUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuilderUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BuilderUser_Filter>;
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

export type BuilderUserDefaultFragment = { __typename?: 'BuilderUser', id: any, address: any, staked: any, claimed: any, claimLockEnd: any, lastStake: any };

export type BuilderSubnetDefaultFragment = { __typename?: 'BuilderSubnet', id: any, name: string, owner: any, minStake: any, fee: any, feeTreasury: any, startsAt: any, withdrawLockPeriodAfterStake: any, maxClaimLockEnd: any, slug: string, description: string, website: string, image: string, totalStaked: any, totalClaimed: any, totalUsers: any, builderUsers: Array<{ __typename?: 'BuilderUser', id: any, address: any, staked: any, claimed: any, claimLockEnd: any, lastStake: any }> };

export type GetBuilderSubnetQueryVariables = Exact<{
  id?: Scalars['ID'];
}>;


export type GetBuilderSubnetQuery = { __typename?: 'Query', builderSubnet?: { __typename?: 'BuilderSubnet', id: any, name: string, owner: any, minStake: any, fee: any, feeTreasury: any, startsAt: any, withdrawLockPeriodAfterStake: any, maxClaimLockEnd: any, slug: string, description: string, website: string, image: string, totalStaked: any, totalClaimed: any, totalUsers: any, builderUsers: Array<{ __typename?: 'BuilderUser', id: any, address: any, staked: any, claimed: any, claimLockEnd: any, lastStake: any }> } | null };

export type GetBuilderSubnetUsersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuilderUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  builderSubnetId?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetBuilderSubnetUsersQuery = { __typename?: 'Query', builderUsers: Array<{ __typename?: 'BuilderUser', id: any, address: any, staked: any, claimed: any, claimLockEnd: any, lastStake: any }> };

export type GetUserAccountBuilderSubnetsQueryVariables = Exact<{
  address?: InputMaybe<Scalars['Bytes']>;
  builder_subnet_id?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetUserAccountBuilderSubnetsQuery = { __typename?: 'Query', builderUsers: Array<{ __typename?: 'BuilderUser', id: any, address: any, staked: any, claimed: any, claimLockEnd: any, lastStake: any, builderSubnet: { __typename?: 'BuilderSubnet', id: any, name: string, owner: any, minStake: any, fee: any, feeTreasury: any, startsAt: any, withdrawLockPeriodAfterStake: any, maxClaimLockEnd: any, slug: string, description: string, website: string, image: string, totalStaked: any, totalClaimed: any, totalUsers: any, builderUsers: Array<{ __typename?: 'BuilderUser', id: any, address: any, staked: any, claimed: any, claimLockEnd: any, lastStake: any }> } }> };

export type CombinedBuilderSubnetsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BuilderSubnet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  usersOrderBy?: InputMaybe<BuilderUser_OrderBy>;
  usersDirection?: InputMaybe<OrderDirection>;
  builderSubnetName?: Scalars['String'];
  address?: InputMaybe<Scalars['Bytes']>;
}>;


export type CombinedBuilderSubnetsQuery = { __typename?: 'Query', builderSubnets: Array<{ __typename?: 'BuilderSubnet', id: any, name: string, owner: any, minStake: any, fee: any, feeTreasury: any, startsAt: any, withdrawLockPeriodAfterStake: any, maxClaimLockEnd: any, slug: string, description: string, website: string, image: string, totalStaked: any, totalClaimed: any, totalUsers: any, builderUsers: Array<{ __typename?: 'BuilderUser', id: any, address: any, staked: any, claimed: any, claimLockEnd: any, lastStake: any }> }>, builderUsers: Array<{ __typename?: 'BuilderUser', id: any, address: any, staked: any, claimed: any, claimLockEnd: any, lastStake: any, builderSubnet: { __typename?: 'BuilderSubnet', id: any, name: string, owner: any, minStake: any, fee: any, feeTreasury: any, startsAt: any, withdrawLockPeriodAfterStake: any, maxClaimLockEnd: any, slug: string, description: string, website: string, image: string, totalStaked: any, totalClaimed: any, totalUsers: any, builderUsers: Array<{ __typename?: 'BuilderUser', id: any, address: any, staked: any, claimed: any, claimLockEnd: any, lastStake: any }> } }>, counters: Array<{ __typename?: 'Counter', id: any, totalSubnets: any, totalBuilderProjects: any }> };

export type CombinedBuilderSubnetsFilteredByPredefinedBuildersQueryVariables = Exact<{
  orderBy?: InputMaybe<BuilderSubnet_OrderBy>;
  usersOrderBy?: InputMaybe<BuilderUser_OrderBy>;
  usersDirection?: InputMaybe<OrderDirection>;
  orderDirection?: InputMaybe<OrderDirection>;
  name_in?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  address?: InputMaybe<Scalars['Bytes']>;
}>;


export type CombinedBuilderSubnetsFilteredByPredefinedBuildersQuery = { __typename?: 'Query', builderSubnets: Array<{ __typename?: 'BuilderSubnet', id: any, name: string, owner: any, minStake: any, fee: any, feeTreasury: any, startsAt: any, withdrawLockPeriodAfterStake: any, maxClaimLockEnd: any, slug: string, description: string, website: string, image: string, totalStaked: any, totalClaimed: any, totalUsers: any, builderUsers: Array<{ __typename?: 'BuilderUser', id: any, address: any, staked: any, claimed: any, claimLockEnd: any, lastStake: any }> }>, builderUsers: Array<{ __typename?: 'BuilderUser', id: any, address: any, staked: any, claimed: any, claimLockEnd: any, lastStake: any, builderSubnet: { __typename?: 'BuilderSubnet', id: any, name: string, owner: any, minStake: any, fee: any, feeTreasury: any, startsAt: any, withdrawLockPeriodAfterStake: any, maxClaimLockEnd: any, slug: string, description: string, website: string, image: string, totalStaked: any, totalClaimed: any, totalUsers: any, builderUsers: Array<{ __typename?: 'BuilderUser', id: any, address: any, staked: any, claimed: any, claimLockEnd: any, lastStake: any }> } }> };

export const BuilderUserDefault = gql`
    fragment BuilderUserDefault on BuilderUser {
  id
  address
  staked
  claimed
  claimLockEnd
  lastStake
}
    `;
export const BuilderSubnetDefault = gql`
    fragment BuilderSubnetDefault on BuilderSubnet {
  id
  name
  owner
  minStake
  fee
  feeTreasury
  startsAt
  withdrawLockPeriodAfterStake
  maxClaimLockEnd
  slug
  description
  website
  image
  totalStaked
  totalClaimed
  totalUsers
  builderUsers {
    ...BuilderUserDefault
  }
}
    ${BuilderUserDefault}`;
export const GetBuilderSubnet = gql`
    query getBuilderSubnet($id: ID! = "") {
  builderSubnet(id: $id) {
    ...BuilderSubnetDefault
  }
}
    ${BuilderSubnetDefault}`;
export const GetBuilderSubnetUsers = gql`
    query getBuilderSubnetUsers($first: Int = 10, $skip: Int = 10, $orderBy: BuilderUser_orderBy, $orderDirection: OrderDirection, $builderSubnetId: Bytes = "") {
  builderUsers(
    first: $first
    skip: $skip
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: {builderSubnet_: {id: $builderSubnetId}}
  ) {
    ...BuilderUserDefault
  }
}
    ${BuilderUserDefault}`;
export const GetUserAccountBuilderSubnets = gql`
    query getUserAccountBuilderSubnets($address: Bytes = "", $builder_subnet_id: Bytes = "") {
  builderUsers(
    where: {address: $address, builderSubnet_: {id: $builder_subnet_id}}
  ) {
    ...BuilderUserDefault
    builderSubnet {
      ...BuilderSubnetDefault
    }
  }
}
    ${BuilderUserDefault}
${BuilderSubnetDefault}`;
export const CombinedBuilderSubnets = gql`
    query combinedBuilderSubnets($first: Int = 10, $skip: Int = 10, $orderBy: BuilderSubnet_orderBy, $orderDirection: OrderDirection, $usersOrderBy: BuilderUser_orderBy, $usersDirection: OrderDirection, $builderSubnetName: String! = "", $address: Bytes = "") {
  builderSubnets(
    first: $first
    skip: $skip
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: {name_contains_nocase: $builderSubnetName}
  ) {
    ...BuilderSubnetDefault
  }
  builderUsers(
    orderBy: $usersOrderBy
    orderDirection: $usersDirection
    where: {address: $address}
  ) {
    ...BuilderUserDefault
    builderSubnet {
      ...BuilderSubnetDefault
    }
  }
  counters {
    id
    totalSubnets
    totalBuilderProjects
  }
}
    ${BuilderSubnetDefault}
${BuilderUserDefault}`;
export const CombinedBuilderSubnetsFilteredByPredefinedBuilders = gql`
    query combinedBuilderSubnetsFilteredByPredefinedBuilders($orderBy: BuilderSubnet_orderBy, $usersOrderBy: BuilderUser_orderBy, $usersDirection: OrderDirection, $orderDirection: OrderDirection, $name_in: [String!] = "", $address: Bytes = "") {
  builderSubnets(
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: {name_in: $name_in}
  ) {
    ...BuilderSubnetDefault
  }
  builderUsers(
    orderBy: $usersOrderBy
    orderDirection: $usersDirection
    where: {address: $address, builderSubnet_: {name_in: $name_in}}
  ) {
    ...BuilderUserDefault
    builderSubnet {
      ...BuilderSubnetDefault
    }
  }
}
    ${BuilderSubnetDefault}
${BuilderUserDefault}`;