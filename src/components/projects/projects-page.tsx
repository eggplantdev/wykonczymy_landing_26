import { PageWrapper } from '@/components/layout/page-wrapper'
import { ObjectSlideContent } from '@/components/object-carousel/object-slide-content'
import { getTranslations, type Locale } from '@/lib/i18n/i18n'
import type { ProjectT } from '@/types/projects'

export type ProjectsPageDataT = {
  projects: ProjectT[]
}

type PropsT = {
  locale: Locale
  // The heading is the page document's own localized title, not part of the field group.
  title: string
  // This page's own address; each project hangs off it as `<basePath><slug>/`.
  basePath: string
  data: ProjectsPageDataT
}

// tdg's `/object` is a bare redirect to the first project, so this listing has no template
// to port — it stacks the carousel's own slide body, one row per project.
export function ProjectsPage({ locale, title, basePath, data }: PropsT) {
  const { projects: strings } = getTranslations(locale)

  return (
    <PageWrapper hasHero={false}>
      <h1 className="text-32 md:text-40 lg:text-58 mb-12 text-center md:mb-24 lg:mb-20">{title}</h1>

      <div className="divide-grau_300 grid divide-y">
        {data.projects.map((project) => (
          <div key={project.slug} className="gridContainer paddings py-8 lg:py-12">
            <ObjectSlideContent
              sectionTitle={strings.project}
              item={{
                key: project.slug,
                href: `${basePath}${project.slug}/`,
                title: project.title,
                text: project.summary,
                image: project.image,
                details: [
                  { id: 1, name: strings.from, value: project.price },
                  { id: 2, name: strings.location, value: project.address },
                  { id: 3, name: strings.area, value: project.area },
                  { id: 4, name: strings.duration, value: project.duration },
                ],
              }}
            />
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
