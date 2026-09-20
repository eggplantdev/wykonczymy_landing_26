import Link from 'next/link'

import { Media } from '@/components/media/media'
import type { MediaImageT, MediaVideoT } from '@/components/media/types'
import { PhotoHover } from '@/components/ui/photo-hover'
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
      {/* `overflow-hidden` earns its place only now: the photo used to fill the link exactly, and
          a scaled one with nothing to clip it would spill over the slide beside it. */}
      <Link
        href={href}
        className="group relative mb-3 block h-117 w-full overflow-hidden md:mb-4 md:aspect-614/345 md:h-auto lg:mb-5 lg:aspect-888/500"
      >
        <Media
          image={image}
          video={video}
          className="hover-photo"
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 87vw, 67vw"
        />
        <PhotoHover />
      </Link>
      <CarouselControls title={caption} total={total} />
    </>
  )
}
