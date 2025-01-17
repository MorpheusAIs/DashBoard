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
  /* background colors */
  backgroundPrimaryLight: '#ffffff',
  backgroundPrimaryMain: '#fbfcff',
  backgroundPrimaryDark: '#f5f6ff',

  backgroundSecondaryLight: '#eff2ff',
  backgroundSecondaryMain: '#313a36',
  backgroundSecondaryDark: '#cad4f5',

  backgroundTertiaryLight: '#4A5450',
  backgroundTertiaryMain: '#222322',
  backgroundTertiaryDark: '#1d201c',

  /* status colors */
  successLight: '#edfff2',
  successMain: '#5cc56e',
  successDark: '#278337',

  errorLight: '#fff2f2',
  errorMain: '#e3905e',
  errorDark: '#b3261e',

  warningLight: '#fff9e9',
  warningMain: '#f6851b',
  warningDark: '#e6661f',

  infoLight: '#eff2ff',
  infoMain: '#40c4ff',
  infoDark: '#0094cc',

  disablePrimaryMain: '#dbdbdb',
  disablePrimaryDark: '#808080',

  disableSecondaryMain: '#838383',
  disableSecondaryDark: '#353736',

  disableTertiaryLight: '#838383',
  disableTertiaryMain: '#454447',
  disableTertiaryDark: '#292e2c',

  /* brand colors */
  primaryLight: '#e2ecfc',
  primaryMain: '#03ff85',
  primaryDark: '#1cac77',

  secondaryLight: '#c2c9dc',
  secondaryMain: '#8d91a5',
  secondaryDark: '#5b6271',

  /* typography colors */
  textPrimaryLight: '#575761',
  textPrimaryMain: '#2d3441',
  textPrimaryDark: '#000000',

  textSecondaryLight: '#ffffff',
  textSecondaryMain: '#fdf9ff',
  textSecondaryDark: '#444b58',

  textTertiaryMain: '#cccccc',

  textPrimaryInvertLight: '#fbfcff',
  textPrimaryInvertMain: '#fbfcff',
  textPrimaryInvertDark: '#fbfbff',

  textSecondaryInvertLight: getRgba('#fffbfe', 0.5),
  textSecondaryInvertMain: getRgba('#fffbfe', 0.5),
  textSecondaryInvertDark: getRgba('#fffbfe', 0.5),

  /* border colors */
  borderPrimaryLight: '#fdf9ff',
  borderPrimaryMain: '#908e93',
  borderPrimaryDark: '#45484f',

  borderSecondaryLight: '#e0e0ec',
  borderSecondaryMain: '#c4c4d0',
  borderSecondaryDark: '#a9abb4',

  borderTertiaryLight: '#989898',
  borderTertiaryMain: '#494949',

  borderQuaternaryLight: '#cacaca',
  borderQuaternaryMain: '#7c7c7d',

  /* backdrop colors */
  backdropModal: getRgba('#000000', 0.5),
}

export type BaseTheme = typeof lightPalette

export const darkPalette: BaseTheme = {
  /* background colors */
  backgroundPrimaryLight: '#ffffff',
  backgroundPrimaryMain: '#fbfcff',
  backgroundPrimaryDark: '#f5f6ff',

  backgroundSecondaryLight: '#eff2ff',
  backgroundSecondaryMain: '#313a36',
  backgroundSecondaryDark: '#cad4f5',

  backgroundTertiaryLight: '#4A5450',
  backgroundTertiaryMain: '#222322',
  backgroundTertiaryDark: '#1d201c',

  /* status colors */
  successLight: '#edfff2',
  successMain: '#5cc56e',
  successDark: '#278337',

  errorLight: '#fff2f2',
  errorMain: '#e3905e',
  errorDark: '#b3261e',

  warningLight: '#fff9e9',
  warningMain: '#f6851b',
  warningDark: '#e6661f',

  infoLight: '#eff2ff',
  infoMain: '#40c4ff',
  infoDark: '#0094cc',

  disablePrimaryMain: '#dbdbdb',
  disablePrimaryDark: '#808080',

  disableSecondaryMain: '#838383',
  disableSecondaryDark: '#353736',

  disableTertiaryLight: '#838383',
  disableTertiaryMain: '#454447',
  disableTertiaryDark: '#292e2c',

  /* brand colors */
  primaryLight: '#e2ecfc',
  primaryMain: '#03ff85',
  primaryDark: '#1cac77',

  secondaryLight: '#c2c9dc',
  secondaryMain: '#8d91a5',
  secondaryDark: '#5b6271',

  /* typography colors */
  textPrimaryLight: '#575761',
  textPrimaryMain: '#2d3441',
  textPrimaryDark: '#000000',

  textSecondaryLight: '#ffffff',
  textSecondaryMain: '#fdf9ff',
  textSecondaryDark: '#444b58',

  textTertiaryMain: '#cccccc',

  textPrimaryInvertLight: '#fbfcff',
  textPrimaryInvertMain: '#fbfcff',
  textPrimaryInvertDark: '#fbfbff',

  textSecondaryInvertLight: getRgba('#fffbfe', 0.5),
  textSecondaryInvertMain: getRgba('#fffbfe', 0.5),
  textSecondaryInvertDark: getRgba('#fffbfe', 0.5),

  /* border colors */
  borderPrimaryLight: '#fdf9ff',
  borderPrimaryMain: '#908e93',
  borderPrimaryDark: '#45484f',

  borderSecondaryLight: '#e0e0ec',
  borderSecondaryMain: '#c4c4d0',
  borderSecondaryDark: '#a9abb4',

  borderTertiaryLight: '#989898',
  borderTertiaryMain: '#494949',

  borderQuaternaryLight: '#cacaca',
  borderQuaternaryMain: '#7c7c7d',

  /* backdrop colors */
  backdropModal: getRgba('#000000', 0.5),
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
  backgroundPrimaryLight: 'var(--background-primary-light)',
  backgroundPrimaryMain: 'var(--background-primary-main)',
  backgroundPrimaryDark: 'var(--background-primary-dark)',
  backgroundSecondaryLight: 'var(--background-secondary-light)',
  backgroundSecondaryMain: 'var(--background-secondary-main)',
  backgroundSecondaryDark: 'var(--background-secondary-dark)',
  backgroundTertiaryLight: 'var(--background-tertiary-light)',
  backgroundTertiaryMain: 'var(--background-tertiary-main)',
  backgroundTertiaryDark: 'var(--background-tertiary-dark)',
  successLight: 'var(--success-light)',
  successMain: 'var(--success-main)',
  successDark: 'var(--success-dark)',
  errorLight: 'var(--error-light)',
  errorMain: 'var(--error-main)',
  errorDark: 'var(--error-dark)',
  warningLight: 'var(--warning-light)',
  warningMain: 'var(--warning-main)',
  warningDark: 'var(--warning-dark)',
  infoLight: 'var(--info-light)',
  infoMain: 'var(--info-main)',
  infoDark: 'var(--info-dark)',
  disablePrimaryMain: 'var(--disable-primary-main)',
  disablePrimaryDark: 'var(--disable-primary-dark)',
  disableSecondaryMain: 'var(--disable-secondary-main)',
  disableSecondaryDark: 'var(--disable-secondary-dark)',
  disableTertiaryLight: 'var(--disable-tertiary-light)',
  disableTertiaryMain: 'var(--disable-tertiary-main)',
  disableTertiaryDark: 'var(--disable-tertiary-dark)',
  primaryLight: 'var(--primary-light)',
  primaryMain: 'var(--primary-main)',
  primaryDark: 'var(--primary-dark)',
  secondaryLight: 'var(--secondary-light)',
  secondaryMain: 'var(--secondary-main)',
  secondaryDark: 'var(--secondary-dark)',
  textPrimaryLight: 'var(--text-primary-light)',
  textPrimaryMain: 'var(--text-primary-main)',
  textPrimaryDark: 'var(--text-primary-dark)',
  textSecondaryLight: 'var(--text-secondary-light)',
  textSecondaryMain: 'var(--text-secondary-main)',
  textSecondaryDark: 'var(--text-secondary-dark)',
  textTertiaryMain: 'var(--text-tertiary-main)',
  textPrimaryInvertLight: 'var(--text-primary-invert-light)',
  textPrimaryInvertMain: 'var(--text-primary-invert-main)',
  textPrimaryInvertDark: 'var(--text-primary-invert-dark)',
  textSecondaryInvertLight: 'var(--text-secondary-invert-light)',
  textSecondaryInvertMain: 'var(--text-secondary-invert-main)',
  textSecondaryInvertDark: 'var(--text-secondary-invert-dark)',
  borderPrimaryLight: 'var(--border-primary-light)',
  borderPrimaryMain: 'var(--border-primary-main)',
  borderPrimaryDark: 'var(--border-primary-dark)',
  borderSecondaryLight: 'var(--border-secondary-light)',
  borderSecondaryMain: 'var(--border-secondary-main)',
  borderSecondaryDark: 'var(--border-secondary-dark)',
  borderTertiaryLight: 'var(--border-tertiary-light)',
  borderTertiaryMain: 'var(--border-tertiary-main)',
  borderQuaternaryLight: 'var(--border-quaternary-light)',
  borderQuaternaryMain: 'var(--border-quaternary-main)',
  backdropModal: 'var(--backdrop-modal)',
}

export const colors: ThemeConfig['colors'] = colorsScheme
