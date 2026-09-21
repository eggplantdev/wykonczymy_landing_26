import { del, list } from '@vercel/blob'

import { claimedSubmissionIds } from '@/lib/content/submissions'
import { LEADS_PREFIX, submissionIdFromPath } from './prefix'

// Long enough that nothing is still retrying inside it.
const ORPHAN_AGE_MS = 24 * 60 * 60 * 1000

export type SweepResultT = { prefixes: number; reclaimed: number; failed: number }

/**
 * Reclaims what a visitor uploaded before closing the tab. Both conditions must hold — old enough
 * (age alone races a retry) and no queue row (which cannot see a submission never created).
 */
export async function sweepOrphans(): Promise<SweepResultT> {
  const bySubmission = new Map<string, { urls: string[]; newest: number }>()

  // Paginated: `list` caps at 1000 objects per page, and a sweep that silently stopped at the first
  // one would report a truncated run as a complete one while the remainder accumulated forever.
  let cursor: string | undefined
  do {
    // Only under `leads/` — the store root holds the CMS media.
    const page = await list({ prefix: LEADS_PREFIX, cursor })

    for (const blob of page.blobs) {
      const submissionId = submissionIdFromPath(blob.pathname)
      if (!submissionId) continue

      const group = bySubmission.get(submissionId) ?? { urls: [], newest: 0 }
      group.urls.push(blob.url)
      group.newest = Math.max(group.newest, new Date(blob.uploadedAt).getTime())
      bySubmission.set(submissionId, group)
    }

    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)

  const cutoff = Date.now() - ORPHAN_AGE_MS
  const stale = [...bySubmission].filter(([, group]) => group.newest <= cutoff)
  const claimed = await claimedSubmissionIds(stale.map(([submissionId]) => submissionId))

  let reclaimed = 0
  let failed = 0

  for (const [submissionId, group] of stale) {
    if (claimed.has(submissionId)) continue

    // Per prefix, so one failing delete costs one prefix until tomorrow rather than every prefix
    // after it — the sweep restarts from the same head each day, so an abort is not self-healing.
    try {
      await del(group.urls)
      reclaimed += 1
    } catch {
      failed += 1
    }
  }

  return { prefixes: bySubmission.size, reclaimed, failed }
}
