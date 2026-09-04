import { CarouselControls } from '@/components/carousel/carousel-controls'
import { Media } from '@/components/media/media'
import type { MediaImageT, MediaVideoT } from '@/components/media/types'

export type OfferSlideT = {
  image: MediaImageT | null
  video: MediaVideoT | null
  caption?: string | null
}

type PropsT = {
  slide: OfferSlideT
}

export function OfferSlide({ slide }: PropsT) {
  const { image, video, caption } = slide

  return (
    <>
      <div className="relative mb-3 h-[468px] w-full md:mb-4 md:aspect-[614/345] md:h-auto lg:mb-5 lg:aspect-[888/500]">
        <Media
          image={image}
          video={video}
          sizes="(min-width: 1920px) 1240px, (min-width: 1024px) 67vw, (min-width: 768px) 87vw, 100vw"
        />
      </div>
      <CarouselControls title={caption} />
    </>
  )
}
