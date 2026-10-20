import { beforeEach, describe, expect, it, vi } from 'vitest'

const SECRET = 'cron-secret'

const queue = vi.hoisted(() => ({
  listPending: vi.fn(async () => [] as { id: number; submissionId: string; envelope: unknown }[]),
  listStuck: vi.fn(
    async () => [] as { submissionId: string; attempts: number; lastError: string | null }[],
  ),
  deleteRow: vi.fn(async () => undefined),
  recordFailure: vi.fn(async () => undefined),
}))
const forward = vi.hoisted(() =>
  vi.fn<() => Promise<{ delivered: true } | { delivered: false; error: string }>>(async () => ({
    delivered: true,
  })),
)

vi.mock('@/lib/content/submissions', () => queue)
vi.mock('@/lib/contact/forward', () => ({ forward }))
vi.mock('@/lib/env.server', () => ({ serverEnv: { CRON_SECRET: SECRET } }))

const { GET } = await import('@/app/api/cron/deliver-pending/route')

const row = (id: number) => ({ id, submissionId: `submission-${id}`, envelope: { id } })

const run = () =>
  GET(
    new Request('http://localhost/api/cron/deliver-pending/', {
      headers: { authorization: `Bearer ${SECRET}` },
    }),
  )

beforeEach(() => {
  vi.clearAllMocks()
  forward.mockResolvedValue({ delivered: true })
  queue.listPending.mockResolvedValue([])
  queue.listStuck.mockResolvedValue([])
})

describe('GET /api/cron/deliver-pending', () => {
  it('deletes each row it delivers', async () => {
    queue.listPending.mockResolvedValue([row(1), row(2)])

    expect(await (await run()).json()).toEqual({ attempted: 2, delivered: 2, failed: 0, stuck: [] })
    expect(queue.deleteRow).toHaveBeenCalledWith('submission-1')
    expect(queue.recordFailure).not.toHaveBeenCalled()
  })

  it('keeps a row the leads app refused and records why', async () => {
    queue.listPending.mockResolvedValue([row(1)])
    forward.mockResolvedValue({ delivered: false, error: 'Leads app answered 403' })

    expect(await (await run()).json()).toEqual({ attempted: 1, delivered: 0, failed: 1, stuck: [] })
    expect(queue.recordFailure).toHaveBeenCalledWith(1, 'Leads app answered 403')
    expect(queue.deleteRow).not.toHaveBeenCalled()
  })

  // Regression: the loop had no try/catch, so the first throwing row abandoned every row behind it
  // until the next run — and the next run reads the same oldest-first head.
  it('finishes the batch when one row throws', async () => {
    queue.listPending.mockResolvedValue([row(1), row(2), row(3)])
    forward.mockRejectedValueOnce(new Error('row 1 exploded'))

    expect(await (await run()).json()).toEqual({ attempted: 3, delivered: 2, failed: 1, stuck: [] })
    expect(queue.deleteRow).toHaveBeenCalledTimes(2)
  })

  // Regression: a submission sat undelivered for twelve hours because this route answered 200 to
  // a run that delivered nothing. A row past MAX_ATTEMPTS is never retried again, so its existence
  // is the one queue state that is both silent and permanent.
  it('fails the invocation while a row has stopped being retried', async () => {
    queue.listStuck.mockResolvedValue([
      { submissionId: 'submission-9', attempts: 10, lastError: 'Leads app answered 401' },
    ])

    const response = await run()

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      attempted: 0,
      delivered: 0,
      failed: 0,
      stuck: [{ submissionId: 'submission-9', attempts: 10, lastError: 'Leads app answered 401' }],
    })
  })

  // A failure the cron will retry is not the alarm — flagging it would turn every transient
  // refusal red and train the reader to ignore the colour.
  it('stays green while a failure is still being retried', async () => {
    queue.listPending.mockResolvedValue([row(1)])
    forward.mockResolvedValue({ delivered: false, error: 'Leads app answered 503' })

    expect((await run()).status).toBe(200)
  })

  it('refuses a request without the cron secret', async () => {
    const response = await GET(new Request('http://localhost/api/cron/deliver-pending/'))

    expect(response.status).toBe(401)
    expect(queue.listPending).not.toHaveBeenCalled()
  })
})
