import Link from 'next/link'

import { StyleCardBody } from '@/components/interior-styles/style-card-body'
import type { InteriorStyleT } from '@/lib/content/interior-styles'

type PropsT = {
  style: InteriorStyleT
  href: string
}

export function InteriorStyleSlide({ style, href }: PropsT) {
  return (
    <Link
      href={href}
      className="group border-r-border relative block shrink-0 border-r px-2 md:px-2.5"
    >
      <div className="w-80 px-2 md:w-108 md:px-4">
        <StyleCardBody
          style={style}
          imageClassName="h-76 md:h-100"
          // `min-h` rather than `h`: an explicit height on a `-webkit-box` fights the clamp and
          // lets a third line show through. Two lines at 135% is 32.4px, so 34px is the floor a
          // one-line card has to reach for the photos to stay level.
          textClassName="leading-135 line-clamp-2 min-h-8.5"
          // Wider than the square 304/400px box on purpose. `object-cover` scales a
          // landscape photo until it covers the box's *height*, so the visible strip is cut
          // from a source laid out height × its own aspect wide — and the widest of these
          // twelve is 2:1. Asking for the box width alone upscales those on a 1x screen.
          sizes="(max-width: 767px) 620px, 800px"
        />
      </div>
    </Link>
  )
}
