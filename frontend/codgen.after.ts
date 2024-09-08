import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../backend/schema.graphql',
  documents: ['src/services/graphql/after/**'],
  overwrite: true,
  generates: {
    'src/services/graphql/after/generated/': {
      // plugins: ['typescript-type-graphql'],
      plugins: [],
      preset: 'client',
      config: {
        namingConvention: {
          enumValues: 'keep',
        },
      },
    },
  },
};

export default config;
