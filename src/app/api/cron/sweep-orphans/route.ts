import { del, list } from '@vercel/blob'
import { NextResponse } from 'next/server'

import { LEADS_PREFIX } from '@/lib/blob/prefix'
import { hasRow } from '@/lib/content/submissions'
import { isAuthorizedCron } from '@/lib/cron/authorize'
import { serverEnv } from '@/lib/env.server'

// Long enough that no submission is still retrying inside it. The cost of being wrong in the other
// direction is only a file that lives a day longer than it had to.
const ORPHAN_AGE_MS = 24 * 60 * 60 * 1000

/**
 * Reclaims what a visitor uploaded before closing the tab: bytes no queue row ever claimed and no
 * delivery callback will ever mention.
 *
 * Production only, and that is not hygiene. Preview and Production resolve to the same blob store,
 * so `leads/` is a shared prefix — a sweep run from a preview deploy would delete files belonging to
 * submissions still retrying in production.
 *
 * Both conditions have to hold before a prefix goes: old enough, and no live queue row. Age alone
 * races a submission still retrying; the queue check alone cannot see one that was never created.
 */
export async function GET(request: Request): Promise<NextResponse> {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (serverEnv.VERCEL_ENV !== 'production') {
    return NextResponse.json({ skipped: 'not production' })
  }

  // Only under `leads/` — the store root is where this site's CMS media lives.
  const { blobs } = await list({ prefix: LEADS_PREFIX })

  const bySubmission = new Map<string, { urls: string[]; newest: number }>()
  for (const blob of blobs) {
    const submissionId = blob.pathname.slice(LEADS_PREFIX.length).split('/')[0]
    if (!submissionId) continue

    const group = bySubmission.get(submissionId) ?? { urls: [], newest: 0 }
    group.urls.push(blob.url)
    group.newest = Math.max(group.newest, new Date(blob.uploadedAt).getTime())
    bySubmission.set(submissionId, group)
  }

  const cutoff = Date.now() - ORPHAN_AGE_MS
  let reclaimed = 0

  for (const [submissionId, group] of bySubmission) {
    if (group.newest > cutoff) continue
    if (await hasRow(submissionId)) continue

    await del(group.urls)
    reclaimed += 1
  }

  return NextResponse.json({ prefixes: bySubmission.size, reclaimed })
}
