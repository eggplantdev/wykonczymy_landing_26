import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Submission } from '@/payload-types'

/**
 * All the queue knows about the wire: the id it is keyed by. The envelope's shape belongs to
 * `lib/contact/envelope.ts`, which is what the leads app agrees with — a queue that also owned
 * that shape would be a second place for it to drift.
 */
export type QueuedEnvelopeT = { submissionId: string }

const getClient = async () => getPayload({ config: await config })

export async function enqueue(envelope: QueuedEnvelopeT): Promise<Submission> {
  const payload = await getClient()

  return payload.create({
    collection: 'submissions',
    data: { submissionId: envelope.submissionId, envelope },
    overrideAccess: true,
  })
}

// A row the leads app keeps refusing must stop consuming the batch, or the oldest-first sort hands
// every run the same poisoned head and no newer lead is ever attempted again. Past the ceiling the
// row stays visible in the admin — that is the alarm — but the cron leaves it alone.
export const MAX_ATTEMPTS = 10
const RETRY_BACKOFF_MS = 10 * 60 * 1000

/** Oldest first: a submission that has been waiting longest is the one closest to being lost. */
export async function listPending(limit: number): Promise<Submission[]> {
  const payload = await getClient()

  const { docs } = await payload.find({
    collection: 'submissions',
    limit,
    sort: 'createdAt',
    where: {
      attempts: { less_than: MAX_ATTEMPTS },
      or: [
        // Never attempted, or the backoff has elapsed — the `after()` callback may still be
        // in flight on a row enqueued seconds ago, and both halves deleting it is a lost race.
        { lastAttemptAt: { exists: false } },
        {
          lastAttemptAt: {
            less_than: new Date(Date.now() - RETRY_BACKOFF_MS).toISOString(),
          },
        },
      ],
    },
    overrideAccess: true,
  })

  return docs
}

// Tolerates a row the other half of the race already deleted: the delivery happened, so there is
// no failure left to record and `findByID` would throw `NotFound` out of the whole cron batch.
export async function recordFailure(id: number, error: string): Promise<void> {
  const payload = await getClient()

  const current = await payload
    .findByID({ collection: 'submissions', id, overrideAccess: true })
    .catch(() => undefined)

  if (!current) return

  await payload.update({
    collection: 'submissions',
    id,
    data: {
      attempts: (current.attempts ?? 0) + 1,
      lastAttemptAt: new Date().toISOString(),
      lastError: error,
    },
    overrideAccess: true,
  })
}

/**
 * Keyed by `submissionId` rather than the row id, because the delete-on-delivery callback only
 * ever carries the submission — deleting nothing when the row is already gone is the point,
 * not a failure.
 */
export async function deleteRow(submissionId: string): Promise<void> {
  const payload = await getClient()

  await payload.delete({
    collection: 'submissions',
    where: { submissionId: { equals: submissionId } },
    overrideAccess: true,
  })
}

/**
 * Which of these submissions still have a queue row — a live row means the staged files are the
 * only copy, so the sweep must leave them alone. Asked for the whole batch in one query rather
 * than per prefix: the sweep's reason to exist is the day many prefixes are orphaned at once,
 * which is exactly when a round trip each hurts most. It also fails in the safe direction — a
 * database that is down aborts the sweep before anything is deleted, instead of answering
 * "no row" one prefix at a time.
 */
export async function claimedSubmissionIds(submissionIds: string[]): Promise<Set<string>> {
  if (submissionIds.length === 0) return new Set()

  const payload = await getClient()

  const { docs } = await payload.find({
    collection: 'submissions',
    limit: submissionIds.length,
    where: { submissionId: { in: submissionIds } },
    overrideAccess: true,
  })

  return new Set(docs.map((doc) => doc.submissionId))
}
