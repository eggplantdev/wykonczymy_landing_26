import Link from 'next/link'

import { Media } from '@/components/media/media'
import { CarouselArrow } from '@/components/ui/carousel-arrow'
import type { InteriorStyleT } from '@/types/interior-styles'

type PropsT = {
  style: InteriorStyleT
  href: string
  sectionTitle: string
}

// The arrows live inside the slide, as in tdg: on desktop they flank the content as the
// outer two grid columns, on mobile they sit under it. Both need Swiper's context, which
// only a descendant of the track has.
export function RelatedStyleSlide({ style, href, sectionTitle }: PropsT) {
  const { title, text, image } = style

  return (
    <>
      <div className="gridContainer paddings pb-8 md:py-6 lg:py-12">
        <aside className="col-span-1 hidden items-center lg:flex">
          <CarouselArrow direction="left" />
        </aside>

        <Link href={href} className="gridContainer col-span-full lg:col-span-10 lg:grid-cols-10">
          <h2 className="text-14 col-span-full my-6 font-medium md:hidden">{sectionTitle}</h2>

          <div className="relative col-span-full mb-6 aspect-[312/209] overflow-hidden md:order-2 md:col-span-3 md:col-start-6 md:mb-0 md:aspect-auto lg:col-span-4 lg:col-start-7">
            <Media image={image} sizes="(max-width: 767px) 100vw, 33vw" />
          </div>

          <div className="col-span-full md:col-span-4">
            <h2 className="md:text-18 lg:text-20 mb-6 hidden font-medium md:block">
              {sectionTitle}
            </h2>
            <h3 className="text-20 md:text-22 lg:text-28 mb-6 line-clamp-1 md:mb-9 lg:mb-[4.875rem]">
              {title}
            </h3>
            <p className="text-12 md:text-14 leading-130 col-span-5 mb-8 line-clamp-3 h-12 md:col-span-full md:h-14 lg:mb-12">
              {text}
            </p>
          </div>
        </Link>

        <aside className="col-span-1 hidden items-center justify-end lg:flex">
          <CarouselArrow direction="right" />
        </aside>
      </div>

      <div className="paddings mt-4 flex items-end justify-end gap-4 lg:hidden">
        <CarouselArrow direction="left" />
        <CarouselArrow direction="right" />
      </div>
    </>
  )
}
