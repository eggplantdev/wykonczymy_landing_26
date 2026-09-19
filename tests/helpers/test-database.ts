// Neon's pooler is a second hostname for the same database, so a URL that differs from
// production only by `-pooler` is still production.
function databaseHost(url: string): string {
  return new URL(url).hostname.replace('-pooler', '').toLowerCase()
}

// `POSTGRES_URL` points at production in every environment, laptop included — and these suites
// create and delete rows: a full-CRUD admin user, and a published project that appears on
// `/realizacje/`. So the tests do not read that variable, they overwrite it from
// `TEST_POSTGRES_URL` before anything opens a pool, and refuse to run at all if that turns out
// to name the production host anyway.
//
// The overwrite is what the spawned dev server inherits too: `@next/env` only fills keys that
// were absent from the process it started with, so `.env` cannot put production back.
export function requireTestDatabase(): string {
  const testUrl = process.env.TEST_POSTGRES_URL
  const productionUrl = process.env.PROD_POSTGRES_URL

  if (!testUrl) {
    throw new Error(
      'TEST_POSTGRES_URL is unset. The suites write rows, so they will not fall back to POSTGRES_URL — see .env.example.',
    )
  }

  if (productionUrl && databaseHost(testUrl) === databaseHost(productionUrl)) {
    throw new Error(
      `TEST_POSTGRES_URL resolves to the production host (${databaseHost(testUrl)}). Refusing to run.`,
    )
  }

  process.env.POSTGRES_URL = testUrl

  return testUrl
}
