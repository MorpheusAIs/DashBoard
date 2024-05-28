import { utils, BigNumber, type BigNumberish } from 'ethers'
import { Time } from '@distributedlab/tools'

const {
  formatEther: toEther,
  formatUnits,
  hexlify,
  isAddress,
  parseUnits,
} = utils

const formatEther: typeof toEther = (...params) => {
  const str = toEther(...params)
  const indexOfDot = str.indexOf('.')
  const sliced = indexOfDot !== -1 ? str.slice(0, indexOfDot + 5) : str

  return Number(Number(sliced).toFixed(4)).toString()
}

export {
  formatEther,
  formatUnits,
  hexlify,
  isAddress,
  parseUnits,
  toEther,
  Time,
  BigNumber,
}

export type { BigNumberish }
