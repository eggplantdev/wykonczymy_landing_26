import { timingSafeEqual } from 'node:crypto'

import { serverEnv } from '@/lib/env.server'

/**
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET`, and the routes are ordinary public paths
 * — anyone can `GET` them. Without this, the sweep is a delete primitive exposed to the internet.
 */
export function isAuthorizedCron(request: Request): boolean {
  const expected = Buffer.from(`Bearer ${serverEnv.CRON_SECRET}`)
  const received = Buffer.from(request.headers.get('authorization') ?? '')

  return expected.length === received.length && timingSafeEqual(expected, received)
}
