import { revalidatePath } from 'next/cache'

// A write's blast radius isn't knowable from the document alone: one page answers at
// two addresses, its slug is editable, and the home type moves `/` between documents — so a
// rename or a delete orphans an address the write never mentions. At this size,
// invalidating the whole layout is cheaper than tracking which address moved.
export function revalidateAllPages() {
  try {
    revalidatePath('/', 'layout')
  } catch (error) {
    // Hooks also run outside a request (seed script, `payload run`), where revalidatePath
    // throws. Logged rather than swallowed so a genuine cache failure is not silent — and
    // see AGENTS.md: a `seed:prod` run therefore leaves production serving the old copy.
    console.warn('revalidatePath skipped', error)
  }
}
