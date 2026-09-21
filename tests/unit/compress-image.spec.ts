import { beforeEach, describe, expect, it, vi } from 'vitest'

type OptionsT = {
  mimeType?: string
  success: (result: Blob) => void
  error: (reason: Error) => void
}

// CompressorJS answers through callbacks, so the double decides what "the browser" produced.
// Hoisted with the `vi.mock` factory, which is lifted above every `const` in this file. The
// implementation has to be a `function`: the module calls `new Compressor(…)`, and an arrow
// throws "is not a constructor" — which the compressor swallows, turning every assertion green.
const { Compressor, setResponse } = vi.hoisted(() => {
  let respond: (file: File, options: OptionsT) => void = () => {}

  return {
    Compressor: vi.fn(function (this: unknown, file: File, options: OptionsT) {
      respond(file, options)
    }),
    setResponse: (next: (file: File, options: OptionsT) => void) => {
      respond = next
    },
  }
})

vi.mock('compressorjs', () => ({ default: Compressor }))

import { compressImage } from '@/lib/contact/compress-image'

const fileOf = (name: string, type: string): File => new File(['x'], name, { type })

beforeEach(() => {
  vi.clearAllMocks()
})

describe('compressImage', () => {
  it('keeps the visitor filename when the format is unchanged', async () => {
    setResponse((file, options) => options.success(fileOf('compressor-renamed.jpg', 'image/jpeg')))

    const result = await compressImage(fileOf('kuchnia.jpg', 'image/jpeg'))

    expect(result.name).toBe('kuchnia.jpg')
    expect(result.type).toBe('image/jpeg')
  })

  it('takes the corrected extension when the format changed', async () => {
    // A PNG over CompressorJS's own 5 MB `convertSize` is re-encoded to JPEG; keeping the old
    // name would store JPEG bytes at a `.png` path the recipient's OS opens with the wrong app.
    setResponse((file, options) => options.success(fileOf('plan.jpg', 'image/jpeg')))

    const result = await compressImage(fileOf('plan.png', 'image/png'))

    expect(result.name).toBe('plan.jpg')
    expect(result.type).toBe('image/jpeg')
  })

  it('hands back a PDF without reaching the encoder', async () => {
    const pdf = fileOf('plan.pdf', 'application/pdf')

    expect(await compressImage(pdf)).toBe(pdf)
    expect(Compressor).not.toHaveBeenCalled()
  })

  it('hands back an SVG without reaching the encoder', async () => {
    const svg = fileOf('logo.svg', 'image/svg+xml')

    expect(await compressImage(svg)).toBe(svg)
    expect(Compressor).not.toHaveBeenCalled()
  })

  it('uploads the original when the browser cannot re-encode it', async () => {
    setResponse((file, options) => options.error(new Error('unsupported codec')))
    const original = fileOf('cat.bmp', 'image/bmp')

    expect(await compressImage(original)).toBe(original)
  })

  it('bounds the longer edge in both axes', async () => {
    setResponse((file, options) => options.success(fileOf('a.jpg', 'image/jpeg')))

    await compressImage(fileOf('a.jpg', 'image/jpeg'))

    // A 16:9 box would size a portrait scan by its height; these have to stay equal.
    const options = Compressor.mock.calls[0][1] as unknown as Record<string, number>
    expect(options.maxWidth).toBe(options.maxHeight)
  })
})
