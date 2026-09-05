import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

// A write's blast radius isn't knowable from the document alone: one page answers at
// two addresses, its slug is editable, and the home type moves `/` between documents — so a
// rename or a delete orphans an address the write never mentions. At six pages,
// invalidating the whole layout is cheaper than tracking which address moved.
export function revalidateAllPages() {
  try {
    revalidatePath('/', 'layout')
  } catch (error) {
    // Hooks also run outside a request (seed script, `payload run`), where
    // revalidatePath throws — nothing is cached there, so nothing to invalidate.
    // Logged rather than swallowed so a genuine cache failure is not silent.
    console.warn('revalidatePath skipped', error)
  }
}

// A draft save changes nothing the site serves, so it does not earn a cache purge —
// but the publish/unpublish transitions do, which is why both statuses are consulted.
export const revalidatePage: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  if (doc?._status === 'published' || previousDoc?._status === 'published') revalidateAllPages()
  return doc
}

export const revalidatePageDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateAllPages()
  return doc
}
