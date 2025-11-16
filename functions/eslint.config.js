// eslint.config.js
import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      "no-restricted-globals": ["error", "name", "length"],
      "prefer-arrow-callback": "error",
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      // The 'google' config is not directly compatible with ESLint v9's new config format.
      // The rules below are common in the Google style guide to get you started.
      // You may need to add or adjust rules to match your preferences.
      indent: ["warn", 2],
      "max-len": ["error", { code: 120, ignoreComments: true, ignoreUrls: true }],
      "require-jsdoc": "off",
      "valid-jsdoc": "off",
      "new-cap": "off", // Often needed for Firebase functions like `onRequest`
      "object-curly-spacing": ["error", "always"],
    },
  },
  {
    files: ["**/*.spec.js", "**/*.spec.mjs"],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
    rules: {
      // You can add specific rules for your test files here
    },
  },
];
