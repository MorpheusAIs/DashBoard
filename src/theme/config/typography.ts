import defaultTheme from 'tailwindcss/defaultTheme'
import type { CSSRuleObject, ThemeConfig } from 'tailwindcss/types/config'

export const PRIMARY_FONT_VARIABLE = '--font-primary' as const
export const fontFamily: ThemeConfig['fontFamily'] = {
  primary: `var(${PRIMARY_FONT_VARIABLE}, ${defaultTheme.fontFamily.sans})`,
}

export const typography: CSSRuleObject = {
  '.typography-display1': {
    'font-size': '140px',
    'line-height': '120px',
    fontWeight: '700',
  },
  '.typography-display2': {
    'font-size': '140px',
    'line-height': '120px',
    fontWeight: '500',
  },
  '.typography-display3': {
    'font-size': '80px',
    'line-height': '90px',
    fontWeight: '700',
  },
  '.typography-display4': {
    'font-size': '80px',
    'line-height': '76px',
    fontWeight: '700',
  },

  '.typography-h1': {
    fontSize: '48px',
    lineHeight: '52px',
    fontWeight: '700',
  },
  '.typography-h2': { fontSize: '32px', lineHeight: '36px', fontWeight: '700' },
  '.typography-h3': { fontSize: '24px', lineHeight: '28px', fontWeight: '700' },
  '.typography-h4': { fontSize: '20px', lineHeight: '24px', fontWeight: '700' },
  '.typography-h5': { fontSize: '16px', lineHeight: '20px', fontWeight: '700' },
  '.typography-h6': { fontSize: '14px', lineHeight: '18px', fontWeight: '700' },

  '.typography-subtitle1': {
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: '500',
  },
  '.typography-subtitle2': {
    fontSize: '20px',
    lineHeight: '24px',
    fontWeight: '500',
  },
  '.typography-subtitle3': {
    fontSize: '16px',
    lineHeight: '22px',
    fontWeight: '500',
  },
  '.typography-subtitle4': {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '500',
  },
  '.typography-subtitle5': {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: '500',
  },

  '.typography-body1': {
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: '400',
  },
  '.typography-body2': {
    fontSize: '16px',
    lineHeight: '22px',
    fontWeight: '400',
  },
  '.typography-body3': {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '400',
  },
  '.typography-body4': {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: '400',
  },

  '.typography-buttonLarge': {
    fontSize: '16px',
    lineHeight: '20px',
    fontWeight: '500',
  },
  '.typography-buttonMedium': {
    fontSize: '14px',
    lineHeight: '18px',
    fontWeight: '500',
  },
  '.typography-buttonSmall': {
    fontSize: '12px',
    lineHeight: '14px',
    fontWeight: '500',
  },

  '.typography-caption1': {
    fontSize: '14px',
    lineHeight: '16px',
    fontWeight: '500',
  },
  '.typography-caption2': {
    fontSize: '12px',
    lineHeight: '14px',
    fontWeight: '500',
  },
  '.typography-caption3': {
    fontSize: '10px',
    lineHeight: '12px',
    fontWeight: '500',
  },

  '.typography-overline1': {
    fontSize: '14px',
    lineHeight: '18px',
    fontWeight: '600',
    letterSpacing: '0.4',
  },
  '.typography-overline2': {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: '600',
    letterSpacing: '0.4',
  },
  '.typography-overline3': {
    fontSize: '10px',
    lineHeight: '12px',
    fontWeight: '600',
    letterSpacing: '0.4',
  },
}
