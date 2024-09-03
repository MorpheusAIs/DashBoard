import { MAX_UINT_256 } from '@/const'
import { IUseContract } from '@/composables'
import { IL1Factory } from '@/types/contracts/L1Factory'
import type { InfoDashboardType } from '@/types'

const findMatchingProtocols = (
  l1Pools: IL1Factory.PoolViewStructOutput[],
  l2Pools: IL1Factory.PoolViewStructOutput[],
) => {
  const l2PoolMap = new Map(l2Pools.map(pool => [pool.protocol, pool]))

  for (const l1Pool of l1Pools) {
    const l2Pool = l2PoolMap.get(l1Pool.protocol)
    if (l2Pool) {
      return [l1Pool, l2Pool]
    }
  }

  return [null, null]
}

export const getUsersLastFullyDeployedProtocol = async (
  address: string,
  l1FactoryContract: IUseContract<'L1Factory__factory'>,
  l2FactoryContract: IUseContract<'L2Factory__factory'>,
): Promise<InfoDashboardType.DashboardInfo> => {
  const [l1DeployedPools, l2DeployedPools] = await Promise.all([
    l1FactoryContract.providerBased.value.getDeployedPools(
      address,
      0,
      MAX_UINT_256,
    ),
    l2FactoryContract.providerBased.value.getDeployedPools(
      address,
      0,
      MAX_UINT_256,
    ),
  ])

  const [l1Pool, l2Pool] = findMatchingProtocols(
    l1DeployedPools,
    l2DeployedPools,
  )

  if (!l1Pool || !l2Pool) {
    return
  }

  return {
    name: l1Pool.protocol,
    distributionAddress: l1Pool.distribution,
    l1SenderAddress: l1Pool.l1Sender,
    l2MessageReceiverAddress: l2Pool.l2MessageReceiver,
    l2TokenReceiverAddress: l2Pool.l2TokenReceiver,
    tokenAddress: l2Pool.mor20,
  }
}
