import Link from 'next/link'

import { StyleCardBody } from '@/components/interior-styles/style-card-body'
import { firstSlideLoading } from '@/lib/carousel'
import type { InteriorStyleT } from '@/lib/content/interior-styles'

type PropsT = {
  style: InteriorStyleT
  href: string
  isFirst?: boolean
}

export function InteriorStyleSlide({ style, href, isFirst }: PropsT) {
  return (
    <Link
      href={href}
      className="group relative block shrink-0 border-r border-r-border px-2 md:px-2.5"
    >
      <div className="w-80 px-2 md:w-108 md:px-4">
        <StyleCardBody
          style={style}
          imageClassName="h-76 md:h-100"
          // `min-h` rather than `h`: an explicit height on a `-webkit-box` fights the clamp and
          // lets a fourth line show through. `3lh` is the floor a one-line card has to reach
          // for the photos to stay level, and it follows `leading-135` on its own.
          textClassName="leading-135 line-clamp-3 min-h-[3lh]"
          // Wider than the square 304/400px box on purpose. `object-cover` scales a
          // landscape photo until it covers the box's *height*, so the visible strip is cut
          // from a source laid out height × its own aspect wide — and the widest of these
          // twelve is 2:1. Asking for the box width alone upscales those on a 1x screen.
          sizes="(max-width: 767px) 620px, 800px"
          {...(isFirst && firstSlideLoading)}
        />
      </div>
    </Link>
  )
}
