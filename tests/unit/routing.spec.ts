import { describe, expect, it } from 'vitest'

import {
  hasAddress,
  localeFromPath,
  pathForPage,
  resolveSegments,
  segmentsForPath,
} from '@/lib/routing'

describe('hasAddress', () => {
  // `fallback: false` returns an empty slug for a page translated in one language only, and
  // `pathForPage` would interpolate it into `/en/null/`. The three call sites had written this
  // test three ways and one of them omitted the locale half, so it is asserted on the predicate
  // rather than on any one caller.
  it('refuses a page with no slug in this locale', () => {
    expect(hasAddress({ slug: '', pageType: 'contact' }, 'en')).toBe(false)
    expect(hasAddress({ slug: null, pageType: 'contact' }, 'pl')).toBe(false)
  })

  it('exempts the root document in the default locale only', () => {
    expect(hasAddress({ slug: '', pageType: 'home' }, 'pl')).toBe(true)
    expect(hasAddress({ slug: '', pageType: 'home' }, 'en')).toBe(false)
  })

  it('accepts any page that has a slug', () => {
    expect(hasAddress({ slug: 'offer', pageType: 'contact' }, 'en')).toBe(true)
  })
})

describe('pathForPage', () => {
  it('serves the home document at the bare root in the default locale only', () => {
    expect(pathForPage({ slug: 'start', pageType: 'home' }, 'pl')).toBe('/')
    expect(pathForPage({ slug: 'home', pageType: 'home' }, 'en')).toBe('/en/home/')
  })

  it('prefixes the non-default locale and always ends in a slash', () => {
    expect(pathForPage({ slug: 'oferta' }, 'pl')).toBe('/oferta/')
    expect(pathForPage({ slug: 'offer' }, 'en')).toBe('/en/offer/')
  })

  it('produces params the catch-all can consume', () => {
    expect(segmentsForPath(pathForPage({ slug: 'start', pageType: 'home' }, 'pl'))).toEqual([])
    expect(segmentsForPath(pathForPage({ slug: 'offer' }, 'en'))).toEqual(['en', 'offer'])
  })
})

describe('resolveSegments', () => {
  it('round-trips every address pathForPage builds', () => {
    expect(resolveSegments([])).toMatchObject({ locale: 'pl', slug: null })
    expect(resolveSegments(['oferta'])).toMatchObject({ locale: 'pl', slug: 'oferta' })
    expect(resolveSegments(['en', 'offer'])).toMatchObject({ locale: 'en', slug: 'offer' })
    expect(resolveSegments(['en'])).toMatchObject({ locale: 'en', slug: null })
  })

  it('reads a second segment as a child rather than a miss', () => {
    expect(resolveSegments(['realizacje', 'zupnicza-19'])).toMatchObject({
      slug: 'realizacje',
      childSlug: 'zupnicza-19',
      isMiss: false,
    })
    expect(resolveSegments(['en', 'completed-works', 'zupnicza-19'])).toMatchObject({
      locale: 'en',
      slug: 'completed-works',
      childSlug: 'zupnicza-19',
      isMiss: false,
    })
  })

  it('treats a path deeper than <locale>/<slug>/<child> as a miss', () => {
    expect(resolveSegments(['oferta', 'a', 'b']).isMiss).toBe(true)
    expect(resolveSegments(['en', 'offer', 'a', 'b']).isMiss).toBe(true)
  })

  it('does not treat a real address as a miss', () => {
    expect(resolveSegments(['oferta']).isMiss).toBe(false)
    expect(resolveSegments(['en', 'offer']).isMiss).toBe(false)
    expect(resolveSegments([]).isMiss).toBe(false)
  })

  it('reads the default locale as a slug, not a prefix', () => {
    expect(resolveSegments(['pl'])).toMatchObject({ locale: 'pl', slug: 'pl' })
  })
})

describe('localeFromPath', () => {
  it('reads the locale a 404 should render in', () => {
    expect(localeFromPath('/en/nie-ma/')).toBe('en')
    expect(localeFromPath('/nie-ma/')).toBe('pl')
    expect(localeFromPath('/')).toBe('pl')
  })
})
