module.exports = {
  env: {
    node: true,
    // es2021: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: '.',
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'graphql'],
  rules: {
    // Custom rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prettier/prettier': 'error',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx'],
      },
      typescript: {},
    },
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      files: ['**/*.graphql'],
      parser: 'eslint-plugin-graphql',
      plugins: ['graphql'],
      // rules: {
      //   'graphql/template-strings': [
      //     'error',
      //     {
      //       env: 'literal',
      //       schemaJson: require('./path/to/your/schema.json'), // Update with the correct path to your schema.json
      //     },
      //   ],
      // },
    },
  ],
};
