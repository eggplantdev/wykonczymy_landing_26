import { describe, expect, it } from 'vitest'

import { DESCRIPTION_LIMIT, toSeoMeta } from '@/lib/content/seo'

describe('toSeoMeta', () => {
  it('falls back to the derived description when the editor clears the field', () => {
    // Clearing a textarea in the admin submits '' rather than null, which `??` would have
    // treated as an authored value and shipped no description at all.
    expect(toSeoMeta({ description: '' }, 'A summary').description).toBe('A summary')
    expect(toSeoMeta({ description: '   ' }, 'A summary').description).toBe('A summary')
    expect(toSeoMeta({ title: '' }, 'A summary').title).toBeUndefined()
  })

  it('keeps an authored description ahead of the derived one', () => {
    expect(toSeoMeta({ description: 'Authored' }, 'A summary').description).toBe('Authored')
  })

  it('prefers the SEO image, then the document image, then nothing', () => {
    const derived = { url: '/derived.jpg', width: 1, height: 1, alt: 'derived' }

    expect(toSeoMeta({}, undefined, derived).image).toEqual(derived)
    expect(toSeoMeta({}, undefined, null).image).toBeNull()
    expect(toSeoMeta({}).image).toBeNull()
  })
})

describe('the derived description length cap', () => {
  it('stays inside the limit once the ellipsis is added', () => {
    const description = toSeoMeta({}, 'x'.repeat(200)).description ?? ''

    expect(Array.from(description).length).toBeLessThanOrEqual(DESCRIPTION_LIMIT)
    expect(description.endsWith('…')).toBe(true)
  })

  it('cuts on whole code points, never mid-surrogate', () => {
    const description = toSeoMeta({}, `${'a'.repeat(154)}😀 tail`).description ?? ''

    // A lone surrogate renders as the replacement character; a well-formed string has none.
    expect(description).not.toMatch(/[\uD800-\uDFFF]/)
  })

  it('leaves copy that already fits untouched', () => {
    expect(toSeoMeta({}, 'Short enough.').description).toBe('Short enough.')
  })
})
