import { Media } from '@/components/media/media'
import type { MediaImageT, MediaVideoT } from '@/components/media/types'

export type ServiceCardT = {
  title: string
  text: string
  image: MediaImageT | null
  video: MediaVideoT | null
}

type PropsT = {
  card: ServiceCardT
}

export function ServiceSlide({ card }: PropsT) {
  const { title, text, image, video } = card

  return (
    <div className="shrink-0 px-4 pt-3 pb-4 md:pb-6">
      <div className="relative aspect-233/156 md:aspect-400/381">
        <Media
          image={image}
          video={video}
          sizes="(max-width: 767px) 75vw, (max-width: 1023px) 57vw, (max-width: 1279px) 45vw, 40vw"
        />
      </div>
      <div className="border-b-shwarz h-6.5 border-b md:h-10" />

      <header className="text-18 md:text-20 mb-3 line-clamp-1 pt-4 font-medium md:mb-4 md:pt-8">
        {title}
      </header>
      <div className="text-12 md:text-14 md:leading-130 line-clamp-7 h-24.5 overflow-hidden md:h-22.5">
        {text}
      </div>
    </div>
  )
}
