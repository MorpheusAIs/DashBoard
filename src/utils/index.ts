import { utils, BigNumber } from 'ethers'
import { Time } from '@distributedlab/tools'

const formatEther: typeof utils.formatEther = (...params) => {
  const str = utils.formatEther(...params)
  const indexOfDot = str.indexOf('.')
  const sliced = indexOfDot !== -1 ? str.slice(0, indexOfDot + 5) : str

  return Number(Number(sliced).toFixed(4)).toString()
}

const { parseUnits } = utils

export { formatEther, parseUnits, Time, BigNumber }
