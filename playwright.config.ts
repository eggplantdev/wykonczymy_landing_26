import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

import { requireTestDatabase } from './tests/helpers/test-database'

// At module scope so it runs before the web server is spawned: the specs write rows, and the
// dev server behind them reads whatever `POSTGRES_URL` holds when the child process starts.
requireTestDatabase()

// Not 3000: that is where your own `pnpm dev` lives, pointed at production, and Playwright would
// happily reuse it — the browser would then read production while the fixtures wrote to the test
// database. A port of its own means the run always owns the server it is asserting against.
const PORT = 3100

export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: {
    command: `pnpm dev --port ${PORT}`,
    reuseExistingServer: true,
    url: `http://localhost:${PORT}`,
    env: { NEXT_DIST_DIR: '.next-e2e' },
  },
})
