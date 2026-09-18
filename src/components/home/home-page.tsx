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
    // The rhythm is one gap on the column, not a top padding per section: a section that
    // carries its own spacing only knows what comes before it in the one order it was
    // written for, and each of these renders conditionally.
    <PageWrapper className="flex flex-col gap-20 md:gap-24 xl:gap-40">
      {hero && <Hero data={hero} />}
      {intro && <TextSection container="gridContainer paddings" data={intro} />}
      {services && <ServicesCarousel container="paddings" data={services} />}
      {afterServices && <TextSection container="gridContainer paddings" data={afterServices} />}
      {numbers && <NumbersSection container="paddings" data={numbers} />}
      {projects && <ProjectsCarousel container="paddings" data={projects} />}
      {testimonials && (
        <TestimonialsCarousel container="paddings" data={testimonials} ratings={ratings} />
      )}
      {interiorStyles && <InteriorStylesCarousel container="paddings" data={interiorStyles} />}
    </PageWrapper>
  )
}
