module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-base', 'plugin:jest/all'],
  plugins: ['@typescript-eslint'],
  env: { node: true },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'object-curly-newline': ['error', { minProperties: 5, consistent: true }],
    'jest/prefer-expect-assertions': 'off',
  },
};
