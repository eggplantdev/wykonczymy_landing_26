import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // `.tsx` too: a spec that renders a component reads as JSX, and `createElement` cannot
    // satisfy a component whose props type requires `children`.
    include: ['tests/int/**/*.int.spec.ts', 'tests/unit/**/*.spec.{ts,tsx}'],
  },
})
