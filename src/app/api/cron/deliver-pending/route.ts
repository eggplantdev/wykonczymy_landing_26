import { NextResponse } from 'next/server'

import { forward } from '@/lib/contact/forward'
import type { SubmissionEnvelopeT } from '@/lib/contact/envelope'
import { deleteRow, listPending, recordFailure } from '@/lib/content/submissions'
import { isAuthorizedCron } from '@/lib/cron/authorize'

// Bounded so one slow row cannot starve the queue — fairness, not throughput.
const BATCH_SIZE = 20

/** Delivers what the `after()` callback could not — the only reason a failed forward is not a lost lead. */
export async function GET(request: Request): Promise<NextResponse> {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await listPending(BATCH_SIZE)
  let delivered = 0

  for (const row of rows) {
    const result = await forward(row.envelope as SubmissionEnvelopeT)

    if (result.delivered) {
      await deleteRow(row.submissionId)
      delivered += 1
      continue
    }

    await recordFailure(row.id, result.error)
  }

  return NextResponse.json({ attempted: rows.length, delivered })
}
