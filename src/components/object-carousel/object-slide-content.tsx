import Link from 'next/link'

import { Media } from '@/components/media/media'
import type { ObjectCarouselItemT } from '@/components/object-carousel/types'
import { EntryTitle } from '@/components/ui/entry-title'
import { SpecStrip } from '@/components/ui/spec-strip'
import { cn } from '@/lib/cn'

type PropsT = {
  item: ObjectCarouselItemT
  sectionTitle: string
}

// Image on the right from tablet up, heading and blurb on the left.
export function ObjectSlideContent({ item, sectionTitle }: PropsT) {
  const { href, title, text, image, details } = item

  return (
    <Link href={href} className="gridContainer col-span-full lg:col-span-10 lg:grid-cols-10">
      {/* The label repeats on every slide and again per breakpoint, so the carousel carries
          the one real heading and these two stay plain text — six copies of the same `h2`
          would otherwise stand in the page outline. `aria-hidden` for the same reason: the
          carousel's heading already says this, and each slide is a link whose name would
          otherwise open by repeating it. */}
      <p
        aria-hidden="true"
        data-display
        className="text-14 col-span-full my-6 font-medium md:hidden"
      >
        {sectionTitle}
      </p>

      <div className="relative col-span-full mb-6 aspect-312/209 overflow-hidden md:order-2 md:col-span-3 md:col-start-6 md:mb-0 md:aspect-auto lg:col-span-4 lg:col-start-7">
        <Media image={image} sizes="(max-width: 767px) 100vw, (max-width: 2047px) 33vw, 676px" />
      </div>

      <div className="col-span-full flex flex-col md:col-span-4">
        <p
          aria-hidden="true"
          data-display
          className="md:text-18 lg:text-20 mb-6 hidden font-medium md:block"
        >
          {sectionTitle}
        </p>
        <EntryTitle title={title} level="h3" className="line-clamp-1" />
        {/* The height is pinned, not just clamped: the arrows sit below this block on
            mobile, so a short blurb followed by a long one would walk them up and down the
            page as the carousel advances. */}
        <p
          className={cn(
            'text-12 md:text-14 leading-130 line-clamp-3 h-12 md:h-14',
            details && 'mb-8 lg:mb-12',
          )}
        >
          {text}
        </p>
        {details && <SpecStrip items={details} className="mt-auto" />}
      </div>
    </Link>
  )
}
