import { CarouselArrow } from '@/components/ui/carousel-arrow'
import type { ObjectCarouselItemT } from '@/components/object-carousel/types'
import { ObjectSlideContent } from './object-slide-content'

type PropsT = {
  item: ObjectCarouselItemT
  sectionTitle: string
}

// The arrows live inside the slide, as in tdg: on desktop they flank the content as the
// outer two grid columns, on mobile they sit under it. Both need Swiper's context, which
// only a descendant of the track has.
export function ObjectCarouselSlide({ item, sectionTitle }: PropsT) {
  return (
    <>
      <div className="gridContainer paddings pb-8 md:py-6 lg:py-12">
        <aside className="col-span-1 hidden items-center lg:flex">
          <CarouselArrow direction="left" />
        </aside>

        <ObjectSlideContent item={item} sectionTitle={sectionTitle} />

        <aside className="col-span-1 hidden items-center justify-end lg:flex">
          <CarouselArrow direction="right" />
        </aside>
      </div>

      <div className="mt-4 flex items-end justify-end gap-x-1.5 paddings lg:hidden">
        <CarouselArrow direction="left" />
        <CarouselArrow direction="right" />
      </div>
    </>
  )
}
