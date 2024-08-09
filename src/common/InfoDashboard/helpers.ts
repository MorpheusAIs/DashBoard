import { Time, hexlify, BigNumber } from '@/utils'
import { gql } from '@apollo/client'
import { config } from '@config'
import { mapKeys, mapValues } from 'lodash'

type ChartData = Record<number, BigNumber>

const ONE_DAY_TIMESTAMP = 24 * 60 * 60

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
  type QueryData = {
    userInteractions: {
      timestamp: string
      rate: string
      deposited: string
      claimedRewards: string
      pendingRewards: string
    }[]
    poolInteractions: {
      timestamp: string
      rate: string
    }[]
  }

  const { data } = await config.apolloClient.query<QueryData>({
    query: _generateUserYieldPerDayGraphqlQuery(poolId, user, month),
  })

  console.log(data)

  const res: ChartData = {}
  for (let i = 0; i < data.userInteractions.length; i++) {
    const ui = data.userInteractions[i]
    const nextUserIntercation =
      i < data.userInteractions.length - 1
        ? data.userInteractions[i + 1]
        : undefined

    // Get `poolInteractions` periods between `userIntercationsYield`
    // When `userInteraction` is last, get all periods that greater then current
    const periodPoolInteractions = data.poolInteractions.filter(e => {
      return (
        Number(e.timestamp) > Number(ui.timestamp) &&
        (nextUserIntercation
          ? Number(e.timestamp) < Number(nextUserIntercation.timestamp)
          : true)
      )
    })

    // Push original user interaction value
    const uiv = BigNumber.from(ui.claimedRewards).add(ui.pendingRewards)
    res[Number(ui.timestamp)] = uiv

    // Push all pool interaction periods
    periodPoolInteractions.forEach(pi => {
      const decimal = BigNumber.from(10).pow(25)
      const rateDiff = BigNumber.from(pi.rate).sub(ui.rate)

      const value = uiv.add(
        BigNumber.from(ui.deposited).mul(rateDiff).div(decimal),
      )

      res[Number(pi.timestamp)] = value
    })
  }

  return res
}

function _generateUserYieldPerDayGraphqlQuery(
  poolId: number,
  user: string,
  // TODO: add month
  month: number,
) {
  const REQUEST_PATTERN = `
    userInteractions (
      orderBy: timestamp
      orderDirection: asc
      where: {
        user: "{{user}}"
        poolId: "{{poolId}}"
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
      }
      first: 1000
    ) {
      timestamp
      rate
    }
  `

  const requests = []
  const request = REQUEST_PATTERN.replace(
    '{{poolId}}',
    poolId.toString(),
  ).replace('{{user}}', user)

  requests.push(request)

  return gql`
    ${'{\n' + requests.join('\n') + '\n}'}
  `
}
