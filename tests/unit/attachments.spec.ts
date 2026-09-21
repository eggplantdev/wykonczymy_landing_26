import { describe, expect, it } from 'vitest'

import { checkAttachments, MAX_FILE_BYTES, MAX_FILES } from '@/lib/contact/attachments'

const fileOf = (name: string, type: string, size = 1024): File => {
  const file = new File(['x'], name, { type })
  // `File` sizes itself from its parts, and allocating 8 MB of bytes per case to test a `>` is
  // not what is under test.
  Object.defineProperty(file, 'size', { value: size })
  return file
}

describe('checkAttachments', () => {
  it('accepts images and a PDF within the limits', () => {
    const files = [fileOf('plan.pdf', 'application/pdf'), fileOf('room.jpg', 'image/jpeg')]

    expect(checkAttachments(files)).toEqual({ ok: true, files })
  })

  it('accepts an empty selection', () => {
    expect(checkAttachments([])).toEqual({ ok: true, files: [] })
  })

  it('refuses more files than the token route would allow', () => {
    const files = Array.from({ length: MAX_FILES + 1 }, (_, index) =>
      fileOf(`${index}.jpg`, 'image/jpeg'),
    )

    expect(checkAttachments(files)).toEqual({ ok: false, errorKey: 'tooManyFiles' })
  })

  it('refuses a file over the ceiling', () => {
    const files = [fileOf('huge.jpg', 'image/jpeg', MAX_FILE_BYTES + 1)]

    expect(checkAttachments(files)).toEqual({ ok: false, errorKey: 'fileTooLarge' })
  })

  it('accepts a file exactly at the ceiling', () => {
    expect(checkAttachments([fileOf('edge.jpg', 'image/jpeg', MAX_FILE_BYTES)]).ok).toBe(true)
  })

  // The `accept` attribute is a filter in the picker, not a guarantee: a drag-and-drop or a
  // picker set to „all files" hands over whatever was chosen.
  it('refuses a type neither the store nor the leads app accepts', () => {
    const files = [fileOf('notes.docx', 'application/vnd.openxmlformats-officedocument')]

    expect(checkAttachments(files)).toEqual({ ok: false, errorKey: 'unsupportedFileType' })
  })

  // `addRandomSuffix: false` makes the filename the blob path verbatim, and the store refuses the
  // second write to a path it already holds — which surfaced as a blanket upload failure.
  it('refuses two files sharing a name', () => {
    const files = [fileOf('plan.pdf', 'application/pdf'), fileOf('plan.pdf', 'application/pdf')]

    expect(checkAttachments(files)).toEqual({ ok: false, errorKey: 'duplicateFileName' })
  })
})
