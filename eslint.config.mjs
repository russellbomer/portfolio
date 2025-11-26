import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

const nodeGlobals = {
  module: "readonly",
  require: "readonly",
  process: "readonly",
  console: "readonly",
  __dirname: "readonly",
  __filename: "readonly",
  Buffer: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
};

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  nextPlugin.configs["core-web-vitals"],
  {
    files: ["**/*.{ts,tsx,js,jsx,cjs,mjs}"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@next/next/no-img-element": "off",
      "no-empty": "off",
    },
  },
  {
    files: ["**/*.{cjs,mjs}", "scripts/**/*.{js,mjs}"],
    languageOptions: {
      globals: nodeGlobals,
    },
  },
  {
    ignores: [
      "node_modules/",
      ".next/",
      "dist/",
      "public/robots.txt",
      "public/sitemap.xml",
      "scripts/patches/**",
      "**/*.d.ts",
    ],
  }
);
