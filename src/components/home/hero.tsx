import { Media } from '@/components/media/media'
import type { MediaImageT, MediaVideoT } from '@/components/media/types'
import { ButtonLink } from '@/components/ui/button-link'

export type HeroT = {
  title: string
  image: MediaImageT | null
  video: MediaVideoT | null
  ctaLabel?: string
  ctaHref?: string
}

type PropsT = {
  data: HeroT
}

export function Hero({ data }: PropsT) {
  const { title, image, video, ctaLabel, ctaHref } = data

  return (
    <section className="relative flex h-svh flex-col items-center justify-center">
      <div className="absolute inset-0 flex">
        <Media image={image} video={video} priority sizes="100vw" />
      </div>
      <div className="relative flex h-full flex-col items-center justify-center text-white">
        <p className="text-32 md:text-40 xl:text-58 mx-10 text-center">{title}</p>
        {ctaLabel && ctaHref && (
          <div className="pt-6 md:pt-10">
            <ButtonLink href={ctaHref} label={ctaLabel} variant="light" />
          </div>
        )}
      </div>
    </section>
  )
}
