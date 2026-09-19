import { readFile } from 'fs/promises'
import path from 'path'
import type { Payload } from 'payload'

import { HOME_PAGE_TYPE } from '@/lib/routing'

const photoDir = path.resolve(process.cwd(), 'public/images/home')

// `public/images/home/` holds every background the live WordPress landing uses; this is
// the one the hero wears. The others stay on disk so the choice can be revisited without
// scraping the site again.
const hero = {
  filename: 'salon-bezowy.jpg',
  alt: 'Beżowy salon w ciepłym świetle',
}

/** Matched on filename so a re-run re-uses the upload rather than stacking `-2` copies. */
const upsertMedia = async (payload: Payload): Promise<number> => {
  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    where: { filename: { equals: hero.filename } },
  })

  const existing = docs[0]
  // Handing `file` to an update stores the bytes under a free name and moves the row onto
  // it, which orphans the old file and hides the row from the lookup above.
  if (existing) {
    const doc = await payload.update({
      collection: 'media',
      id: existing.id,
      data: { alt: hero.alt },
    })
    return doc.id
  }

  const data = await readFile(path.join(photoDir, hero.filename))
  const doc = await payload.create({
    collection: 'media',
    data: { alt: hero.alt },
    file: { data, name: hero.filename, mimetype: 'image/jpeg', size: data.byteLength },
  })
  return doc.id
}

/**
 * Uploads the home hero background and attaches it. Separate from `pnpm seed` for the same
 * reason the style photos are: that one is safe over a populated admin because it never
 * touches uploads, and this one overwrites a field an editor may have set by hand.
 *
 * The rest of the group is written back untouched. A group update supplies the whole group,
 * so writing `hero` alone would drop the copy `pnpm seed` put there.
 */
export async function seedHomeHeroPhoto(payload: Payload): Promise<void> {
  const { docs } = await payload.find({
    collection: 'pages',
    locale: 'pl',
    draft: true,
    depth: 0,
    limit: 1,
    where: { pageType: { equals: HOME_PAGE_TYPE } },
  })

  const home = docs[0]
  if (!home) {
    payload.logger.warn('No home page yet — run `pnpm seed` before `pnpm seed:photos`')
    return
  }

  const image = await upsertMedia(payload)
  await payload.update({
    collection: 'pages',
    id: home.id,
    locale: 'pl',
    data: { home: { ...home.home, hero: { ...home.home?.hero, image } } },
  })

  payload.logger.info(`home hero: ${hero.filename}`)
}
