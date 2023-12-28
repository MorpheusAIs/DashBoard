export function copyToClipboard(str: string) {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText)
    return navigator.clipboard.writeText(str)
  throw new Error('The Clipboard API is not available.')
}

export function readFromClipboard() {
  if (navigator && navigator.clipboard && navigator.clipboard.readText)
    return navigator.clipboard.readText()
  throw new Error('The Clipboard API is not available.')
}
