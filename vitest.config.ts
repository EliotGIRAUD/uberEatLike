import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['app/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'e2e'],
  },
})

