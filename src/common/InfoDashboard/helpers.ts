import { Time, hexlify, BigNumber } from '@/utils'
import { gql } from '@apollo/client'
import { config } from '@config'

type ChartData = Record<number, BigNumber>

const ONE_DAY_TIMESTAMP = 24 * 60 * 60

export async function getChartData(
  poolId: number,
  month: number,
): Promise<ChartData> {
  type QueryData = Record<string, { totalStaked: string }[]>
  const { data } = await config.apolloClient.query<QueryData>({
    query: _generateTotalStakedPerDayGraphqlQuery(poolId, month),
  })

  return Object.values(data)
    .flat()
    .reduce(
      (acc, data, idx) => ({
        ...acc,
        [idx + 1]: BigNumber.from(data.totalStaked),
      }),
      {},
    )
}

function _generateTotalStakedPerDayGraphqlQuery(poolId: number, month: number) {
  const REQUEST_PATTERN = `r{{index}}:
    poolInteractions(
        first: 1
        orderDirection: desc
        where: {timestamp_lte: "{{timestamp}}", pool: "${hexlify(poolId)}"}
        orderBy: timestamp
      ) {
        totalStaked
      }`

  const monthStartTime = new Time(String(month), 'M')
  const daysInMonth = monthStartTime.dayjs.daysInMonth()

  const requests = []
  for (let i = 0; i < daysInMonth; i++) {
    const timestamp = monthStartTime.timestamp + i * ONE_DAY_TIMESTAMP

    // eslint-disable-next-line prettier/prettier
    const request = REQUEST_PATTERN
      .replace('{{index}}', i.toString())
      .replace('{{timestamp}}', timestamp.toString())

    requests.push(request)
  }

  return gql`
    ${'{\n' + requests.join('\n') + '\n}'}
  `
}
