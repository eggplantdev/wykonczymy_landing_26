import type { Payload } from 'payload'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
} from 'payload'
import { revalidatePath } from 'next/cache'

import type { Page } from '@/payload-types'
import { pathsForPage } from '@/lib/pages'

const PREVIOUS_PATHS = 'previousPagePaths'

// A write only carries the slug of the locale being edited, so the addresses a page
// occupied *before* the write can only be read from the database while the old row is
// still there. Both delete and a slug rename orphan an address in a locale the editor
// never touched; without this the counterpart locale keeps serving stale content.
const capturePreviousPaths = async (
  context: Record<string, unknown>,
  payload: Payload,
  id: string | number | undefined,
) => {
  if (id === undefined) return
  context[PREVIOUS_PATHS] = Object.values(await pathsForPage(id, payload))
}

export const capturePagePathsBeforeChange: CollectionBeforeChangeHook<Page> = async ({
  originalDoc,
  req,
  context,
}) => {
  await capturePreviousPaths(context, req.payload, originalDoc?.id)
}

export const capturePagePathsBeforeDelete: CollectionBeforeDeleteHook = async ({
  id,
  req,
  context,
}) => {
  await capturePreviousPaths(context, req.payload, id)
}

// Payload's hooks also run outside a request — a seed script or `payload run` uses the
// same Local API — and revalidatePath throws when there is no Next request scope. A
// CLI write must not abort just because nothing is cached.
function revalidate(paths: Iterable<string>) {
  for (const path of paths) {
    try {
      revalidatePath(path)
    } catch {
      // No request scope (CLI / seed): nothing is cached, so nothing to invalidate.
    }
  }
}

function previousPaths(context: Record<string, unknown>): string[] {
  const captured = context[PREVIOUS_PATHS]
  return Array.isArray(captured) ? (captured as string[]) : []
}

export const revalidatePage: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req: { payload },
  context,
}) => {
  if (doc._status !== 'published' && previousDoc?._status !== 'published') return doc

  const paths = new Set([
    ...previousPaths(context),
    ...Object.values(await pathsForPage(doc.id, payload)),
  ])

  // `/` is the home document's address, so handing the flag to another page changes
  // which document answers there — and neither page's own paths include it.
  if (doc.isHome !== previousDoc?.isHome) paths.add('/')

  revalidate(paths)

  return doc
}

export const revalidatePageDelete: CollectionAfterDeleteHook<Page> = ({ doc, context }) => {
  const paths = new Set(previousPaths(context))
  if (doc?.isHome) paths.add('/')

  revalidate(paths)

  return doc
}
