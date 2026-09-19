import { PageWrapper } from '@/components/layout/page-wrapper'
import { FadeUp } from '@/components/ui/fade-up'
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
      {/* Outside the wrapper on purpose: the wrapper opens the column with a gap the hero must
          not take, and it is the one section that starts flush under the fixed header. */}
      {hero && <Hero data={hero} />}
      {/* The rhythm is one gap on the column, not a top padding per section: a section that
          carries its own spacing only knows what comes before it in the one order it was
          written for, and each of these renders conditionally. */}
      <PageWrapper
        className={cn(
          'flex flex-col gap-20 md:gap-36',
          // The hero left the column, so the one gap it used to take from it is restated here
          // — same scale, so nothing about the spacing moves.
          hero && 'pt-20 md:pt-36',
        )}
      >
        {/* Each section rises into view on its own, so the wrapper is per section rather than
            one around the column — a single wrapper would reveal the whole page at once the
            moment its top edge cleared the fold. */}
        {intro && (
          <FadeUp>
            <TextSection container="gridContainer paddings" data={intro} />
          </FadeUp>
        )}
        {/* `pr-0 bleed-right` is the opt-in, and only the two tracks that peek take it: a slide
            cut off by the edge of the screen reads as "there is more", and cut off by a margin it
            reads as a bug. The projects and testimonials tracks are bounded on purpose and stay on
            the column. */}
        {services && (
          <FadeUp>
            <ServicesCarousel container="paddings pr-0 bleed-right" data={services} />
          </FadeUp>
        )}
        {afterServices && (
          <FadeUp>
            <TextSection container="gridContainer paddings" data={afterServices} />
          </FadeUp>
        )}
        {numbers && (
          <FadeUp>
            <NumbersSection container="paddings" data={numbers} />
          </FadeUp>
        )}
        {projects && (
          <FadeUp>
            <ProjectsCarousel container="paddings" data={projects} />
          </FadeUp>
        )}
        {testimonials && (
          <FadeUp>
            <TestimonialsCarousel container="paddings" data={testimonials} ratings={ratings} />
          </FadeUp>
        )}
        {interiorStyles && (
          <FadeUp>
            <InteriorStylesCarousel container="paddings pr-0 bleed-right" data={interiorStyles} />
          </FadeUp>
        )}
      </PageWrapper>
    </>
  )
}
