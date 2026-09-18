import type { HomePageDataT } from '@/components/home/home-page'
import type { Page } from '@/payload-types'
import type { InteriorStyleT } from '@/lib/content/interior-styles'
import type { ProjectT } from '@/lib/content/projects'
import { CONTACT_FORM_ANCHOR } from '@/lib/anchors'
import type { Locale } from '@/lib/i18n/i18n'
import {
  childPath,
  INTERIOR_STYLES_PAGE_TYPE,
  localeRoot,
  PROJECTS_PAGE_TYPE,
  type PageTypeT,
} from '@/lib/routing'
import { toImage, toVideo } from './media'

type SourcesT = {
  locale: Locale
  projects: ProjectT[]
  styles: InteriorStyleT[]
  typePaths: Partial<Record<PageTypeT, string>>
}

// The carousels tease the same documents the listing pages show, so they read the
// collections rather than restating photos and copy in a curated field.
export function toHomeData(
  page: Page,
  { locale, projects, styles, typePaths }: SourcesT,
): HomePageDataT {
  const home = page.home
  if (!home) return {}

  // A target page with no slug in this locale has no address here, so the button falls back
  // to this locale's own root rather than sending an English visitor to the Polish site.
  const link = (pageType?: PageTypeT | null) =>
    (pageType && typePaths[pageType]) || localeRoot(locale)

  const { hero, intro, services, afterServices, numbers, testimonials } = home

  const toTextSection = (section?: { text?: string | null; position?: 'left' | 'right' | null }) =>
    section?.text ? { text: section.text, position: section.position ?? 'left' } : undefined

  // `localization.fallback` is off, so a row added in one locale comes back with a null
  // `quote` in the other — the generated type says `string` because the field is required
  // in the config, not because this locale has been filled in.
  const quotes =
    testimonials?.quotes?.flatMap((row, index) =>
      row.quote
        ? [
            {
              id: row.id ?? String(index),
              quote: row.quote,
              name: row.name,
              role: row.role ?? undefined,
            },
          ]
        : [],
    ) ?? []

  return {
    hero: hero?.title
      ? {
          title: hero.title,
          image: toImage(hero.image),
          video: toVideo(hero.video),
          ctaLabel: hero.ctaLabel ?? undefined,
          // The one button on the site that does not open a page: booking the free quote is
          // the footer form, and sending a visitor to another address to reach a form that is
          // already under them is a detour. Its `ctaLink` field is therefore inert.
          ctaHref: hero.ctaLabel ? `#${CONTACT_FORM_ANCHOR}` : undefined,
        }
      : undefined,

    intro: toTextSection(intro),

    afterServices: toTextSection(afterServices),

    services: services?.cards?.length
      ? {
          sectionTitle: services.sectionTitle ?? '',
          cards: services.cards.map((card) => ({
            title: card.title,
            text: card.text ?? '',
            image: toImage(card.image),
            video: toVideo(card.video),
          })),
        }
      : undefined,

    projects: projects.length
      ? {
          sectionTitle: home.projects?.sectionTitle ?? undefined,
          ctaLabel: home.projects?.ctaLabel ?? undefined,
          ctaHref: link(home.projects?.ctaLink),
          slides: projects.map((project) => ({
            image: project.image,
            video: null,
            caption: project.title,
            href: childPath(link(PROJECTS_PAGE_TYPE), project.slug),
          })),
        }
      : undefined,

    numbers: numbers?.cards?.length
      ? {
          sectionTitle: numbers.sectionTitle ?? undefined,
          cards: numbers.cards.map((card, index) => ({
            id: index + 1,
            value: card.value,
            unit: card.unit ?? undefined,
            description: card.description ?? undefined,
          })),
        }
      : undefined,

    testimonials: quotes.length
      ? { sectionTitle: testimonials?.sectionTitle ?? undefined, quotes }
      : undefined,

    interiorStyles: styles.length
      ? {
          sectionTitle: home.interiorStyles?.sectionTitle ?? '',
          ctaLabel: home.interiorStyles?.ctaLabel ?? '',
          ctaHref: link(home.interiorStyles?.ctaLink),
          // Not `ctaHref`: that one is an editor's choice of where the button goes, while a
          // style's own address is always under the interior styles page.
          basePath: link(INTERIOR_STYLES_PAGE_TYPE),
          styles,
        }
      : undefined,
  }
}
