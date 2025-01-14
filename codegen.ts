import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema:
    'https://api.studio.thegraph.com/query/73688/lumerin-node-testnet/version/latest',
  documents: ['src/**/*.graphql'],
  generates: {
    'src/types/graphql/index.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
}

export default config
