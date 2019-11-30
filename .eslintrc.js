module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'func-names': ['error', 'never'],
  },
};
