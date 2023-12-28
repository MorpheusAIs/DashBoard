import checker from 'vite-plugin-checker'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

/**
 * @description Enable import if you need polyfills
 *
 * import { nodePolyfills } from 'vite-plugin-node-polyfills'
 * import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
 * import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
 */

import * as fs from 'fs'
import * as path from 'path'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relative: string) => path.resolve(appDirectory, relative)
const root = path.resolve(__dirname, resolveApp('src'))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const isProduction = env.VITE_ENVIRONMENT === 'production'
  const isDevelopment = env.VITE_ENVIRONMENT === 'development'
  const isAnalyze = env.VITE_ENVIRONMENT === 'analyze'
  const buildVersion = env.VITE_BUILD_VERSION

  return {
    ...(env.VITE_PORT
      ? {
          server: {
            port: Number(env.VITE_PORT),
          },
        }
      : {}),
    publicDir: 'static',
    plugins: [
      vue(),

      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: '[name]',
      }),
      checker({
        overlay: {
          initialIsOpen: false,
        },
        typescript: true,
        eslint: {
          lintCommand:
            'eslint "{src,config}/**/*.{vue,js,ts}" --cache --max-warnings=0',
        },
      }),
      ...(isAnalyze
        ? [
            visualizer({
              open: true,
            }),
          ]
        : []),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: [
            '@import "@/styles/_functions.scss";',
            '@import "@/styles/_mixins.scss";',
          ].join(''),
        },
      },
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      dedupe: ['vue', '@vueuse/core', 'lodash'],
      alias: {
        '@': `${root}/`,
        '@config': `${root}/config.ts`,
        '@static': `${root}/../static`,
      },
    },
    /**
     * @description Enable configuration for polyfills
     *
     * optimizeDeps: {
     *       esbuildOptions: {
     *         define: {
     *           global: 'globalThis',
     *         },
     *       },
     *       // Enable esbuild polyfill plugins
     *       plugins: [
     *         NodeGlobalsPolyfillPlugin({
     *           process: true,
     *           buffer: true,
     *         }),
     *         NodeModulesPolyfillPlugin(),
     *       ],
     *     },
     *     build: {
     *       target: 'esnext',
     *       rollupOptions: {
     *         plugins: [
     *           // Enable rollup polyfills plugin
     *           // used during production bundling
     *           nodePolyfills(),
     *         ],
     *       },
     *     },
     */
  }
})
