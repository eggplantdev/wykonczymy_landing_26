import { NextResponse } from 'next/server'

import { sweepOrphans } from '@/lib/blob/sweep'
import { isAuthorizedCron } from '@/lib/cron/authorize'
import { serverEnv } from '@/lib/env.server'

// A full sweep is one paginated listing plus a Payload count per prefix, so it outruns the default.
export const maxDuration = 300

/** Production only: preview shares this blob store, so a sweep from there would delete its files. */
export async function GET(request: Request): Promise<NextResponse> {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (serverEnv.VERCEL_ENV !== 'production') {
    return NextResponse.json({ skipped: 'not production' })
  }

  return NextResponse.json(await sweepOrphans())
}
