import { describe, expect, it } from 'vitest'

import type { Page } from '@/payload-types'
import { toHomeData } from '@/lib/content/home'

const page = (): Page =>
  ({
    id: 1,
    pageType: 'home',
    title: 'Start',
    home: {
      hero: { title: 'Twój dom', ctaLabel: 'Wycena', ctaLink: 'contact' },
    },
    updatedAt: '',
    createdAt: '',
  }) as Page

const sources = { projects: [], styles: [], typePaths: {} }

describe('toHomeData', () => {
  // The guard keys off the rows rather than the title: a section title with no quotes
  // behind it would otherwise render an empty carousel.
  it('hides the testimonials section until a quote is filled in', () => {
    const withTitleOnly = {
      ...page(),
      home: { testimonials: { sectionTitle: 'Co mówią klienci', quotes: [] } },
    } as Page

    expect(toHomeData(withTitleOnly, { locale: 'pl', ...sources }).testimonials).toBe(undefined)
  })

  // `localization.fallback` is off, so a row added in the Polish admin comes back with a
  // null quote in English — the generated type claims `string` because the field is
  // required in the config, not because this locale has been filled in.
  const halfTranslated = (quotes: unknown[]) =>
    ({
      ...page(),
      home: { testimonials: { sectionTitle: 'Opinions', quotes } },
    }) as unknown as Page

  it('drops a quote with no text in this locale', () => {
    const { testimonials } = toHomeData(
      halfTranslated([
        { id: 'a', quote: 'Great work', name: 'Anna' },
        { id: 'b', quote: null, name: 'Michał' },
      ]),
      { locale: 'en', ...sources },
    )

    expect(testimonials?.quotes).toHaveLength(1)
    expect(testimonials?.quotes[0]?.id).toBe('a')
  })

  it('hides the section when no quote is translated into this locale', () => {
    const { testimonials } = toHomeData(halfTranslated([{ id: 'a', quote: null, name: 'Anna' }]), {
      locale: 'en',
      ...sources,
    })

    expect(testimonials).toBe(undefined)
  })

  // A page with no slug in this locale has no address here; `/` is the Polish root, so the
  // English site must not fall back to it.
  it('falls back to the locale root when the CTA target has no address', () => {
    expect(toHomeData(page(), { locale: 'pl', ...sources }).hero?.ctaHref).toBe('/')

    expect(toHomeData(page(), { locale: 'en', ...sources }).hero?.ctaHref).toBe('/en/home/')
  })
})
