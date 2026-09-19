import { revalidatePath } from 'next/cache'

// A write's blast radius isn't knowable from the document alone: one page answers at
// two addresses, its slug is editable, and the home type moves `/` between documents — so a
// rename or a delete orphans an address the write never mentions. At this size,
// invalidating the whole layout is cheaper than tracking which address moved.
export function revalidateAllPages() {
  try {
    revalidatePath('/', 'layout')
  } catch (error) {
    // Hooks also run outside a request (`payload run`, a migration), where revalidatePath
    // throws. Logged rather than swallowed so a genuine cache failure is not silent — a write
    // from the CLI therefore leaves production serving the old copy until the next deploy.
    console.warn('revalidatePath skipped', error)
  }
}
