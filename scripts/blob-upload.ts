import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { list, put } from '@vercel/blob'

// Copies the local upload directory into the Vercel Blob store the deployment reads,
// leaving both the bytes and the `media` rows that point at them untouched. Payload's blob
// adapter resolves a row by building `<store>/<filename>` out of the `filename` column
// (`storage-vercel-blob/getFile.js`), so every file has to land under its exact name — the
// `addRandomSuffix` the plugin uses for new uploads would leave every restored row pointing
// at nothing.
//
// One-way and one-off: this is how a database restored from elsewhere gets its images, not
// part of `pnpm seed`.

const uploadDir = path.resolve(process.cwd(), 'media')

// Payload stores what sharp produced, so the extension is the truth about the bytes.
const contentTypes: Record<string, string> = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

/** The adapter's own default, so a copied file is cached exactly like an admin upload. */
const cacheControlMaxAge = 60 * 60 * 24 * 365

const concurrency = 6

// No token is passed: the SDK resolves either `BLOB_READ_WRITE_TOKEN` or the OIDC pair
// (`VERCEL_OIDC_TOKEN` + `BLOB_STORE_ID`) on its own, and this project's env vars are
// write-only, so the OIDC pair from `vercel env pull` is the only one obtainable here.

/** Every pathname already in the store, so a re-run resumes rather than re-sending 46 MB. */
async function existingPathnames(): Promise<Set<string>> {
  const pathnames = new Set<string>()
  let cursor: string | undefined

  do {
    const page = await list({ cursor, limit: 1000 })
    for (const blob of page.blobs) pathnames.add(blob.pathname)
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)

  return pathnames
}

async function upload(filename: string): Promise<void> {
  const contentType = contentTypes[path.extname(filename).toLowerCase()]
  if (!contentType) throw new Error(`No content type for ${filename}`)

  const body = await readFile(path.join(uploadDir, filename))
  await put(filename, body, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge,
    contentType,
  })
}

const files = (await readdir(uploadDir)).filter((file) => !file.startsWith('.'))
const present = await existingPathnames()
const pending = files.filter((file) => !present.has(file))

console.log(`${files.length} local files, ${files.length - pending.length} already in the store`)

let done = 0
const queue = [...pending]
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    for (let file = queue.shift(); file; file = queue.shift()) {
      await upload(file)
      done += 1
      console.log(`${done}/${pending.length} ${file}`)
    }
  }),
)

console.log(`Uploaded ${done} file${done === 1 ? '' : 's'}.`)
