import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import coveragePolicy from './.coverage-thresholds.json' with { type: 'json' }

const threshold = coveragePolicy.enforcement.threshold

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    globals: true,
    coverage: {
      provider: 'v8',
      include: coveragePolicy.enforcement.include,
      thresholds: {
        lines: threshold,
        functions: threshold,
        branches: threshold,
        statements: threshold,
        perFile: true,
      },
    },
  },
})
