import type { FormMessageKeyT } from './form-message-key'

// Checked twice on purpose: this copy is UX, the token route's copy is the guarantee.
export const MAX_FILES = 15
export const MAX_FILE_BYTES = 8 * 1024 * 1024

export const ACCEPTED_CONTENT_TYPES = ['image/*', 'application/pdf'] as const

// HEIC is offered but never accepted — it becomes a JPEG before upload, and `image/*` alone greys
// out every iPhone photo because Chrome and Firefox report an empty type for it.
export const FILE_PICKER_ACCEPT = [...ACCEPTED_CONTENT_TYPES, '.heic', '.heif'] as const

export type AttachmentCheckT =
  { ok: true; files: File[] } | { ok: false; errorKey: FormMessageKeyT }

// The one home for "can a canvas re-encode this": both the compressor and the pre-upload pass ask.
export function isRasterImageType(contentType: string): boolean {
  return contentType.startsWith('image/') && !contentType.includes('svg')
}

export function isAcceptedType(contentType: string): boolean {
  return contentType.startsWith('image/') || contentType === 'application/pdf'
}

// A key rather than a sentence, like the schema: the form stays the only owner of key-to-sentence.
export function checkAttachments(files: File[]): AttachmentCheckT {
  if (files.length > MAX_FILES) return { ok: false, errorKey: 'tooManyFiles' }

  const names = new Set<string>()

  for (const file of files) {
    if (!isAcceptedType(file.type)) return { ok: false, errorKey: 'unsupportedFileType' }
    if (file.size > MAX_FILE_BYTES) return { ok: false, errorKey: 'fileTooLarge' }
    // The blob path is the filename verbatim (`addRandomSuffix: false`, so the leads app shows what
    // the visitor named), and the store refuses the second write to a path it already holds. Caught
    // here, the visitor is told which rule they broke instead of a blanket upload failure.
    if (names.has(file.name)) return { ok: false, errorKey: 'duplicateFileName' }
    names.add(file.name)
  }

  return { ok: true, files }
}
