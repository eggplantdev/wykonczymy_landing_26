import { PageWrapper } from '@/components/layout/page-wrapper'
import { ObjectCarousel } from '@/components/object-carousel/object-carousel'
import { getTranslations, type Locale } from '@/lib/i18n/i18n'
import type { ProjectT } from '@/lib/content/projects'
import { ProjectDescription } from './project-description'
import { ProjectGallery } from './project-gallery'
import { ProjectHero } from './project-hero'
import { childPath } from '@/lib/routing'

type PropsT = {
  locale: Locale
  project: ProjectT
  basePath: string
  related: ProjectT[]
}

// tdg splits a project across four subpages behind a tab bar; the same sections run down
// one address here, which the two-segment address rule in lib/routing.ts requires anyway.
export function ProjectPage({ locale, project, basePath, related }: PropsT) {
  const { common, projects } = getTranslations(locale)
  const { title, description, area, duration, address, scope, gallery } = project

  return (
    <PageWrapper hasColumn={false}>
      <ProjectHero project={project} />

      <ProjectDescription
        container="site-container gridContainer paddings pt-12 md:pt-30 xl:pt-24"
        description={description}
        detailsTitle={projects.details}
        scopeTitle={projects.scopeOfWork}
        details={[
          { id: 1, name: projects.typeOfWork, value: title },
          { id: 2, name: projects.area, value: area },
          { id: 3, name: projects.duration, value: duration },
          { id: 4, name: projects.location, value: address },
        ]}
        scope={scope}
      />

      <ProjectGallery
        container="site-container paddings pt-20 md:pt-24 xl:pt-40"
        title={common.gallery}
        images={gallery}
      />

      <ObjectCarousel
        container="site-container pt-20 md:pt-24 xl:pt-40"
        sectionTitle={projects.otherProjects}
        items={related.map((item) => ({
          key: item.slug,
          href: childPath(basePath, item.slug),
          title: item.title,
          text: item.summary,
          image: item.image,
          details: [
            { id: 1, name: projects.location, value: item.address },
            { id: 2, name: projects.area, value: item.area },
            { id: 3, name: projects.duration, value: item.duration },
          ],
        }))}
      />
    </PageWrapper>
  )
}
