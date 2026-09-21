import { describe, expect, it } from 'vitest'

import type { Page } from '@/payload-types'
import { toHomeData } from '@/lib/content/home'
import type { InteriorStyleT } from '@/lib/content/interior-styles'

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

  it('drops a service card with no title in this locale', () => {
    const withCards = {
      ...page(),
      home: {
        services: {
          sectionTitle: 'What we do',
          cards: [
            { id: 'a', title: 'Bathrooms', text: 'Tiling', icon: 'hammer' },
            { id: 'b', title: null, text: null, icon: 'brush' },
          ],
        },
      },
    } as unknown as Page

    const { services } = toHomeData(withCards, { locale: 'en', ...sources })

    expect(services?.cards).toHaveLength(1)
    expect(services?.cards[0]?.id).toBe('a')
  })

  // Same shape as the testimonials rows above, and the same trap: the process steps are one
  // row set shared by both locales, so an untranslated step must not keep the section alive.
  const withSteps = (steps: unknown[]) =>
    ({
      ...page(),
      home: { process: { sectionTitle: 'How we work together', steps } },
    }) as unknown as Page

  it('drops a process step with no title in this locale', () => {
    const { process } = toHomeData(
      withSteps([
        { id: 'a', title: 'A visit and a quote', text: 'We walk the flat', icon: 'hammer' },
        { id: 'b', title: null, text: null, icon: 'brush' },
      ]),
      { locale: 'en', ...sources },
    )

    expect(process?.steps).toHaveLength(1)
    expect(process?.steps[0]?.id).toBe('a')
  })

  it('hides the process section when no step is translated into this locale', () => {
    const { process } = toHomeData(withSteps([{ id: 'a', title: null, icon: 'hammer' }]), {
      locale: 'en',
      ...sources,
    })

    expect(process).toBe(undefined)
  })

  // The hero button is the one CTA that does not open a page: it scrolls to the footer form,
  // so whichever page an editor picks in `ctaLink` is deliberately ignored.
  it('points the hero button at the footer form in both locales', () => {
    expect(toHomeData(page(), { locale: 'pl', ...sources }).hero?.ctaHref).toBe('#contact-form')

    expect(toHomeData(page(), { locale: 'en', ...sources }).hero?.ctaHref).toBe('#contact-form')
  })

  const withStyles = {
    ...page(),
    home: { interiorStyles: { sectionTitle: 'Style', ctaLabel: 'Więcej', ctaLink: 'contact' } },
  } as Page
  const styleSources = { ...sources, styles: [{}] as unknown as InteriorStyleT[] }

  // A page with no slug in this locale has no address here; `/` is the Polish root, so the
  // English site must not fall back to it.
  it('falls back to the locale root when a CTA target has no address', () => {
    const addressed = { ...styleSources, typePaths: { 'interior-styles': '/wykonczenia/' } }

    expect(toHomeData(withStyles, { locale: 'pl', ...addressed }).interiorStyles?.ctaHref).toBe('/')

    expect(toHomeData(withStyles, { locale: 'en', ...addressed }).interiorStyles?.ctaHref).toBe(
      '/en/home/',
    )
  })

  // The CTA may fall back to a root, but a child's base path may not: `childPath('/en/home/',
  // 'boho')` is `/en/home/boho/`, which resolves as a second segment under the home page and
  // 404s. Twelve of them, one per style. The section goes rather than the links.
  it('hides the interior styles section when the listing page has no address here', () => {
    expect(toHomeData(withStyles, { locale: 'en', ...styleSources }).interiorStyles).toBe(undefined)
  })

  const projects = [{ id: 1, slug: 'jastrzebie', title: 'Jastrzębie', image: null }]
  const withProjects = { ...page(), home: { projects: { sectionTitle: 'Realizacje' } } } as Page

  it('hides the projects section when the listing page has no address here', () => {
    const projectSources = { ...sources, projects } as unknown as typeof sources

    expect(toHomeData(withProjects, { locale: 'en', ...projectSources }).projects).toBe(undefined)
  })

  it('hangs a project slide off the listing page address', () => {
    const projectSources = {
      ...sources,
      projects,
      typePaths: { 'completed-works': '/en/completed-works/' },
    } as unknown as typeof sources

    expect(
      toHomeData(withProjects, { locale: 'en', ...projectSources }).projects?.slides[0]?.href,
    ).toBe('/en/completed-works/jastrzebie/')
  })
})
