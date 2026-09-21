import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Submission } from '@/payload-types'

/**
 * All the queue knows about the wire: the id it is keyed by. The envelope's shape belongs to
 * `lib/contact/envelope.ts`, which is what the leads app agrees with — a queue that also owned
 * that shape would be a second place for it to drift.
 */
export type QueuedEnvelopeT = { submissionId: string }

// Every write goes through `overrideAccess`, because the collection refuses create, update and
// delete through access control — the admin is a window onto the queue, not a way into it.
const getClient = async () => getPayload({ config: await config })

export async function enqueue(envelope: QueuedEnvelopeT): Promise<Submission> {
  const payload = await getClient()

  return payload.create({
    collection: 'submissions',
    data: { submissionId: envelope.submissionId, envelope },
    overrideAccess: true,
  })
}

/** Oldest first: a submission that has been waiting longest is the one closest to being lost. */
export async function listPending(limit: number): Promise<Submission[]> {
  const payload = await getClient()

  const { docs } = await payload.find({
    collection: 'submissions',
    limit,
    sort: 'createdAt',
    overrideAccess: true,
  })

  return docs
}

export async function recordFailure(id: number, error: string): Promise<void> {
  const payload = await getClient()

  const current = await payload.findByID({ collection: 'submissions', id, overrideAccess: true })

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
 * Whether a submission is still waiting to be delivered. The sweep asks before reclaiming a prefix:
 * a row means someone is still retrying, and its files are the only copy that exists.
 */
export async function hasRow(submissionId: string): Promise<boolean> {
  const payload = await getClient()

  const { totalDocs } = await payload.count({
    collection: 'submissions',
    where: { submissionId: { equals: submissionId } },
    overrideAccess: true,
  })

  return totalDocs > 0
}
