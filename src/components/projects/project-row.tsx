import Link from 'next/link'

import { Media } from '@/components/media/media'
import { EntryTitle } from '@/components/ui/entry-title'
import { PhotoHover } from '@/components/ui/photo-hover'
import { SpecStrip } from '@/components/ui/spec-strip'
import type { MediaImageT } from '@/components/media/types'
import type { SpecItemT } from '@/lib/content/spec-item'

type PropsT = {
  href: string
  title: string
  summary: string
  image: MediaImageT | null
  details: SpecItemT[]
  preload?: boolean
}

// One listing entry. The carousel's slide body reserves two columns for its arrows, which
// a listing has no use for, so this row spans the full grid instead.
export function ProjectRow({ href, title, summary, image, details, preload }: PropsT) {
  return (
    <Link href={href} className="group gridContainer paddings py-8 lg:py-12">
      <div className="relative col-span-full mb-6 aspect-3/2 overflow-hidden md:order-2 md:col-span-4 md:col-start-5 md:mb-0 lg:col-span-4 lg:col-start-9">
        <Media
          image={image}
          preload={preload}
          // `sizes` ignores the push: a transform is paint-time and never widens the layout
          // box, so asking for more here only buys a heavier download.
          className="hover-photo"
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 2047px) 33vw, 640px"
        />
        <PhotoHover />
      </div>

      <div className="col-span-full flex flex-col md:col-span-4 lg:col-span-5">
        <EntryTitle title={title} />
        <p className="mb-8 text-14 leading-130 lg:mb-12">{summary}</p>
        <SpecStrip items={details} className="mt-auto grid-cols-1" />
      </div>
    </Link>
  )
}
