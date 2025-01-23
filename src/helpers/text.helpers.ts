import { DEFAULT_ROUND_DIGITS } from '@/const'
import { BN, BnConfigLike, BnFormatConfig, BnLike } from '@distributedlab/tools'

export function abbrCenter(text: string, amount = 4): string {
  if (text.length <= 10) {
    return text
  }
  return `${text.slice(0, amount)}...${text.slice(
    text.length - amount + 1,
    text.length,
  )}`
}

export function capitalize(text: string): string {
  if (!text.length) return ''
  return text[0].toUpperCase().concat(text.slice(1))
}

export const mergeClasses = (...classes: (string | undefined)[]) =>
  classes.join(' ')

export const roundNumber = (
  number: string | number,
  roundDigits = DEFAULT_ROUND_DIGITS,
) => parseFloat(parseFloat(String(number)).toFixed(roundDigits))

// number
const defaultBnFormatConfig: BnFormatConfig = {
  decimals: 2,
  groupSeparator: '',
  decimalSeparator: '.',
  fractionGroupSeparator: '',
  fractionGroupSize: 3,
}

/**
 * Format human amount without trailing zeros
 * @param amount
 */
function removeTrailingZeros(amount: string) {
  const [integer, fraction] = amount.split('.')

  if (!fraction) return integer

  let result = integer

  for (let i = fraction.length - 1; i >= 0; i--) {
    if (fraction[i] !== '0') {
      result += `.${fraction.slice(0, i + 1)}`
      break
    }
  }

  return result
}

/**
 * Format human amount with prefix
 * @param value
 */
function convertNumberWithPrefix(value: string) {
  const M_PREFIX_AMOUNT = 1_000_000
  const B_PREFIX_AMOUNT = 1_000_000_000
  const T_PREFIX_AMOUNT = 1_000_000_000_000

  const getPrefix = (value: number): 'M' | 'B' | 'T' | '' => {
    if (value >= T_PREFIX_AMOUNT) return 'T'
    if (value >= B_PREFIX_AMOUNT) return 'B'
    if (value >= M_PREFIX_AMOUNT) return 'M'

    return ''
  }

  const prefix = getPrefix(+value)

  const divider = {
    M: M_PREFIX_AMOUNT,
    B: B_PREFIX_AMOUNT,
    T: T_PREFIX_AMOUNT,
    '': 1,
  }[prefix]

  const finalAmount = BN.fromRaw(Number(value) / divider, 3).format({
    decimals: 3,
    groupSeparator: '',
    decimalSeparator: '.',
  })

  return `${removeTrailingZeros(finalAmount)}${prefix}`
}

export function formatNumber(
  value: string | number,
  formatConfig?: BnFormatConfig,
) {
  try {
    const formatCfg = formatConfig || {
      ...defaultBnFormatConfig,
    }

    return removeTrailingZeros(BN.fromRaw(value).format(formatCfg))
  } catch {
    return '0'
  }
}

export function formatNullifier(value: string) {
  return value.slice(0, 4) + '...' + value.slice(-4)
}

export function formatAmount(
  amount: BnLike,
  decimalsOrConfig?: BnConfigLike,
  formatConfig: BnFormatConfig = { decimals: 0 },
) {
  try {
    const decimals =
      typeof decimalsOrConfig === 'number'
        ? decimalsOrConfig
        : decimalsOrConfig?.decimals

    const formatCfg = {
      ...defaultBnFormatConfig,
      ...(decimals && { decimals }),
      ...formatConfig,
    }

    return removeTrailingZeros(
      BN.fromBigInt(amount, decimalsOrConfig).format(formatCfg),
    )
  } catch {
    return '0'
  }
}

export function formatBalance(
  amount: BnLike,
  decimalsOrConfig?: BnConfigLike,
  formatConfig?: BnFormatConfig,
) {
  try {
    const decimals =
      typeof decimalsOrConfig === 'number'
        ? decimalsOrConfig
        : decimalsOrConfig?.decimals

    const formatCfg = formatConfig || {
      ...defaultBnFormatConfig,
      ...(decimals && { decimals }),
    }

    return convertNumberWithPrefix(
      formatAmount(amount, decimalsOrConfig, formatCfg),
    )
  } catch {
    return '0'
  }
}
