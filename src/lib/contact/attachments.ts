import type { FormMessageKeyT } from './contact-schema'

// Checked twice on purpose: this copy is UX, the token route's copy is the guarantee.
export const MAX_FILES = 15
export const MAX_FILE_BYTES = 8 * 1024 * 1024

export const ACCEPTED_CONTENT_TYPES = ['image/*', 'application/pdf'] as const

export type AttachmentCheckT =
  { ok: true; files: File[] } | { ok: false; errorKey: FormMessageKeyT }

export function isAcceptedType(contentType: string): boolean {
  return contentType.startsWith('image/') || contentType === 'application/pdf'
}

// A key rather than a sentence, like the schema: the form stays the only owner of key-to-sentence.
export function checkAttachments(files: File[]): AttachmentCheckT {
  if (files.length > MAX_FILES) return { ok: false, errorKey: 'tooManyFiles' }

  for (const file of files) {
    if (!isAcceptedType(file.type)) return { ok: false, errorKey: 'unsupportedFileType' }
    if (file.size > MAX_FILE_BYTES) return { ok: false, errorKey: 'fileTooLarge' }
  }

  return { ok: true, files }
}
