/**
 * ESLint flat config.
 *
 * Ported from the computerexpress-darius-site WU-006 work unit, which canonical
 * never received — this project had no linter at all. Adapted for this repo:
 * the ignore list covers the generated/cache directories that only exist here,
 * and browser + node globals are declared so `no-undef` does not fire on
 * `window`, `document`, `fetch`, `crypto` or `process`.
 */
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'dist-ssr/**',
      'node_modules/**',
      'coverage/**',
      'artifacts/**',
      'graphify-out/**',
      '.wrangler/**',
      '.hermes/**',
      '.agents/**',
      '.claude/**',
      '.antigravity/**',
      '.helloagents/**',
      // Minified build output committed on 2026-09-03 (assets/index-*.js is a
      // 267 KB vendor bundle). Linting minified code produced 2345 of the 2386
      // findings on the first run and buried the 41 real ones.
      'assets/**',
      '*.retired',
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // This is a news site: article and policy pages are long-form prose full of
      // apostrophes. A straight quote in JSX text renders correctly, so requiring
      // &apos; throughout the copy would add hundreds of entities without fixing a
      // defect. The rule is worth having in a component library, not here.
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      // Cloudflare Pages Functions receive `context`; empty catch blocks are used
      // deliberately for best-effort side effects such as mail notifications.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
)
