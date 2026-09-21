import { PageWrapper } from '@/components/layout/page-wrapper'
import { FadeUp } from '@/components/ui/fade-up'
import type { RatingT } from '@/components/ui/rating-badge'
import { Hero, type HeroT } from './hero'
import {
  InteriorStylesCarousel,
  type InteriorStylesSectionT,
} from './interior-styles/interior-styles-carousel'
import { NumbersSection, type NumbersSectionT } from './numbers/numbers-section'
import { ProcessSpotlight, type ProcessSectionT } from './process/process-spotlight'
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
  process?: ProcessSectionT
}

type PropsT = {
  data: HomePageDataT
  // Kept apart from `data`: the badges are edited on the footer global, not on this page.
  ratings: RatingT[]
}

// Section order and the vertical rhythm between them are the layout, so they live here
// rather than in a CMS field: an editor fills each section, never rearranges them.
export function HomePage({ data, ratings }: PropsT) {
  const {
    hero,
    intro,
    services,
    afterServices,
    projects,
    numbers,
    interiorStyles,
    testimonials,
    process: processSection,
  } = data

  return (
    <>
      {/* Outside the wrapper on purpose: it is the one section that starts flush under the
          fixed header. */}
      {hero && <Hero data={hero} />}
      {/* Each section owns the space above it, rather than the column owning one gap between
          all of them: an even rhythm is not what the page wants — a carousel and a paragraph
          need different air — and a single `gap` can only be changed for every section at once.
          `pt` and not `py` so the spacing between two sections is stated in one place, on the
          lower one, and the section that happens to render first sets the distance from the
          hero without knowing it is first. */}
      <PageWrapper hasColumn={false} className="flex flex-col">
        {/* Each section rises into view on its own, so the wrapper is per section rather than
            one around the column — a single wrapper would reveal the whole page at once the
            moment its top edge cleared the fold. */}
        {intro && (
          <FadeUp>
            <TextSection
              container="site-container gridContainer paddings pt-20 md:pt-40"
              data={intro}
            />
          </FadeUp>
        )}
        {/* `pr-0` on the two tracks that peek, so the slide at the end is cut off by the edge of
            the screen — which reads as "there is more" — rather than by a margin, which reads as a
            bug. The projects and testimonials tracks are bounded on purpose and keep theirs. */}
        {services && (
          <FadeUp>
            <ServicesCarousel container="paddings pr-0 pt-20 md:pt-40" data={services} />
          </FadeUp>
        )}
        {afterServices && (
          <FadeUp>
            <TextSection
              container="site-container gridContainer paddings pt-20 md:pt-28"
              data={afterServices}
            />
          </FadeUp>
        )}
        {numbers && (
          <FadeUp>
            <NumbersSection container="site-container paddings pt-20 md:pt-28" data={numbers} />
          </FadeUp>
        )}
        {projects && (
          <FadeUp>
            <ProjectsCarousel container="paddings pt-20 md:pt-28" data={projects} />
          </FadeUp>
        )}
        {testimonials && (
          <FadeUp>
            <TestimonialsCarousel
              container="site-container paddings pt-20 md:pt-28"
              data={testimonials}
              ratings={ratings}
            />
          </FadeUp>
        )}

        {processSection && (
          <FadeUp>
            <ProcessSpotlight
              container="site-container paddings pt-20 md:pt-28"
              data={processSection}
            />
          </FadeUp>
        )}
        {interiorStyles && (
          <FadeUp>
            <InteriorStylesCarousel
              container="paddings pr-0 pt-20 md:pt-28"
              data={interiorStyles}
            />
          </FadeUp>
        )}
      </PageWrapper>
    </>
  )
}
