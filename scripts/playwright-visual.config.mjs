import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  testMatch: '**/.audit-visual.spec.mjs',
  respectGitIgnore: false,
  retries: 0,
  workers: 2,
})
