module.exports = {
  extends: ['airbnb-base', 'plugin:jest/all'],
  env: { node: true },
  rules: {
    'object-curly-newline': ['error', { minProperties: 5, consistent: true }],
    'jest/prefer-expect-assertions': 'off',
  },
};
