import { Media } from '@/components/media/media'
import type { MediaImageT, MediaVideoT } from '@/components/media/types'
import { ButtonArrow } from '@/components/ui/button-arrow'
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
    <section className="full-bleed relative flex h-svh flex-col">
      <div className="absolute inset-0 flex">
        <Media image={image} video={video} priority sizes="100vw" />
      </div>
      {/* Covers the whole frame rather than fading in from an edge: the photo is editable in
          the admin, so nothing here can assume where its bright areas fall. */}
      <div className="bg-scrim/20 absolute inset-0" />
      {/* No measure on the title: the field is a textarea so the editor owns where the line
          breaks, and a width cap would re-break it on the next copy change. */}
      <div className="paddings relative flex h-full w-full flex-col justify-end pb-12 text-on-media md:pb-16">
        <p
          data-display
          className="text-32 md:text-40 xl:text-hero text-shadow-lg leading-105 whitespace-pre-line"
        >
          {title}
        </p>
        {ctaLabel && ctaHref && (
          <div className="flex pt-6 md:pt-10">
            {/* Same lift as the nav pill: both float over an editable photo, so both need
                an edge the photo cannot supply. */}
            <ButtonLink
              href={ctaHref}
              label={ctaLabel}
              variant="light"
              icon="trailing"
              className="shadow-lg h-16"
            >
              <ButtonArrow />
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  )
}
