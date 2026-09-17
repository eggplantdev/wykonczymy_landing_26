import { describe, expect, it } from 'vitest'

import { localeFromPath, pathForPage, resolveSegments, segmentsForPage } from '@/lib/routing'

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
    expect(segmentsForPage({ slug: 'start', pageType: 'home' }, 'pl')).toEqual([])
    expect(segmentsForPage({ slug: 'offer' }, 'en')).toEqual(['en', 'offer'])
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
