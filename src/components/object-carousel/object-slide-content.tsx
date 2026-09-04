import Link from 'next/link'

import { Media } from '@/components/media/media'
import type { ObjectCarouselItemT } from '@/types/object-carousel'
import { SpecStrip } from '@/components/ui/spec-strip'

type PropsT = {
  item: ObjectCarouselItemT
  sectionTitle: string
}

// The body of one carousel slide, also used as a row on the projects listing — image on
// the right from tablet up, heading and blurb on the left.
export function ObjectSlideContent({ item, sectionTitle }: PropsT) {
  const { href, title, text, image, details } = item

  return (
    <Link href={href} className="gridContainer col-span-full lg:col-span-10 lg:grid-cols-10">
      <h2 className="text-14 col-span-full my-6 font-medium md:hidden">{sectionTitle}</h2>

      <div className="relative col-span-full mb-6 aspect-[312/209] overflow-hidden md:order-2 md:col-span-3 md:col-start-6 md:mb-0 md:aspect-auto lg:col-span-4 lg:col-start-7">
        <Media image={image} sizes="(max-width: 767px) 100vw, 33vw" />
      </div>

      <div className="col-span-full flex flex-col md:col-span-4">
        <h2 className="md:text-18 lg:text-20 mb-6 hidden font-medium md:block">{sectionTitle}</h2>
        <h3 className="text-20 md:text-22 lg:text-28 mb-6 line-clamp-1 md:mb-9 lg:mb-12">
          {title}
        </h3>
        <p className="text-12 md:text-14 leading-130 mb-8 line-clamp-3 md:h-14 lg:mb-12">{text}</p>
        {details && <SpecStrip items={details} className="mt-auto" />}
      </div>
    </Link>
  )
}
