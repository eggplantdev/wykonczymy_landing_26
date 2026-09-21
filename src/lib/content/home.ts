import type { HomePageDataT } from '@/components/home/home-page'
import type { Page } from '@/payload-types'
import type { InteriorStyleT } from '@/lib/content/interior-styles'
import type { ProjectT } from '@/lib/content/projects'
import { CONTACT_FORM_ANCHOR } from '@/lib/anchors'
import type { Locale } from '@/lib/i18n/i18n'
import type { ServiceIconKeyT } from '@/lib/service-icons'
import {
  childPath,
  INTERIOR_STYLES_PAGE_TYPE,
  localeRoot,
  PROJECTS_PAGE_TYPE,
  type PageTypeT,
} from '@/lib/routing'
import { toImage, toVideo } from './media'

type IconCardRowT = {
  id?: string | null
  title?: string | null
  text?: string | null
  icon: ServiceIconKeyT
}

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

  // That fallback is safe for a button and wrong for a child's base: `childPath('/en/home/',
  // 'boho')` reads as a second segment under the home page, which has no children, so all
  // twelve cards 404 at once. A listing page with no address in this locale has no children
  // with one either, so the section is dropped rather than linked into nowhere.
  const projectsBase = typePaths[PROJECTS_PAGE_TYPE]
  const stylesBase = typePaths[INTERIOR_STYLES_PAGE_TYPE]

  const { hero, intro, services, afterServices, numbers, testimonials } = home

  const toTextSection = (section?: { text?: string | null; position?: 'left' | 'right' | null }) =>
    section?.text ? { text: section.text, position: section.position ?? 'left' } : undefined

  // The services cards and the process steps are the same row on both sides: one
  // `iconCardFields` group in the Payload config, one mapper here.
  const toIconCards = (rows?: IconCardRowT[] | null) =>
    rows?.flatMap((row, index) =>
      row.title
        ? [{ id: row.id ?? String(index), title: row.title, text: row.text ?? '', icon: row.icon }]
        : [],
    ) ?? []

  // `localization.fallback` is off, so a row added in one locale comes back with its required
  // localized field null in the other — the generated type says `string` because the field is
  // required in the config, not because this locale has been filled in. Every row set is
  // filtered before it is counted, so a section with rows but no translation is dropped whole
  // rather than rendered as a heading over nothing.
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

  const cards = toIconCards(services?.cards)
  const steps = toIconCards(home.process?.steps)

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

    services: cards.length ? { sectionTitle: services?.sectionTitle ?? '', cards } : undefined,

    projects:
      projects.length && projectsBase
        ? {
            sectionTitle: home.projects?.sectionTitle ?? undefined,
            ctaHref: link(home.projects?.ctaLink),
            slides: projects.map((project) => ({
              id: project.id,
              image: project.image,
              video: null,
              caption: project.title,
              href: childPath(projectsBase, project.slug),
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

    interiorStyles:
      styles.length && stylesBase
        ? {
            sectionTitle: home.interiorStyles?.sectionTitle ?? '',
            ctaHref: link(home.interiorStyles?.ctaLink),
            // Not `ctaHref`: that one is an editor's choice of where the button goes, while a
            // style's own address is always under the interior styles page.
            basePath: stylesBase,
            styles,
          }
        : undefined,

    process: steps.length ? { sectionTitle: home.process?.sectionTitle ?? '', steps } : undefined,
  }
}
