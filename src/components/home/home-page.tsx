import { PageWrapper } from '@/components/layout/page-wrapper'
import type { RatingT } from '@/components/ui/rating-badge'
import { Hero, type HeroT } from './hero'
import {
  InteriorStylesCarousel,
  type InteriorStylesSectionT,
} from './interior-styles/interior-styles-carousel'
import { NumbersSection, type NumbersSectionT } from './numbers/numbers-section'
import { ProjectsCarousel, type ProjectsSectionT } from './projects-carousel/projects-carousel'
import { ServicesCarousel, type ServicesSectionT } from './services/services-carousel'
import {
  TestimonialsCarousel,
  type TestimonialsSectionT,
} from './testimonials/testimonials-carousel'
import { TextSection, type TextSectionT } from './text-section'

export type HomePageDataT = {
  hero?: HeroT
  intro?: TextSectionT
  services?: ServicesSectionT
  afterServices?: TextSectionT
  projects?: ProjectsSectionT
  numbers?: NumbersSectionT
  interiorStyles?: InteriorStylesSectionT
  testimonials?: TestimonialsSectionT
}

type PropsT = {
  data: HomePageDataT
  // Kept apart from `data`: the badges are edited on the footer global, not on this page.
  ratings: RatingT[]
}

// Section order and the vertical rhythm between them are the layout, so they live here
// rather than in a CMS field: an editor fills each section, never rearranges them.
export function HomePage({ data, ratings }: PropsT) {
  const { hero, intro, services, afterServices, projects, numbers, interiorStyles, testimonials } =
    data

  return (
    <PageWrapper>
      {hero && <Hero data={hero} />}
      {intro && (
        <TextSection container="gridContainer paddings pt-12 md:pt-30 xl:pt-24" data={intro} />
      )}
      {services && (
        <ServicesCarousel container="paddings pt-20 md:pt-24 xl:pt-30" data={services} />
      )}
      {afterServices && (
        <TextSection
          container="gridContainer paddings pt-20 md:pt-24 xl:pt-30"
          data={afterServices}
        />
      )}
      {numbers && <NumbersSection container="paddings pt-20 md:pt-24 xl:pt-40" data={numbers} />}
      {projects && (
        <ProjectsCarousel container="paddings pt-20 md:pt-24 xl:pt-40" data={projects} />
      )}
      {testimonials && (
        <TestimonialsCarousel
          container="paddings pt-20 md:pt-24 xl:pt-40"
          data={testimonials}
          ratings={ratings}
        />
      )}
      {interiorStyles && (
        <InteriorStylesCarousel
          container="paddings pt-16 md:pt-30 xl:pt-40"
          data={interiorStyles}
        />
      )}
    </PageWrapper>
  )
}
