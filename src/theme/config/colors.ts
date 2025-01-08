import kebabCase from 'lodash/kebabCase'
import type { ThemeConfig } from 'tailwindcss/types/config'

const getRgba = (hex: string, opacity: number) => {
  const hexValue = hex.replace('#', '')
  const r = parseInt(hexValue.substring(0, 2), 16)
  const g = parseInt(hexValue.substring(2, 4), 16)
  const b = parseInt(hexValue.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export const lightPalette = {
  primaryDarker: '#53CD6A',
  primaryDark: '#69DE7F',
  primaryMain: '#82ED96',
  primaryLight: getRgba('#82ED96', 0.12),
  primaryLighter: getRgba('#82ED96', 0.06),

  secondaryDarker: '#A45CD1',
  secondaryDark: '#B876E1',
  secondaryMain: '#CD90F3',
  secondaryLight: getRgba('#CD90F3', 0.12),
  secondaryLighter: getRgba('#CD90F3', 0.06),

  successDarker: '#0F8F6F',
  successDark: '#0AA17B',
  successMain: '#00B487',
  successLight: getRgba('#00B487', 0.12),
  successLighter: getRgba('#00B487', 0.06),

  errorDarker: '#C83733',
  errorDark: '#DD3B36',
  errorMain: '#F23F3A',
  errorLight: getRgba('#F23F3A', 0.12),
  errorLighter: getRgba('#F23F3A', 0.06),

  warningDarker: '#C09027',
  warningDark: '#E1AC3B',
  warningMain: '#FFC548',
  warningLight: getRgba('#FFC548', 0.12),
  warningLighter: getRgba('#FFC548', 0.06),

  infoDarker: '#3494BE',
  infoDark: '#3B9FCB',
  infoMain: '#3DA7D5',
  infoLight: getRgba('#3DA7D5', 0.12),
  infoLighter: getRgba('#3DA7D5', 0.06),

  textPrimary: '#282828',
  textSecondary: getRgba('#282828', 0.56),
  textPlaceholder: getRgba('#282828', 0.44),
  textDisabled: getRgba('#282828', 0.28),

  componentPrimary: getRgba('#282828', 0.05),
  componentHovered: getRgba('#282828', 0.1),
  componentPressed: getRgba('#282828', 0.15),
  componentSelected: getRgba('#282828', 0.05),
  componentDisabled: getRgba('#282828', 0.05),

  backgroundPrimary: '#ffffff',
  backgroundContainer: '#FAFAFA',
  backgroundPure: '#ffffff',
  backgroundSurface1: '#ffffff',
  backgroundSurface2: '#ffffff',

  baseBlack: '#282828',
  baseWhite: '#ffffff',
  baseBackground: getRgba('#112A0A', 0.28),

  invertedDark: '#282828',
  invertedLight: '#FFFFFF',

  additionalOpacited: getRgba('#FFFFFF', 0.7),
  additionalGradient1:
    'linear-gradient(87.63deg, #45C45C -1.41%, #39CDA0 113.73%);',
  additionalGradient2:
    'linear-gradient(87.63deg, #82ED95 -1.41%, #82EDC0 113.73%);',
  additionalGradient3:
    'linear-gradient(87.63deg, #AC95DC -1.41%, #CD90F3 113.73%);',
  additionalGradient4:
    'linear-gradient(87.63deg, #383838 -1.41%, #282828 113.73%);',
}

export type BaseTheme = typeof lightPalette

export const darkPalette: BaseTheme = {
  primaryDarker: '#53CD6A',
  primaryDark: '#69DE7F',
  primaryMain: '#82ED96',
  primaryLight: getRgba('#82ED96', 0.12),
  primaryLighter: getRgba('#82ED96', 0.06),

  secondaryDarker: '#A45CD1',
  secondaryDark: '#B876E1',
  secondaryMain: '#CD90F3',
  secondaryLight: getRgba('#CD90F3', 0.12),
  secondaryLighter: getRgba('#CD90F3', 0.06),

  successDarker: '#33D2AA',
  successDark: '#20C79D',
  successMain: '#0EBB90',
  successLight: getRgba('#0EBB90', 0.12),
  successLighter: getRgba('#0EBB90', 0.06),

  errorDarker: '#F1736F',
  errorDark: '#EA615D',
  errorMain: '#E0514D',
  errorLight: getRgba('#E0514D', 0.12),
  errorLighter: getRgba('#E0514D', 0.06),

  warningDarker: '#FFD478',
  warningDark: '#FACA63',
  warningMain: '#F9C452',
  warningLight: getRgba('#F9C452', 0.12),
  warningLighter: getRgba('#F9C452', 0.06),

  infoDarker: '#65C2EA',
  infoDark: '#57B7E1',
  infoMain: '#4CB0DB',
  infoLight: getRgba('#4CB0DB', 0.12),
  infoLighter: getRgba('#4CB0DB', 0.06),

  textPrimary: '#ffffff',
  textSecondary: getRgba('#ffffff', 0.56),
  textPlaceholder: getRgba('#ffffff', 0.44),
  textDisabled: getRgba('#ffffff', 0.28),

  componentPrimary: getRgba('#ffffff', 0.05),
  componentHovered: getRgba('#ffffff', 0.1),
  componentPressed: getRgba('#ffffff', 0.15),
  componentSelected: getRgba('#ffffff', 0.05),
  componentDisabled: getRgba('#ffffff', 0.05),

  backgroundPrimary: '#111111',
  backgroundContainer: '#171717',
  backgroundPure: '#111111',
  backgroundSurface1: '#292929',
  backgroundSurface2: '#3D3D3D',

  baseBlack: '#131313',
  baseWhite: '#FFFFFF',
  baseBackground: getRgba('#112A0A', 0.28),

  invertedDark: '#F3F6F2',
  invertedLight: '#282828',

  additionalOpacited: getRgba('#000000', 0.7),
  additionalGradient1:
    'linear-gradient(87.63deg, #45C45C -1.41%, #39CDA0 113.73%);',
  additionalGradient2:
    'linear-gradient(87.63deg, #82ED95 -1.41%, #82EDC0 113.73%);',
  additionalGradient3:
    'linear-gradient(87.63deg, #AC95DC -1.41%, #CD90F3 113.73%);',
  additionalGradient4:
    'linear-gradient(87.63deg, #383838 -1.41%, #282828 113.73%);',
}

export const cssVars = {
  light: Object.entries(lightPalette).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`--${kebabCase(key)}`]: value,
    }),
    {} as Record<string, string>,
  ),
  dark: Object.entries(darkPalette).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`--${kebabCase(key)}`]: value,
    }),
    {} as Record<string, string>,
  ),
}

export const colorsScheme: BaseTheme = {
  primaryDarker: 'var(--primary-darker)',
  primaryDark: 'var(--primary-dark)',
  primaryMain: 'var(--primary-main)',
  primaryLight: 'var(--primary-light)',
  primaryLighter: 'var(--primary-lighter)',

  secondaryDarker: 'var(--secondary-darker)',
  secondaryDark: 'var(--secondary-dark)',
  secondaryMain: 'var(--secondary-main)',
  secondaryLight: 'var(--secondary-light)',
  secondaryLighter: 'var(--secondary-lighter)',

  successDarker: 'var(--success-darker)',
  successDark: 'var(--success-dark)',
  successMain: 'var(--success-main)',
  successLight: 'var(--success-light)',
  successLighter: 'var(--success-lighter)',

  errorDarker: 'var(--error-darker)',
  errorDark: 'var(--error-dark)',
  errorMain: 'var(--error-main)',
  errorLight: 'var(--error-light)',
  errorLighter: 'var(--error-lighter)',

  warningDarker: 'var(--warning-darker)',
  warningDark: 'var(--warning-dark)',
  warningMain: 'var(--warning-main)',
  warningLight: 'var(--warning-light)',
  warningLighter: 'var(--warning-lighter)',

  infoDarker: 'var(--info-darker)',
  infoDark: 'var(--info-dark)',
  infoMain: 'var(--info-main)',
  infoLight: 'var(--info-light)',
  infoLighter: 'var(--info-lighter)',

  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textPlaceholder: 'var(--text-placeholder)',
  textDisabled: 'var(--text-disabled)',

  componentPrimary: 'var(--component-primary)',
  componentHovered: 'var(--component-hovered)',
  componentPressed: 'var(--component-pressed)',
  componentSelected: 'var(--component-selected)',
  componentDisabled: 'var(--component-disabled)',

  backgroundPrimary: 'var(--background-primary)',
  backgroundContainer: 'var(--background-container)',
  backgroundPure: 'var(--background-pure)',
  backgroundSurface1: 'var(--background-surface-1)',
  backgroundSurface2: 'var(--background-surface-2)',

  baseBlack: 'var(--base-black)',
  baseWhite: 'var(--base-white)',
  baseBackground: 'var(--base-background)',

  invertedDark: 'var(--inverted-dark)',
  invertedLight: 'var(--inverted-light)',

  additionalOpacited: 'var(--additional-opacited)',
  additionalGradient1: 'var(--additional-gradient-1)',
  additionalGradient2: 'var(--additional-gradient-2)',
  additionalGradient3: 'var(--additional-gradient-3)',
  additionalGradient4: 'var(--additional-gradient-4)',
}

export const colors: ThemeConfig['colors'] = colorsScheme
