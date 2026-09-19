import { PageWrapper } from '@/components/layout/page-wrapper'
import type { RatingT } from '@/components/ui/rating-badge'
import { cn } from '@/lib/cn'
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
    <>
      {/* Outside the wrapper on purpose: the wrapper clips horizontally — that clip is what
          contains the carousel tracks — and the hero is the one thing on the page that has to
          bleed past the 1920 cap rather than be trimmed back to it. */}
      {hero && <Hero data={hero} />}
      {/* The rhythm is one gap on the column, not a top padding per section: a section that
          carries its own spacing only knows what comes before it in the one order it was
          written for, and each of these renders conditionally. */}
      <PageWrapper
        className={cn(
          'flex flex-col gap-20 md:gap-40',
          // The hero left the column, so the one gap it used to take from it is restated here
          // — same scale, so nothing about the spacing moves.
          hero && 'pt-20 md:pt-40',
        )}
      >
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
    </>
  )
}
