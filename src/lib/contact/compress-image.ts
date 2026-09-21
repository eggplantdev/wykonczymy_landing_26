import Compressor from 'compressorjs'

import { isRasterImageType } from './attachments'

// One bound for both axes: a 1920×1080 box sizes a portrait page by its height, and an A4 floor
// plan at ~93 DPI loses the dimension text these attachments exist to convey.
const MAX_EDGE = 2560
// Line art shows JPEG ringing long before a photo of a finished room does.
const QUALITY = 0.8

/** Resize and re-encode an image client-side. Anything that is not a raster image is handed back. */
export async function compressImage(originalFile: File): Promise<File> {
  if (!isRasterImageType(originalFile.type)) return originalFile

  try {
    return await run(originalFile, { quality: QUALITY })
  } catch {
    // The attachment is worth more than the saving; the size guard downstream decides if it fits.
    return originalFile
  }
}

/** Rejects rather than falling back, so the caller knows to reach for the WASM HEIC decoder. */
export function compressToJpeg(originalFile: File): Promise<File> {
  return run(originalFile, { quality: QUALITY, mimeType: 'image/jpeg' })
}

function run(originalFile: File, options: Compressor.Options): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    new Compressor(originalFile, {
      maxWidth: MAX_EDGE,
      maxHeight: MAX_EDGE,
      ...options,
      success: (compressed) => resolve(named(compressed, originalFile)),
      error: reject,
    })
  })
}

// The blob path and the leads app both read the visitor's filename, so it is kept — except when
// CompressorJS re-encoded to another format, where it also corrected the extension and forcing the
// old name back would ship a `.png` holding JPEG bytes.
function named(compressed: Blob, originalFile: File): File {
  const converted = compressed.type !== originalFile.type && compressed instanceof File
  return new File([compressed], converted ? compressed.name : originalFile.name, {
    type: compressed.type,
  })
}
