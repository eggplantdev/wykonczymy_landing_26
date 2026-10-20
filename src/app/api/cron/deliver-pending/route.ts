import { NextResponse } from 'next/server'

import { forward } from '@/lib/contact/forward'
import type { SubmissionEnvelopeT } from '@/lib/contact/envelope'
import { deleteRow, listPending, listStuck, recordFailure } from '@/lib/content/submissions'
import { isAuthorizedCron } from '@/lib/cron/authorize'

// Bounded so one slow row cannot starve the queue.
const BATCH_SIZE = 20

// 20 sequential forwards, each with its own 10s ceiling, outruns the default function timeout.
export const maxDuration = 300

/** Delivers what the `after()` callback could not — the only reason a failed forward is not a lost lead. */
export async function GET(request: Request): Promise<NextResponse> {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await listPending(BATCH_SIZE)
  let delivered = 0
  let failed = 0

  for (const row of rows) {
    // Per row: an unhandled throw here would abandon every row after it until the next run,
    // and the next run reads the same oldest-first head, so the same row would abandon them again.
    try {
      const result = await forward(row.envelope as SubmissionEnvelopeT)

      if (result.delivered) {
        await deleteRow(row.submissionId)
        delivered += 1
        continue
      }

      await recordFailure(row.id, result.error)
      failed += 1
    } catch {
      failed += 1
    }
  }

  // Read after the loop, so a row this run pushed past the ceiling is reported by the run that
  // did it rather than half a day later.
  const stuck = await listStuck(BATCH_SIZE)

  return NextResponse.json(
    {
      attempted: rows.length,
      delivered,
      failed,
      stuck: stuck.map((row) => ({
        submissionId: row.submissionId,
        attempts: row.attempts ?? 0,
        lastError: row.lastError ?? null,
      })),
    },
    // Answering 200 to a run that delivered nothing is how a submission sat undelivered for twelve
    // hours. `failed` is deliberately not part of this condition — those rows are still being
    // retried, and colouring a transient refusal red teaches the reader to ignore the colour.
    { status: stuck.length > 0 ? 500 : 200 },
  )
}
