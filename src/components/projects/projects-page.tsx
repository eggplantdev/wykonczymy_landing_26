import { PageWrapper } from '@/components/layout/page-wrapper'
import { FadeUp } from '@/components/ui/fade-up'
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
    <PageWrapper hasHero={false} title={title}>
      <div className="grid divide-y divide-border border-b border-border">
        {data.projects.map((project, index) => (
          <FadeUp key={project.id}>
            <ProjectRow
              href={childPath(basePath, project.slug)}
              title={project.title}
              summary={project.summary}
              image={project.image}
              preload={index === 0}
              details={[
                { id: 1, name: strings.location, value: project.address },
                { id: 2, name: strings.area, value: project.area },
                { id: 3, name: strings.duration, value: project.duration },
              ]}
            />
          </FadeUp>
        ))}
      </div>
    </PageWrapper>
  )
}
