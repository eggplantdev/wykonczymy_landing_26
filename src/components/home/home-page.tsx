import { PageWrapper } from '@/components/layout/page-wrapper'
import { FeaturedProject, type FeaturedProjectT } from './featured-project'
import { Hero, type HeroT } from './hero'
import {
  InteriorStylesCarousel,
  type InteriorStylesSectionT,
} from './interior-styles/interior-styles-carousel'
import { NumbersSection, type NumbersSectionT } from './numbers/numbers-section'
import { ProjectsCarousel, type ProjectsSectionT } from './projects-carousel/projects-carousel'
import { ServicesCarousel, type ServicesSectionT } from './services/services-carousel'
import { TextSection, type TextSectionT } from './text-section'

export type HomePageDataT = {
  hero?: HeroT
  intro?: TextSectionT
  services?: ServicesSectionT
  projects?: ProjectsSectionT
  numbers?: NumbersSectionT
  interiorStyles?: InteriorStylesSectionT
  featuredProject?: FeaturedProjectT
}

type PropsT = {
  data: HomePageDataT
}

// Section order and the vertical rhythm between them are the layout, so they live here
// rather than in a CMS field: an editor fills each section, never rearranges them.
export function HomePage({ data }: PropsT) {
  const { hero, intro, services, projects, numbers, interiorStyles, featuredProject } = data

  return (
    <PageWrapper>
      {hero && <Hero data={hero} />}
      {intro && (
        <TextSection container="gridContainer paddings pt-12 md:pt-30 xl:pt-24" data={intro} />
      )}
      {services && (
        <ServicesCarousel container="paddings pt-20 md:pt-24 xl:pt-30" data={services} />
      )}
      {projects && (
        <ProjectsCarousel container="paddings pt-20 md:pt-24 xl:pt-40" data={projects} />
      )}
      {numbers && <NumbersSection container="paddings pt-20 md:pt-24 xl:pt-40" data={numbers} />}
      {interiorStyles && (
        <InteriorStylesCarousel
          container="paddings pt-16 md:pt-30 xl:pt-40"
          data={interiorStyles}
        />
      )}
      {featuredProject && (
        <FeaturedProject container="paddings pt-20 md:pt-30 xl:pt-40" data={featuredProject} />
      )}
    </PageWrapper>
  )
}
