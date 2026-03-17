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
    files: [
      "demo/{cjs,issues-cjs,webpack-ts}/{lib,src,test}/**/*.{js,ts}",
      "demo/webpack-ts/webpack.config.js",
      "demo/webpack/webpack.config.js",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": 0,
    },
  },
  {
    files: ["**/test/**/*.{js,ts}"],
    rules: {
      "@typescript-eslint/no-unused-expressions": 0, // Applies to both js and ts
    },
  },
];
