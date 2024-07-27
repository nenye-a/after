module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    requireConfigFile: false,
    sourceType: 'module',
    tsconfigRootDir: '.',
    project: ['./tsconfig.json'],
  },
  plugins: ['prettier', '@typescript-eslint', 'graphql'],
  rules: {
    // Custom rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prettier/prettier': ['warn'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx'],
      },
      typescript: {},
    },
  },
  // overrides: [
  //   {
  //     files: ['**/*.ts', '**/*.tsx'],
  //     rules: {
  //       '@typescript-eslint/explicit-module-boundary-types': 'off',
  //     },
  //   },
  //   // {
  //   //   files: ['**/*.graphql'],
  //   //   parser: 'eslint-plugin-graphql',
  //   //   plugins: ['graphql'],
  //   //   // rules: {
  //   //   //   'graphql/template-strings': [
  //   //   //     'error',
  //   //   //     {
  //   //   //       env: 'literal',
  //   //   //       schemaJson: require('./path/to/your/schema.json'), // Update with the correct path to your schema.json
  //   //   //     },
  //   //   //   ],
  //   //   // },
  //   // },
  // ],
};
