import { timingSafeEqual } from 'node:crypto'

import { serverEnv } from '@/lib/env.server'

// The cron paths are ordinary public routes — without this the sweep is a public delete primitive.
export function isAuthorizedCron(request: Request): boolean {
  const expected = Buffer.from(`Bearer ${serverEnv.CRON_SECRET}`)
  const received = Buffer.from(request.headers.get('authorization') ?? '')

  return expected.length === received.length && timingSafeEqual(expected, received)
}
