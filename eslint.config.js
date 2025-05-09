import globals from "globals";
import js from "@eslint/js";
import mocha from "eslint-plugin-mocha";
import prettier from "eslint-plugin-prettier/recommended";

export default [
  {
    ignores: ["**/node_modules/", "**/dist/"],
  },
  {
    languageOptions: { globals: { ...globals.node } },
  },
  js.configs.recommended,
  mocha.configs.recommended,
  prettier,
  {
    files: ["demo/webpack/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
