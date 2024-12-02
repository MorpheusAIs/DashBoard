import type { CodegenConfig } from '@graphql-codegen/cli'
import * as path from 'path'

const config: CodegenConfig = {
  overwrite: true,
  schema: ['https://api.studio.thegraph.com/query/73688/kkk/version/latest'],
  documents: [
    path.resolve(__dirname, './graphql/**/*.graphql'),
    path.resolve(__dirname, './graphql/**/**/*.graphql'),
  ],
  generates: {
    ['src/types/graphql/index.ts']: {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
}

export default config
