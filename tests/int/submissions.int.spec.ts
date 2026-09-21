import { getPayload, Payload } from 'payload'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { deleteRow, enqueue, listPending, recordFailure } from '@/lib/content/submissions'

let payload: Payload

const submissionId = '11111111-2222-4333-8444-555555555555'
const envelope = { submissionId, email: 'anna.nowak@example.com' }

describe('the submissions queue', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  // Every case writes a row through `overrideAccess`, so a leaked one would burn the unique
  // index the next run asserts on.
  afterEach(async () => {
    await deleteRow(submissionId)
  })

  it('round-trips a row and deletes it by submissionId', async () => {
    const row = await enqueue(envelope)

    expect(row.submissionId).toBe(submissionId)
    expect(row.envelope).toEqual(envelope)
    expect((await listPending(10)).map((pending) => pending.submissionId)).toContain(submissionId)

    await deleteRow(submissionId)

    expect((await listPending(10)).map((pending) => pending.submissionId)).not.toContain(
      submissionId,
    )
  })

  // The unique index is what makes a redelivery idempotent — without it a retried forward
  // would queue the same enquiry twice.
  it('refuses a second row with the same submissionId', async () => {
    await enqueue(envelope)

    await expect(enqueue(envelope)).rejects.toThrow()
  })

  it('counts an attempt and stamps the error', async () => {
    const row = await enqueue(envelope)

    await recordFailure(row.id, 'ECONNREFUSED')
    const [updated] = (await listPending(10)).filter(
      (pending) => pending.submissionId === submissionId,
    )

    expect(updated.attempts).toBe(1)
    expect(updated.lastError).toBe('ECONNREFUSED')
    expect(updated.lastAttemptAt).toBeTruthy()
  })
})
