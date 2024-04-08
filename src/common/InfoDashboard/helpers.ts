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
  type QueryData = Record<`r${number}`, { totalStaked: string }[]>
  const { data } = await config.apolloClient.query<QueryData>({
    query: _generateTotalStakedPerDayGraphqlQuery(poolId, poolStartedAt, month),
  })

  return mapValues(
    mapKeys(data, (_, key) => key.slice(1)),
    value => BigNumber.from(value[0].totalStaked),
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

  const monthTime = new Time(String(month), 'M')
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
