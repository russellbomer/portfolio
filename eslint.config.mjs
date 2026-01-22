// Root eslint config for monorepo
// Each workspace (apps/portfolio, apps/terminal) has its own eslint.config.mjs
// Pre-commit hook runs eslint from within each workspace
export default [
  {
    ignores: ["**/node_modules/", "**/.next/", "**/dist/", "apps/**"],
  },
];
