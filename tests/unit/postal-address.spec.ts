import { describe, expect, it } from 'vitest'

import { formatPostalAddress } from '@/lib/contact/postal-address'

const WARSAW = { street: 'ul. Terespolska 2', locality: 'Warszawa', postalCode: '03-813' }

describe('formatPostalAddress', () => {
  // These two strings are what the CMS held as one free-text line per locale before the address
  // became structured parts. The split is only safe if joining reproduces them exactly, so they
  // are pinned here verbatim rather than rebuilt from the parts.
  it('reads the postcode after the town in Polish and before it in English', () => {
    expect(formatPostalAddress({ ...WARSAW }, 'pl')).toBe('ul. Terespolska 2, Warszawa 03-813')
    expect(formatPostalAddress({ ...WARSAW, locality: 'Warsaw' }, 'en')).toBe(
      'ul. Terespolska 2, 03-813 Warsaw',
    )
  })

  // Every part is optional in the CMS, so a half-entered address has to render short rather than
  // with a dangling comma or a gap where the missing piece was.
  it('drops the separators around a part that is missing', () => {
    expect(formatPostalAddress({ street: 'ul. Terespolska 2' }, 'pl')).toBe('ul. Terespolska 2')
    expect(formatPostalAddress({ locality: 'Warszawa' }, 'pl')).toBe('Warszawa')
    expect(formatPostalAddress({ postalCode: '03-813' }, 'en')).toBe('03-813')
    expect(formatPostalAddress({ ...WARSAW, street: undefined }, 'pl')).toBe('Warszawa 03-813')
  })

  // The contact page spreads the address row in only when this returns a value, and the JSON-LD
  // omits `address` entirely — both rely on empty being `undefined`, not an empty string.
  it('returns undefined when nothing but the country is set', () => {
    expect(formatPostalAddress({}, 'pl')).toBeUndefined()
    expect(formatPostalAddress({ country: 'PL' }, 'en')).toBeUndefined()
  })
})
