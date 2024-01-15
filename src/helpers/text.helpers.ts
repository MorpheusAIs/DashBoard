export function abbrCenter(text: string, amount = 4): string {
  if (text.length <= 10) {
    return text
  }
  return `${text.slice(0, amount)}...${text.slice(
    text.length - amount + 1,
    text.length,
  )}`
}
