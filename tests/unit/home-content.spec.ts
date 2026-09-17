import { describe, expect, it } from 'vitest'

import type { Page, Project } from '@/payload-types'
import { toHomeData } from '@/lib/content/home'

const project = (status: 'draft' | 'published'): Project =>
  ({
    id: 1,
    slug: 'zupnicza-19',
    title: 'Zupnicza 19',
    summary: 'Mieszkanie na Pradze.',
    _status: status,
    updatedAt: '',
    createdAt: '',
  }) as Project

const page = (project: Project): Page =>
  ({
    id: 1,
    pageType: 'home',
    title: 'Start',
    home: {
      hero: { title: 'Twój dom', ctaLabel: 'Wycena', ctaLink: 'contact' },
      featuredProject: { sectionTitle: 'Wybrana realizacja', ctaLabel: 'Zobacz', project },
    },
    updatedAt: '',
    createdAt: '',
  }) as Page

const sources = { projects: [], styles: [], typePaths: {} }

describe('toHomeData', () => {
  // Relationship population runs with access overridden, so the collection's published-only
  // read never filters this one — the draft would render on the live home page while the
  // button beside it pointed at a 404.
  it('drops a featured project that is not published', () => {
    expect(toHomeData(page(project('draft')), { locale: 'pl', ...sources }).featuredProject).toBe(
      undefined,
    )

    expect(
      toHomeData(page(project('published')), { locale: 'pl', ...sources }).featuredProject,
    ).toMatchObject({ projectTitle: 'Zupnicza 19' })
  })

  // The seed ships the section title with no quotes behind it, so the guard has to key off
  // the rows rather than the title — otherwise the home page renders an empty carousel.
  it('hides the testimonials section until a quote is filled in', () => {
    const withTitleOnly = {
      ...page(project('published')),
      home: { testimonials: { sectionTitle: 'Co mówią klienci', quotes: [] } },
    } as Page

    expect(toHomeData(withTitleOnly, { locale: 'pl', ...sources }).testimonials).toBe(undefined)
  })

  // A page with no slug in this locale has no address here; `/` is the Polish root, so the
  // English site must not fall back to it.
  it('falls back to the locale root when the CTA target has no address', () => {
    expect(toHomeData(page(project('published')), { locale: 'pl', ...sources }).hero?.ctaHref).toBe(
      '/',
    )

    expect(toHomeData(page(project('published')), { locale: 'en', ...sources }).hero?.ctaHref).toBe(
      '/en/home/',
    )
  })
})
