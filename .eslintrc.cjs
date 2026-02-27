module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  ignorePatterns: [
    "dist",
    ".eslintrc.cjs",
    "node_modules",
    "*.config.js",
    "*.config.ts",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  plugins: ["@typescript-eslint", "react"],
  globals: {
    React: "readonly",
    process: "readonly",
    RequestInit: "readonly",
    JSX: "readonly",
  },
  rules: {
    "no-undef": "error",
    "react/jsx-no-undef": "error",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-empty": "warn",
  },
  overrides: [
    {
      files: ["**/*.spec.ts", "**/*.spec.tsx", "tests/**/*.ts"],
      env: { node: true, jest: true },
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
  ],
  settings: { react: { version: "detect" } },
};
