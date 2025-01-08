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
}
