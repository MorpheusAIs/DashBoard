import { BigNumber } from '@ethersproject/bignumber'
import { formatEther as ethersFormatEther } from '@ethersproject/units'

export const formatEther = (
  value: BigNumber | string | undefined | null,
): string => {
  if (!value) return '0'
  try {
    const formatted = ethersFormatEther(value)
    // Split on decimal point
    const [whole, decimal] = formatted.split('.')
    // If no decimal part or decimal is all zeros, return just the whole number
    if (!decimal || decimal.replace(/0/g, '') === '') return whole
    // If decimal part is shorter than 2 digits, pad with zeros
    if (decimal.length < 2) {
      const paddedDecimal = decimal.padEnd(2, '0')
      // If padded decimal is all zeros, return just the whole number
      return paddedDecimal.replace(/0/g, '') === ''
        ? whole
        : `${whole}.${paddedDecimal}`
    }
    // If decimal part is longer than 2 digits, truncate to 2
    const truncatedDecimal = decimal.slice(0, 2)
    // If truncated decimal is all zeros, return just the whole number
    return truncatedDecimal.replace(/0/g, '') === ''
      ? whole
      : `${whole}.${truncatedDecimal}`
  } catch (error) {
    return '0'
  }
}

// For numbers that are already in decimal form (not wei)
export const formatDecimal = (
  value: string | number | undefined | null,
): string => {
  if (!value) return '0'
  try {
    const num = Number(value)
    // Check if the number is a whole number
    if (Number.isInteger(num)) return num.toString()
    // Format with 2 decimal places
    const formatted = num.toFixed(2)
    // If the decimal part is all zeros, return just the whole number
    const [whole, decimal] = formatted.split('.')
    return decimal.replace(/0/g, '') === '' ? whole : formatted
  } catch (error) {
    return '0'
  }
}
