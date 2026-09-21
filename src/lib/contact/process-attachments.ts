import { checkAttachments, HEIC_EXTENSIONS, isRasterImageType, MAX_FILES } from './attachments'
import type { FormMessageKeyT } from './form-message-key'

// Matches the leads app's ingest cap. Each file runs main-thread CompressorJS and possibly a WASM
// HEIC decode, so an unbounded pick of 15 freezes the tab this feature exists to serve.
const PROCESS_CONCURRENCY = 4

// Near-lossless: this pass only decodes, and the `compressImage` after it sets the real quality.
const HEIC_DECODE_QUALITY = 0.92

const IMAGE_EXTENSIONS = [...HEIC_EXTENSIONS, '.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp']

type CodecsT = typeof import('./compress-image')

/** `unreadable` names the files nothing could decode; the rest still went through. */
export type ProcessResultT =
  { ok: true; files: File[]; unreadable: string[] } | { ok: false; errorKey: FormMessageKeyT }

/**
 * Shrink what the visitor picked, then run the same rules over the result — so the size ceiling,
 * the type check and the duplicate-name check all judge the bytes that actually upload.
 */
export async function processAttachments(files: File[]): Promise<ProcessResultT> {
  if (files.length > MAX_FILES) return { ok: false, errorKey: 'tooManyFiles' }

  // Imported once, not per file: fifteen parallel `import()`s of one chunk, and a failed download
  // reported fifteen times as an unreadable photo when the photo was never the problem.
  let codecs: CodecsT
  try {
    codecs = await import('./compress-image')
  } catch {
    return { ok: false, errorKey: 'processingUnavailable' }
  }

  const unreadable: string[] = []
  const processed = await mapWithConcurrency(files, PROCESS_CONCURRENCY, async (file) => {
    try {
      return await processAttachment(file, codecs)
    } catch {
      // One file nothing can decode must not discard the fourteen that compressed fine.
      unreadable.push(file.name)
      return undefined
    }
  })

  const checked = checkAttachments(processed.filter((file) => file !== undefined))
  return checked.ok ? { ...checked, unreadable } : checked
}

async function processAttachment(file: File, codecs: CodecsT): Promise<File> {
  if (!isImage(file)) return file

  if (isHeic(file)) {
    const jpeg = await convertHeicToJpeg(file, codecs)
    return new File([jpeg], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' })
  }

  return codecs.compressImage(file)
}

/**
 * Safari first: its canvas decodes HEIC through the OS HEVC codec, so one pass decodes and resizes
 * and the WASM decoder is never downloaded. Chrome and Firefox reject, and only they pay for it.
 */
async function convertHeicToJpeg(file: File, codecs: CodecsT): Promise<File> {
  try {
    return await codecs.compressToJpeg(file)
  } catch {
    const { heicTo } = await import('heic-to')
    const converted = await heicTo({ blob: file, type: 'image/jpeg', quality: HEIC_DECODE_QUALITY })
    if (!(converted instanceof Blob)) throw new Error('heic-to did not return a JPEG blob')

    return codecs.compressImage(new File([converted], file.name, { type: 'image/jpeg' }))
  }
}

/** Results keep input order regardless of completion order. */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let next = 0

  async function worker() {
    while (next < items.length) {
      const index = next++
      results[index] = await fn(items[index])
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

// Chrome and Firefox report an empty `type` for HEIC, so the extension is the second signal.
function isImage(file: File): boolean {
  return isRasterImageType(file.type) || hasExtension(file.name, IMAGE_EXTENSIONS)
}

function isHeic(file: File): boolean {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    hasExtension(file.name, HEIC_EXTENSIONS)
  )
}

function hasExtension(name: string, extensions: readonly string[]): boolean {
  const lower = name.toLowerCase()
  return extensions.some((extension) => lower.endsWith(extension))
}
