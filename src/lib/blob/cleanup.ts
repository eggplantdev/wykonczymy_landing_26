import { del, list } from '@vercel/blob'

import { leadPrefix } from './prefix'

/**
 * Deletes everything one submission staged, and nothing else. The target list is re-derived from
 * this store's own prefix rather than taken from whoever asked — a delete that names its own targets
 * is a delete primitive handed to anyone who can forge or replay the request.
 *
 * Deleting an empty prefix is a success, not a failure: that is what makes a replayed callback
 * idempotent.
 */
export async function deleteSubmissionFiles(submissionId: string): Promise<number> {
  const { blobs } = await list({ prefix: leadPrefix(submissionId) })

  if (blobs.length === 0) return 0

  await del(blobs.map((blob) => blob.url))

  return blobs.length
}
