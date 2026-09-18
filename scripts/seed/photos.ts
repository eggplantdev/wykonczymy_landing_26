import { readdir, readFile } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import type { Payload } from 'payload'

import type { Media } from '@/payload-types'

const photoDir = path.resolve(process.cwd(), 'public/images/styles')

// The files were scraped off the live WordPress site, which names two of the styles
// differently from the slugs this project publishes them under.
const slugByFilePrefix = {
  boho: 'boho',
  glamour: 'glamour',
  hampton: 'hampton',
  industrialny: 'industrialny',
  japandi: 'japandi',
  klasyczny: 'klasyczny',
  mcm: 'mid-century-modern',
  minimalistyczny: 'minimalistyczny',
  'modern-classic': 'modern-classic',
  'modern-retro': 'modern-retro',
  postmodern: 'postmodernistyczny',
  rustykalny: 'rustykalny',
} as const

// Read off the filename, which carries the room as a bare word — `spialnia` included, a
// typo in the source material that is not worth renaming a tracked file over.
const roomLabels = {
  biuro: 'biuro',
  gabinet: 'gabinet',
  hall: 'hall',
  kuchnia: 'kuchnia',
  lazienka: 'łazienka',
  salon: 'salon',
  spialnia: 'sypialnia',
  sypialnia: 'sypialnia',
} as const

// Which room leads the article when several photos are equally wide. Ordinary rooms sell
// the style better than a hallway or a home office.
const roomOrder = ['salon', 'kuchnia', 'sypialnia', 'lazienka', 'hall', 'gabinet', 'biuro']

type PhotoT = {
  filename: string
  styleSlug: string
  alt: string
  ratio: number
  roomRank: number
}

const parse = async (filename: string, titleBySlug: Map<string, string>): Promise<PhotoT> => {
  const stem = filename.replace(/\.webp$/, '')
  const prefix = (Object.keys(slugByFilePrefix) as (keyof typeof slugByFilePrefix)[]).find(
    (candidate) => stem.startsWith(`${candidate}-`),
  )
  if (!prefix) throw new Error(`No style matches ${filename}`)

  const styleSlug = slugByFilePrefix[prefix]
  // What follows the style is the room, then WordPress' own suffixes: `-scaled` on
  // anything it downsized on upload, and up to two duplicate counters — `hall1-2` is one
  // room, not a room called `hall1`.
  const room = stem
    .slice(prefix.length + 1)
    .replace(/-scaled$/, '')
    .replace(/(-?\d+)+$/, '')
  const label = roomLabels[room as keyof typeof roomLabels]
  if (!label) throw new Error(`No room matches ${filename}`)

  const { width = 0, height = 1 } = await sharp(path.join(photoDir, filename)).metadata()
  const ratio = width / height

  return {
    filename,
    styleSlug,
    alt: `${titleBySlug.get(styleSlug) ?? styleSlug} — ${label}`,
    ratio,
    roomRank: roomOrder.indexOf(room === 'spialnia' ? 'sypialnia' : room),
  }
}

/** Matched on filename so a re-run re-uses the upload rather than stacking `-2` copies. */
const upsertMedia = async (payload: Payload, photo: PhotoT): Promise<Media> => {
  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    where: { filename: { equals: photo.filename } },
  })

  const data = await readFile(path.join(photoDir, photo.filename))
  const existing = docs[0]
  // Handing `file` to an update makes Payload store the bytes
  // under a free name — `<stem>-2.webp` — and move the row onto it, which both orphans the
  // old file and hides the row from the lookup above, so the next run creates a duplicate.
  return existing
    ? payload.update({ collection: 'media', id: existing.id, data: { alt: photo.alt } })
    : payload.create({
        collection: 'media',
        data: { alt: photo.alt },
        file: { data, name: photo.filename, mimetype: 'image/webp', size: data.byteLength },
      })
}

/**
 * Separate from `pnpm seed` on purpose: that one is safe to run over a
 * populated admin because it never touches uploads, and this one overwrites exactly the
 * four fields an editor would have arranged by hand.
 */
export async function seedStylePhotos(payload: Payload): Promise<void> {
  const { docs: styles } = await payload.find({
    collection: 'interior-styles',
    locale: 'pl',
    draft: true,
    depth: 0,
    limit: 100,
  })
  if (styles.length < 1)
    throw new Error('No interior styles to attach photos to — run `pnpm seed` first')
  const titleBySlug = new Map(styles.map((style) => [style.slug, style.title]))

  const files = (await readdir(photoDir)).filter((file) => file.endsWith('.webp')).sort()
  const photos = await Promise.all(files.map((file) => parse(file, titleBySlug)))

  for (const style of styles) {
    const mine = photos.filter((photo) => photo.styleSlug === style.slug)
    if (mine.length < 1) {
      payload.logger.warn(`No photos for ${style.slug}`)
      continue
    }

    const ids = new Map<string, number>()
    for (const photo of mine) ids.set(photo.filename, (await upsertMedia(payload, photo)).id)
    const idOf = (photo: PhotoT): number => {
      const id = ids.get(photo.filename)
      if (id === undefined) throw new Error(`${photo.filename} was never uploaded`)
      return id
    }

    // The hero is cropped to 2:1 and the mid-article slot is wide as well, so the two
    // widest shots fill them and lose the least; both drop out of the gallery below so the
    // page never shows the same photo twice.
    const [hero, content, ...gallery] = [...mine].sort(
      (a, b) => b.ratio - a.ratio || a.roomRank - b.roomRank,
    )
    gallery.sort((a, b) => a.roomRank - b.roomRank)

    await payload.update({
      collection: 'interior-styles',
      id: style.id,
      data: {
        image: idOf(hero),
        contentImage: content ? idOf(content) : null,
        gallery: gallery.map(idOf),
      },
    })

    payload.logger.info(`${style.slug}: ${mine.length} photos`)
  }
}
