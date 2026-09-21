import { describe, expect, it } from 'vitest'

import type { Media } from '@/payload-types'
import { toImage } from '@/lib/content/media'

// The generated type promises a string; `fallback: false` does not.
const photo = (alt: unknown) => ({ url: '/salon.webp', alt }) as unknown as Media

describe('toImage', () => {
  it('keeps the alt a photo has', () => {
    expect(toImage(photo('Boho — salon'))?.alt).toBe('Boho — salon')
  })

  it.each([undefined, null])('gives an untranslated photo an empty alt, not %s', (missing) => {
    expect(toImage(photo(missing))?.alt).toBe('')
  })
})
