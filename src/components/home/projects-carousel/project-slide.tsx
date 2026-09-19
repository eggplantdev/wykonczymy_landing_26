import Link from 'next/link'

import { Media } from '@/components/media/media'
import type { MediaImageT, MediaVideoT } from '@/components/media/types'
import { CarouselControls } from './carousel-controls'

export type ProjectSlideT = {
  // The project's own id, and the only thing on a slide that is unique: two projects in the
  // same district share a title, and the broken seed rows share a slug.
  id: number
  image: MediaImageT | null
  video: MediaVideoT | null
  caption?: string | null
  href: string
}

type PropsT = {
  slide: ProjectSlideT
  total: number
}

export function ProjectSlide({ slide, total }: PropsT) {
  const { image, video, caption, href } = slide

  return (
    <>
      <Link
        href={href}
        className="relative mb-3 block h-117 w-full md:mb-4 md:aspect-614/345 md:h-auto lg:mb-5 lg:aspect-888/500"
      >
        <Media
          image={image}
          video={video}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 87vw, (max-width: 1919px) 67vw, 1240px"
        />
      </Link>
      <CarouselControls title={caption} total={total} />
    </>
  )
}
