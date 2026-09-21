import { del, list } from '@vercel/blob'

import { leadPrefix } from './prefix'

// The target list is re-derived from our own prefix, never taken from the caller: a delete that
// names its own targets is a delete primitive handed to whoever can replay the request.
export async function deleteSubmissionFiles(submissionId: string): Promise<number> {
  const { blobs } = await list({ prefix: leadPrefix(submissionId) })

  if (blobs.length === 0) return 0

  await del(blobs.map((blob) => blob.url))

  return blobs.length
}
