import { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

import { colors, cssVars, fontFamily, typography } from './src/theme/config'

const config: Config = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors,
      fontFamily,
    },
  },
  plugins: [
    plugin(({ addBase }) =>
      addBase({
        ':root': {
          ...cssVars.dark,
        },
        "[data-theme='light']:root": {
          ...cssVars.light,
        },
      }),
    ),

    plugin(({ addUtilities }) => {
      addUtilities(typography)
    }),
  ],
}

export default config
