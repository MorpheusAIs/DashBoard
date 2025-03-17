import defaultTheme from 'tailwindcss/defaultTheme'
import type { CSSRuleObject, ThemeConfig } from 'tailwindcss/types/config'

export const PRIMARY_FONT_VARIABLE = '--font-primary' as const
export const fontFamily: ThemeConfig['fontFamily'] = {
  primary: `var(${PRIMARY_FONT_VARIABLE}, ${defaultTheme.fontFamily.sans})`,
}

export const typography: CSSRuleObject = {
  '.typography-h1': {
    fontSize: '54px',
    fontWeight: '700',
    lineHeight: '82px',
  },
  '.typography-h2': {
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: '46px',
  },
  '.typography-h3': {
    fontSize: '28px',
    lineHeight: '40px',
    fontWeight: '700',
  },
  '.typography-h4': {
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '34px',
  },
  '.typography-body1': {
    fontWeight: '400',
    fontSize: '22px',
    lineHeight: '32px',
  },
  '.typography-body2': {
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '30px',
  },
  '.typography-body3': {
    fontSize: '18px',
    lineHeight: '26px',
    fontWeight: '400',
  },
  '.typography-body4': {
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '22px',
  },
  '.typography-body5': {
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '20px',
  },
  '.typography-body6': {
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px',
  },
}
