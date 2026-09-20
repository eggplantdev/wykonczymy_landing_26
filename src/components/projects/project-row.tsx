import Link from 'next/link'

import { Media } from '@/components/media/media'
import { SpecStrip } from '@/components/ui/spec-strip'
import type { MediaImageT } from '@/components/media/types'
import type { SpecItemT } from '@/lib/content/spec-item'

type PropsT = {
  href: string
  title: string
  summary: string
  image: MediaImageT | null
  details: SpecItemT[]
}

// One listing entry. The carousel's slide body reserves two columns for its arrows, which
// a listing has no use for, so this row spans the full grid instead.
export function ProjectRow({ href, title, summary, image, details }: PropsT) {
  return (
    <Link href={href} className="gridContainer paddings group py-8 lg:py-12">
      <div className="relative col-span-full mb-6 aspect-3/2 overflow-hidden md:order-2 md:col-span-4 md:col-start-5 md:mb-0 lg:col-span-4 lg:col-start-9">
        <Media
          image={image}
          // `sizes` ignores the push: a transform is paint-time and never widens the layout
          // box, so asking for more here only buys a heavier download.
          className="hover-photo"
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 2047px) 33vw, 640px"
        />
      </div>

      <div className="col-span-full flex flex-col md:col-span-4 lg:col-span-5">
        <h2 className="text-20 md:text-22 lg:text-28 mb-6 md:mb-9 lg:mb-12">{title}</h2>
        <p className="text-12 md:text-14 leading-130 mb-8 lg:mb-12">{summary}</p>
        <SpecStrip items={details} className="mt-auto grid-cols-1" />
      </div>
    </Link>
  )
}
