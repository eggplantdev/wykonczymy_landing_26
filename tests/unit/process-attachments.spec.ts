import { beforeEach, describe, expect, it, vi } from 'vitest'

const compressImage = vi.fn<(file: File) => Promise<File>>()
const compressToJpeg = vi.fn<(file: File) => Promise<File>>()

vi.mock('@/lib/contact/compress-image', () => ({ compressImage, compressToJpeg }))

import { MAX_FILES } from '@/lib/contact/attachments'
import { processAttachments } from '@/lib/contact/process-attachments'

const fileOf = (name: string, type = 'image/jpeg', size = 1024): File => {
  const file = new File(['x'], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

beforeEach(() => {
  vi.clearAllMocks()
  compressImage.mockImplementation(async (file) => file)
})

describe('processAttachments', () => {
  it('refuses an oversized pick without re-encoding anything', async () => {
    const files = Array.from({ length: MAX_FILES + 1 }, (_, index) => fileOf(`${index}.jpg`))

    expect(await processAttachments(files)).toEqual({ ok: false, errorKey: 'tooManyFiles' })
    expect(compressImage).not.toHaveBeenCalled()
  })

  it('caps how many files are re-encoded at once', async () => {
    let inFlight = 0
    let peak = 0
    compressImage.mockImplementation(async (file) => {
      peak = Math.max(peak, ++inFlight)
      await new Promise((resolve) => setTimeout(resolve, 1))
      inFlight--
      return file
    })

    await processAttachments(Array.from({ length: MAX_FILES }, (_, i) => fileOf(`${i}.jpg`)))

    // The cap is what stops fifteen main-thread canvas decodes starting together on a phone.
    expect(peak).toBeLessThanOrEqual(4)
    expect(compressImage).toHaveBeenCalledTimes(MAX_FILES)
  })

  it('keeps the files that compressed and names only the one that did not', async () => {
    compressImage.mockImplementation(async (file) => {
      if (file.name === 'broken.jpg') throw new Error('undecodable')
      return file
    })

    const result = await processAttachments([
      fileOf('kitchen.jpg'),
      fileOf('broken.jpg'),
      fileOf('plan.pdf', 'application/pdf'),
    ])

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.files.map((file) => file.name)).toEqual(['kitchen.jpg', 'plan.pdf'])
    expect(result.unreadable).toEqual(['broken.jpg'])
  })

  it('returns the compressed files in the order they were picked', async () => {
    compressImage.mockImplementation(async (file) => {
      await new Promise((resolve) => setTimeout(resolve, file.name === 'a.jpg' ? 5 : 0))
      return file
    })

    const result = await processAttachments([fileOf('a.jpg'), fileOf('b.jpg'), fileOf('c.jpg')])

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.files.map((file) => file.name)).toEqual(['a.jpg', 'b.jpg', 'c.jpg'])
  })

  it('hands a non-image through untouched', async () => {
    const pdf = fileOf('plan.pdf', 'application/pdf')

    expect(await processAttachments([pdf])).toEqual({ ok: true, files: [pdf], unreadable: [] })
    expect(compressImage).not.toHaveBeenCalled()
  })

  it('still applies the size and duplicate-name rules to the compressed bytes', async () => {
    compressImage.mockImplementation(async (file) => fileOf(file.name, file.type, 9 * 1024 * 1024))

    expect(await processAttachments([fileOf('huge.jpg')])).toEqual({
      ok: false,
      errorKey: 'fileTooLarge',
    })
  })

  it('catches the collision a .heic rename creates', async () => {
    compressToJpeg.mockImplementation(async (file) => fileOf(file.name.replace(/\.heic$/i, '.jpg')))

    const result = await processAttachments([fileOf('kuchnia.heic', ''), fileOf('kuchnia.jpg')])

    expect(result).toEqual({ ok: false, errorKey: 'duplicateFileName' })
  })
})
