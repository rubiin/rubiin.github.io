/** @type {import('lint-staged').Config} */
export default {
  '*.{ts,tsx,js,jsx,mjs}': ['oxlint --fix --deny-warnings', 'oxfmt'],
  '*.{css,json,md,mdx,yml,yaml}': ['oxfmt'],
}
