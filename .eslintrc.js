module.exports = {
  extends: ["airbnb", "prettier"],
  plugins: ["prettier"],
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true
  },
  rules: {
    "prettier/prettier": ["error"],
    "func-names": ["error", "never"]
  }
};
