module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': ['error'],
    '@typescript-eslint/explicit-module-boundary-types': ['warn'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-unused-expressions': ['error'],
    '@typescript-eslint/require-await': ['error'],
    '@typescript-eslint/prefer-readonly': ['warn'],
    camelcase: 'warn',
    'default-case': 'error',
    'no-shadow': 'warn',
    'no-console': 'warn',
    'no-empty-function': ['warn', { allow: ['constructors'] }],
    'no-unused-private-class-members': 'warn',
    'no-empty': 'error',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
