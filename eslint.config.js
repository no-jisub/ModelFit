import eslintPluginAstro from "eslint-plugin-astro";
import tsParser from "@typescript-eslint/parser";

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
      },
    },
  },
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**"],
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
