import globals from "globals";
import js from "@eslint/js";
import mocha from "eslint-plugin-mocha";
import prettier from "eslint-plugin-prettier/recommended";

export default [
  {
    ignores: ["dist/**"],
  },
  {
    languageOptions: { globals: { ...globals.node } },
  },
  js.configs.recommended,
  mocha.configs.flat.recommended,
  prettier,
];
