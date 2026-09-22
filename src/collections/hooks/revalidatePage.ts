import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateAllPages } from '@/lib/revalidate'

// Both statuses are consulted so unpublishing purges too — the outgoing document is the
// only place the address that just disappeared is still readable. A draft save over a live
// page purges as well; at this size that over-invalidation is cheaper than distinguishing it.
export const revalidatePage: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  if (doc?._status === 'published' || previousDoc?._status === 'published') revalidateAllPages()
  return doc
}

export const revalidatePageDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateAllPages()
  return doc
}

// Media carries no draft status to gate on — every saved row is live — and its alt text and
// file URL are rendered into pages that no other hook invalidates.
export const revalidateMedia: CollectionAfterChangeHook = ({ doc }) => {
  revalidateAllPages()
  return doc
}
