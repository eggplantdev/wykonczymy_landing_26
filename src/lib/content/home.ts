import type { HomePageDataT } from '@/components/home/home-page'
import type { Page } from '@/payload-types'
import type { InteriorStyleT } from '@/lib/content/interior-styles'
import type { ProjectT } from '@/lib/content/projects'
import { childPath, PROJECTS_PAGE_TYPE, type PageTypeT } from '@/lib/routing'
import { toImage, toVideo } from './media'
import { toProject } from './projects'

type SourcesT = {
  projects: ProjectT[]
  styles: InteriorStyleT[]
  typePaths: Partial<Record<PageTypeT, string>>
}

// The carousels tease the same documents the listing pages show, so they read the
// collections rather than restating photos and copy in a curated field.
export function toHomeData(page: Page, { projects, styles, typePaths }: SourcesT): HomePageDataT {
  const home = page.home
  if (!home) return {}

  const link = (pageType?: PageTypeT | null) => (pageType && typePaths[pageType]) || '/'

  const { hero, intro, services, numbers, featuredProject } = home
  const featured =
    featuredProject?.project && typeof featuredProject.project === 'object'
      ? toProject(featuredProject.project)
      : null

  return {
    hero: hero?.title
      ? {
          title: hero.title,
          image: toImage(hero.image),
          video: toVideo(hero.video),
          ctaLabel: hero.ctaLabel ?? undefined,
          ctaHref: hero.ctaLabel ? link(hero.ctaLink) : undefined,
        }
      : undefined,

    intro: intro?.text ? { text: intro.text, position: intro.position ?? 'left' } : undefined,

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
            caption: `${project.title} — ${project.summary}`,
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

    interiorStyles: styles.length
      ? {
          sectionTitle: home.interiorStyles?.sectionTitle ?? '',
          ctaLabel: home.interiorStyles?.ctaLabel ?? '',
          ctaHref: link(home.interiorStyles?.ctaLink),
          styles,
        }
      : undefined,

    featuredProject: featured
      ? {
          sectionTitle: featuredProject?.sectionTitle ?? '',
          projectTitle: featured.title,
          projectSubtitle: featured.summary,
          ctaLabel: featuredProject?.ctaLabel ?? null,
          ctaHref: childPath(link(PROJECTS_PAGE_TYPE), featured.slug),
          // The hero photo already opens the project's own page, so the section leads
          // with the next one down.
          image: featured.gallery[1] ?? featured.image,
          video: null,
        }
      : undefined,
  }
}
