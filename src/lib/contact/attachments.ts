import type { FormMessageKeyT } from './contact-schema'

// Mirrored by the token route, which re-applies them as the token's own constraints. The
// numbers are shared; the *checking* is deliberately done twice — this copy is UX, so the
// visitor is not made to wait through an upload that would be refused, and the token copy is
// the only one that is a guarantee.
export const MAX_FILES = 15
export const MAX_FILE_BYTES = 8 * 1024 * 1024

export const ACCEPTED_CONTENT_TYPES = ['image/*', 'application/pdf'] as const

export type AttachmentCheckT =
  { ok: true; files: File[] } | { ok: false; errorKey: FormMessageKeyT }

export function isAcceptedType(contentType: string): boolean {
  return contentType.startsWith('image/') || contentType === 'application/pdf'
}

/**
 * Pure, so the form can run it on every pick without a round trip. It answers with a translation
 * key rather than a sentence, like the schema does, so the form stays the only owner of
 * key-to-sentence.
 */
export function checkAttachments(files: File[]): AttachmentCheckT {
  if (files.length > MAX_FILES) return { ok: false, errorKey: 'tooManyFiles' }

  for (const file of files) {
    if (!isAcceptedType(file.type)) return { ok: false, errorKey: 'unsupportedFileType' }
    if (file.size > MAX_FILE_BYTES) return { ok: false, errorKey: 'fileTooLarge' }
  }

  return { ok: true, files }
}
