/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: [
    "dist",
    "node_modules",
    ".next",
    ".expo",
    "*.config.js",
    "*.config.mjs",
  ],
};
