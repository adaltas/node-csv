import globals from "globals";
import js from "@eslint/js";
import ts from "typescript-eslint";
import mocha from "eslint-plugin-mocha";
import prettier from "eslint-plugin-prettier/recommended";
// const __dirname = new URL(".", import.meta.url).pathname;

export default [
  {
    ignores: ["**/node_modules/", "**/dist/"],
  },
  {
    languageOptions: { globals: { ...globals.node } },
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  mocha.configs.recommended,
  prettier,
  // {
  //   files: ["**/*.ts"],
  //   languageOptions: {
  //     parserOptions: {
  //       project: true,
  //     },
  //   },
  // },
  {
    files: ["demo/webpack/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["**/test/**/*.js", "**/test/**/*.ts"],
    languageOptions: {
      // globals: {
      //   ...globals.mocha,
      // },
      // https://typescript-eslint.io/blog/parser-options-project-true/
      // parserOptions: {
      //   project: ["./packages/csv/tsconfig.json"],
      //   tsconfigRootDir: __dirname,
      // },
      // parserOptions: {
      //   project: true,
      //   tsconfigRootDir: __dirname,
      // },
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": 0, // Applies to both js and ts
    },
  },
];
