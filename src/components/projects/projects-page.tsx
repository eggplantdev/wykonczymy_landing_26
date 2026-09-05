import { PageWrapper } from '@/components/layout/page-wrapper'
import { getTranslations, type Locale } from '@/lib/i18n/i18n'
import type { ProjectT } from '@/lib/content/projects'
import { ProjectRow } from './project-row'
import { childPath } from '@/lib/routing'

export type ProjectsPageDataT = {
  projects: ProjectT[]
}

type PropsT = {
  locale: Locale
  // The heading is the page document's own localized title, not part of the field group.
  title: string
  basePath: string
  data: ProjectsPageDataT
}

// tdg's `/object` is a bare redirect to the first project, so this listing has no template
// to port — it stacks one ProjectRow per project.
export function ProjectsPage({ locale, title, basePath, data }: PropsT) {
  const { projects: strings } = getTranslations(locale)

  return (
    <PageWrapper hasHero={false}>
      <h1 className="text-32 md:text-40 lg:text-58 mb-12 text-center md:mb-24 lg:mb-20">{title}</h1>

      <div className="divide-grau_300 border-grau_300 grid divide-y border-b">
        {data.projects.map((project) => (
          <ProjectRow
            key={project.slug}
            href={childPath(basePath, project.slug)}
            title={project.title}
            summary={project.summary}
            image={project.image}
            details={[
              { id: 1, name: strings.location, value: project.address },
              { id: 2, name: strings.area, value: project.area },
              { id: 3, name: strings.duration, value: project.duration },
            ]}
          />
        ))}
      </div>
    </PageWrapper>
  )
}
