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
