import { describe, expect, it, vi } from 'vitest'

const SECRET = 'cron-secret'

// Enough for an authorized request to run to its end: what is under test is the guard in front of
// it, and the 401 cases never reach any of these.
vi.mock('@vercel/blob', () => ({ list: async () => ({ blobs: [] }), del: async () => undefined }))
vi.mock('@/lib/content/submissions', () => ({
  claimedSubmissionIds: async () => new Set(),
  listPending: async () => [],
  deleteRow: async () => undefined,
  recordFailure: async () => undefined,
}))
vi.mock('@/lib/contact/forward', () => ({ forward: async () => ({ delivered: true }) }))
vi.mock('@/lib/env.server', () => ({
  serverEnv: { CRON_SECRET: SECRET, VERCEL_ENV: 'production' },
}))

const { GET: deliverPending } = await import('@/app/api/cron/deliver-pending/route')
const { GET: sweepOrphans } = await import('@/app/api/cron/sweep-orphans/route')

// Both are ordinary public paths — anyone can GET them, and one of the two deletes files.
const routes = [
  ['deliver-pending', deliverPending],
  ['sweep-orphans', sweepOrphans],
] as const

const request = (headers: HeadersInit = {}) =>
  new Request('http://localhost/api/cron/x', { headers })

describe.each(routes)('GET /api/cron/%s', (_name, route) => {
  it('refuses a request with no authorization header', async () => {
    expect((await route(request())).status).toBe(401)
  })

  it('refuses the wrong secret', async () => {
    expect((await route(request({ authorization: 'Bearer nope' }))).status).toBe(401)
  })

  // `timingSafeEqual` throws on a length mismatch, so a short token must be a 401, not a 500.
  it('refuses a truncated bearer token', async () => {
    expect((await route(request({ authorization: 'Bearer' }))).status).toBe(401)
  })

  it('accepts the cron secret', async () => {
    expect((await route(request({ authorization: `Bearer ${SECRET}` }))).status).not.toBe(401)
  })
})
