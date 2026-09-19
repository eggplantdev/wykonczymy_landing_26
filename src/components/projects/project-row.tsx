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
    <Link
      href={href}
      // The row inverts on hover rather than taking a grey fill: `surface` is the pair that
      // tracks the opposite of the page, so this is black-on-white in the light theme and
      // white-on-black in the dark one, instead of a literal black that the dark page swallows.
      // The children carry no colour of their own, so they follow the animating `color` for free.
      className="gridContainer paddings group hover:bg-surface hover:text-surface-foreground bg-transparent py-8 delay-100 duration-1000 lg:py-12"
    >
      <div className="relative col-span-full mb-6 aspect-3/2 overflow-hidden md:order-2 md:col-span-4 md:col-start-5 md:mb-0 lg:col-span-4 lg:col-start-9">
        <Media
          image={image}
          // The scale rides on the photo, not on the box around it: a clip box is scaled
          // along with its element, so putting it a level up would grow the frame instead of
          // pushing the photo against it. `sizes` is unchanged — a transform is paint-time and
          // never widens the layout box, so asking for more only buys a heavier download.
          className="delay-100 duration-1000 group-hover:scale-105"
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
