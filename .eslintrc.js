module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
    "cypress/globals": true
  },
  extends: [
    "plugin:react/recommended",
    "eslint:recommended",
    "standard",
    "plugin:cypress/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module"
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  plugins: ["react", "@typescript-eslint", "cypress"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    semi: "off",
    quotes: [2, "double"],
    "cypress/no-assigning-return-values": "error",
    "cypress/no-unnecessary-waiting": "error",
    "cypress/assertion-before-screenshot": "warn",
    "cypress/no-force": "warn",
    "cypress/no-async-tests": "error"
  }
};
