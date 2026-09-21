import { beforeEach, describe, expect, it, vi } from 'vitest'

const SECRET = 'cron-secret'
const OLD = '2026-09-01T00:00:00.000Z'
const NOW = new Date('2026-09-21T12:00:00.000Z')

const blob = vi.hoisted(() => ({
  list: vi.fn(async () => ({
    blobs: [] as { url: string; pathname: string; uploadedAt: string }[],
  })),
  del: vi.fn(async () => undefined),
}))
const hasRow = vi.hoisted(() => vi.fn(async () => false))
const env = vi.hoisted(() => ({
  serverEnv: { CRON_SECRET: 'cron-secret', VERCEL_ENV: 'production' },
}))

vi.mock('@vercel/blob', () => blob)
vi.mock('@/lib/content/submissions', () => ({ hasRow }))
vi.mock('@/lib/env.server', () => env)

const { GET } = await import('@/app/api/cron/sweep-orphans/route')

const blobAt = (submissionId: string, name: string, uploadedAt: string) => ({
  url: `https://store/leads/${submissionId}/${name}`,
  pathname: `leads/${submissionId}/${name}`,
  uploadedAt,
})

const sweep = () =>
  GET(
    new Request('http://localhost/api/cron/sweep-orphans', {
      headers: { authorization: `Bearer ${SECRET}` },
    }),
  )

beforeEach(() => {
  vi.clearAllMocks()
  vi.setSystemTime(NOW)
  env.serverEnv.VERCEL_ENV = 'production'
  hasRow.mockResolvedValue(false)
  blob.list.mockResolvedValue({ blobs: [] })
})

describe('GET /api/cron/sweep-orphans', () => {
  it('reclaims an old prefix that no queue row claims', async () => {
    blob.list.mockResolvedValue({
      blobs: [blobAt('abandoned', 'a.jpg', OLD), blobAt('abandoned', 'b.jpg', OLD)],
    })

    const response = await sweep()

    expect(await response.json()).toEqual({ prefixes: 1, reclaimed: 1 })
    expect(blob.del).toHaveBeenCalledWith([
      'https://store/leads/abandoned/a.jpg',
      'https://store/leads/abandoned/b.jpg',
    ])
  })

  // Preview and production share one store, so a sweep from anywhere else deletes production's
  // files — the ones belonging to submissions still retrying.
  it('does nothing outside production', async () => {
    env.serverEnv.VERCEL_ENV = 'preview'
    blob.list.mockResolvedValue({ blobs: [blobAt('abandoned', 'a.jpg', OLD)] })

    expect(await (await sweep()).json()).toEqual({ skipped: 'not production' })
    expect(blob.list).not.toHaveBeenCalled()
  })

  it('never lists outside the leads prefix', async () => {
    await sweep()

    expect(blob.list).toHaveBeenCalledWith({ prefix: 'leads/' })
  })

  it('spares a prefix younger than the window', async () => {
    blob.list.mockResolvedValue({ blobs: [blobAt('fresh', 'a.jpg', NOW.toISOString())] })

    expect(await (await sweep()).json()).toEqual({ prefixes: 1, reclaimed: 0 })
    expect(blob.del).not.toHaveBeenCalled()
  })

  // A live row means someone is still retrying, and these bytes are the only copy that exists.
  it('spares an old prefix that still has a queue row', async () => {
    blob.list.mockResolvedValue({ blobs: [blobAt('retrying', 'a.jpg', OLD)] })
    hasRow.mockResolvedValue(true)

    expect(await (await sweep()).json()).toEqual({ prefixes: 1, reclaimed: 0 })
    expect(blob.del).not.toHaveBeenCalled()
  })

  // Age is the newest object's: a second file uploaded an hour ago means the visitor is still there.
  it('dates a prefix by its newest object', async () => {
    blob.list.mockResolvedValue({
      blobs: [blobAt('mixed', 'old.jpg', OLD), blobAt('mixed', 'new.jpg', NOW.toISOString())],
    })

    expect(await (await sweep()).json()).toEqual({ prefixes: 1, reclaimed: 0 })
  })
})
