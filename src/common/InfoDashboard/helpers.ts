import { Time, hexlify, BigNumber } from '@/utils'
import { gql } from '@apollo/client'
import { config } from '@config'
import { mapKeys, mapValues } from 'lodash'

type ChartData = Record<number, BigNumber>

const ONE_DAY_TIMESTAMP = 24 * 60 * 60
const DECIMAL = BigNumber.from(10).pow(25)

export async function getChartData(
  poolId: number,
  poolStartedAt: BigNumber,
  month: number,
): Promise<ChartData> {
  type QueryData = Record<`r${number}`, { totalStaked?: string }[]>
  const { data } = await config.apolloClient.query<QueryData>({
    query: _generateTotalStakedPerDayGraphqlQuery(poolId, poolStartedAt, month),
  })

  return mapValues(
    mapKeys(data, (_, key) => key.slice(1)),
    value => BigNumber.from(value[0]?.totalStaked ?? 0),
  )
}

function _generateTotalStakedPerDayGraphqlQuery(
  poolId: number,
  poolStartedAt: BigNumber,
  month: number,
) {
  const REQUEST_PATTERN = `d{{date}}:
    poolInteractions(
        first: 1
        orderDirection: desc
        where: {timestamp_lte: "{{timestamp}}", pool: "${hexlify(poolId)}"}
        orderBy: timestamp
      ) {
        totalStaked
      }`

  const monthTime = new Time(String(month + 1), 'M')
  const currentTime = new Time()
  const poolStartedAtTime = new Time(poolStartedAt.toNumber())

  const startDate = monthTime.isSame(poolStartedAtTime, 'month')
    ? poolStartedAtTime.get('date')
    : 1

  const endDate = currentTime.isSame(monthTime, 'month')
    ? currentTime.get('date')
    : monthTime.dayjs.daysInMonth()

  const requests = []
  for (let date = startDate; date <= endDate; date++) {
    const timestamp = monthTime.timestamp + date * ONE_DAY_TIMESTAMP

    // eslint-disable-next-line prettier/prettier
    const request = REQUEST_PATTERN
      .replace('{{date}}', date.toString())
      // eslint-disable-next-line prettier/prettier
      .replace('{{timestamp}}', timestamp.toString())

    requests.push(request)
  }

  return gql`
    ${'{\n' + requests.join('\n') + '\n}'}
  `
}

export async function getUserYieldPerDayChartData(
  poolId: number,
  user: string,
  month: number,
): Promise<ChartData> {
  type PoolIntercation = {
    timestamp: string
    rate: string
  }

  type QueryData = {
    userInteractions: {
      timestamp: string
      rate: string
      deposited: string
      claimedRewards: string
      pendingRewards: string
    }[]
    poolInteractions: PoolIntercation[]
  }

  // Get data from TheGraph
  const { data } = await config.apolloClient.query<QueryData>({
    query: _generateUserYieldPerDayGraphqlQuery(poolId, user, month),
  })

  // START leave yields only at the end of the calculation day
  const poolInteractionsMap = new Map<string, PoolIntercation>()
  data.poolInteractions.forEach(interaction => {
    const { timestamp } = interaction
    const date = new Date(Number(timestamp) * 1000)
    const day = date.toISOString().split('T')[0]

    if (
      !poolInteractionsMap.has(day) ||
      Number(timestamp) > Number(poolInteractionsMap.get(day)!.timestamp)
    ) {
      poolInteractionsMap.set(day, interaction)
    }
  })
  const poolInteractions = Array.from(poolInteractionsMap.values())
  // END

  // START calculate rewards
  const yields: ChartData = {}
  for (let i = 0; i < data.userInteractions.length; i++) {
    const ui = data.userInteractions[i]
    const nextUserIntercation =
      i < data.userInteractions.length - 1
        ? data.userInteractions[i + 1]
        : undefined

    // Get `poolInteractions` periods between `userIntercationsYield`
    // When `userInteraction` is last, get all periods that greater then current
    const periodPoolInteractions = poolInteractions.filter(e => {
      return (
        Number(e.timestamp) > Number(ui.timestamp) &&
        (nextUserIntercation
          ? Number(e.timestamp) < Number(nextUserIntercation.timestamp)
          : true)
      )
    })

    // Calculate current yield from the `userIntercations` and push
    const uiv = BigNumber.from(ui.claimedRewards).add(ui.pendingRewards)
    yields[Number(ui.timestamp)] = uiv

    // Calculate nex period yields from the `poolIntercations` and push
    periodPoolInteractions.forEach(pi => {
      const rateDiff = BigNumber.from(pi.rate).sub(ui.rate)
      const periodReward = BigNumber.from(ui.deposited)
        .mul(rateDiff)
        .div(DECIMAL)

      const value = uiv.add(periodReward)

      yields[Number(pi.timestamp)] = value
    })
  }
  // END

  return yields
}

function _generateUserYieldPerDayGraphqlQuery(
  poolId: number,
  user: string,
  // TODO: add month
  month: number,
) {
  const fromTimestamp =
    new Time(String(month + 1), 'M').toDate().getTime() / 1000
  const toTimestamp = new Time(String(month + 2), 'M').toDate().getTime() / 1000

  const REQUEST_PATTERN = `
    userInteractions (
      orderBy: timestamp
      orderDirection: asc
      where: {
        user: "${user}"
        poolId: "${poolId.toString()}"
        timestamp_gt: ${fromTimestamp}
        timestamp_lt: ${toTimestamp}
      }
    ) {
      timestamp
      rate
      deposited
      claimedRewards
      pendingRewards
    }
    poolInteractions (
      orderBy: timestamp
      orderDirection: asc
      where: {
        rate_gt: 0
        timestamp_gt: ${fromTimestamp}
        timestamp_lt: ${toTimestamp}
        pool_: {
          id: "${hexlify(poolId)}"
        }
      }
      first: 1000
    ) {
      timestamp
      rate
    }
  `

  const requests = [REQUEST_PATTERN]

  return gql`
    ${'{\n' + requests.join('\n') + '\n}'}
  `
}
