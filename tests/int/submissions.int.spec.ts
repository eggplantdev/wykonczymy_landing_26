import { getPayload, Payload } from 'payload'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import {
  claimedSubmissionIds,
  deleteRow,
  enqueue,
  listPending,
  MAX_ATTEMPTS,
  recordFailure,
} from '@/lib/content/submissions'

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
    const updated = await payload.findByID({
      collection: 'submissions',
      id: row.id,
      overrideAccess: true,
    })

    expect(updated.attempts).toBe(1)
    expect(updated.lastError).toBe('ECONNREFUSED')
    expect(updated.lastAttemptAt).toBeTruthy()
  })

  // The row the leads app just refused must not come straight back on the next run: without a
  // backoff the cron re-forwards it every fifteen minutes and burns the batch on the same head.
  it('holds a just-attempted row back until its backoff elapses', async () => {
    const row = await enqueue(envelope)
    await recordFailure(row.id, 'Leads app answered 500')

    expect((await listPending(10)).map((pending) => pending.id)).not.toContain(row.id)
  })

  // Past the ceiling the row stops being retried but stays in the admin — that list IS the alarm.
  it('stops offering a row that has exhausted its attempts, without deleting it', async () => {
    const row = await enqueue(envelope)
    await payload.update({
      collection: 'submissions',
      id: row.id,
      data: { attempts: MAX_ATTEMPTS, lastAttemptAt: new Date(0).toISOString() },
      overrideAccess: true,
    })

    expect((await listPending(10)).map((pending) => pending.id)).not.toContain(row.id)
    expect(await claimedSubmissionIds([submissionId])).toContain(submissionId)
  })

  // The sweep asks about every stale prefix at once, and the ids it asks about are mostly rows
  // that no longer exist — an answer that leaked those back would delete live attachments.
  it('reports only the submissions that still have a row', async () => {
    await enqueue(envelope)

    const claimed = await claimedSubmissionIds([
      submissionId,
      '99999999-8888-4777-8666-555544443333',
    ])

    expect([...claimed]).toEqual([submissionId])
    expect(await claimedSubmissionIds([])).toEqual(new Set())
  })

  // A row the other half of the race already delivered is not a failure to record — and throwing
  // here would take the rest of the cron batch with it.
  it('ignores a failure recorded against a row that is already gone', async () => {
    const row = await enqueue(envelope)
    await deleteRow(submissionId)

    await expect(recordFailure(row.id, 'Leads app answered 500')).resolves.toBeUndefined()
  })
})
