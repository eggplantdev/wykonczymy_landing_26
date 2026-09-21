import { del, list } from '@vercel/blob'
import { NextResponse } from 'next/server'

import { LEADS_PREFIX } from '@/lib/blob/prefix'
import { hasRow } from '@/lib/content/submissions'
import { isAuthorizedCron } from '@/lib/cron/authorize'
import { serverEnv } from '@/lib/env.server'

// Long enough that nothing is still retrying inside it.
const ORPHAN_AGE_MS = 24 * 60 * 60 * 1000

/**
 * Reclaims what a visitor uploaded before closing the tab. Production only: preview shares this blob
 * store, so a sweep from there would delete production's files. Both conditions must hold — old
 * enough (age alone races a retry) and no queue row (which cannot see a submission never created).
 */
export async function GET(request: Request): Promise<NextResponse> {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (serverEnv.VERCEL_ENV !== 'production') {
    return NextResponse.json({ skipped: 'not production' })
  }

  // Only under `leads/` — the store root holds the CMS media.
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
