import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

// A write's blast radius isn't knowable from the document alone: one page answers at
// two addresses, its slug is editable, and the home type moves `/` between documents — so a
// rename or a delete orphans an address the write never mentions. At six pages,
// invalidating the whole layout is cheaper than tracking which address moved.
function revalidateAllPages() {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Hooks also run outside a request (seed script, `payload run`), where
    // revalidatePath throws — nothing is cached there, so nothing to invalidate.
  }
}

export const revalidatePage: CollectionAfterChangeHook = ({ doc }) => {
  revalidateAllPages()
  return doc
}

export const revalidatePageDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateAllPages()
  return doc
}
