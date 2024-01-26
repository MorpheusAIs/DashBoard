import { detect } from 'detect-browser'

export function isIos(): boolean {
  const res = detect()
  return res?.os === 'iOS'
}

export function isAndroid(): boolean {
  const res = detect()
  return res?.os === 'Android OS'
}

export function isMobile(): boolean {
  return isAndroid() || isIos()
}
