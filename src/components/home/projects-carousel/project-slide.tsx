import { Media } from '@/components/media/media'
import type { MediaImageT, MediaVideoT } from '@/components/media/types'
import { CarouselControls } from './carousel-controls'

export type ProjectSlideT = {
  image: MediaImageT | null
  video: MediaVideoT | null
  caption?: string | null
}

type PropsT = {
  slide: ProjectSlideT
}

export function ProjectSlide({ slide }: PropsT) {
  const { image, video, caption } = slide

  return (
    <>
      <div className="relative mb-3 h-[468px] w-full md:mb-4 md:aspect-[614/345] md:h-auto lg:mb-5 lg:aspect-[888/500]">
        <Media
          image={image}
          video={video}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 87vw, (max-width: 1919px) 67vw, 1240px"
        />
      </div>
      <CarouselControls title={caption} />
    </>
  )
}
