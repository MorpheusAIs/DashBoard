import { DEFAULT_ROUND_DIGITS } from '@/const'

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
