import { readFile } from 'fs/promises'
import path from 'path'
import type { Payload } from 'payload'

const photoDir = path.resolve(process.cwd(), 'public/images/footer')

// Stored lossless: this is the master crop out of the camera original, and Media re-encodes
// it lossily on upload anyway — compressing it here too would spend a second pass for nothing.
const avatar = {
  filename: 'bartosz-antonik.webp',
  alt: 'Bartosz Antonik',
}

// The stem, not the filename: Media re-encodes to WebP, so a source in any other format
// lands in storage under an extension the filename lookup below would then miss.
const stem = path.parse(avatar.filename).name

/** Matched on filename so a re-run re-uses the upload rather than stacking `-2` copies. */
const upsertMedia = async (payload: Payload): Promise<number> => {
  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    where: { filename: { like: stem } },
  })

  const existing = docs[0]
  // Handing `file` to an update stores the bytes under a free name and moves the row onto
  // it, which orphans the old file and hides the row from the lookup above.
  if (existing) {
    const doc = await payload.update({
      collection: 'media',
      id: existing.id,
      data: { alt: avatar.alt },
    })
    return doc.id
  }

  const data = await readFile(path.join(photoDir, avatar.filename))
  const doc = await payload.create({
    collection: 'media',
    data: { alt: avatar.alt },
    file: { data, name: avatar.filename, mimetype: 'image/webp', size: data.byteLength },
  })
  return doc.id
}

/**
 * Uploads the contact person's portrait and attaches it to the footer global. Separate from
 * `pnpm seed` for the same reason the style photos are: that one is safe over a populated
 * admin because it never touches uploads, and this one overwrites a field an editor may
 * have set by hand.
 */
export async function seedFooterAvatar(payload: Payload): Promise<void> {
  const image = await upsertMedia(payload)

  await payload.updateGlobal({
    slug: 'footer',
    locale: 'pl',
    data: { avatar: image },
  })

  payload.logger.info(`footer avatar: ${avatar.filename}`)
}
