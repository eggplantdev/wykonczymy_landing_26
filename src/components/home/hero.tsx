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
      <div className="bg-scrim/10 absolute inset-0" />

      {/* No measure on the title: the field is a textarea so the editor owns where the line
          breaks, and a width cap would re-break it on the next copy change. */}
      <div className="paddings text-on-media relative flex h-full w-full flex-col md:justify-end md:pb-16">
        {/* Mobile only: the CTA is pinned to the foot of the frame, so the title claims the
            space it leaves and centres inside that. From md the stack goes back to sitting
            together at the bottom, which is why the growth stops there. */}
        <div className="flex flex-1 flex-col justify-center md:flex-none">
          <p
            data-display
            className="text-40 md:text-72 xl:text-hero leading-105 font-bold break-words whitespace-pre-line"
          >
            {title}
          </p>
        </div>
        {/* The photo is a dark surface whatever the page's theme is, so the CTA claims the
            dark role tokens the way the footer band does — `solid` then resolves to the same
            white pill here as it does down there, instead of going black on the light theme. */}
        {ctaLabel && ctaHref && (
          <div data-theme="dark" className="flex pb-12 md:pt-10 md:pb-0">
            <ButtonLink href={ctaHref} label={ctaLabel} variant="solid" size="sm" icon="trailing">
              <ButtonArrow variant="solid" />
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  )
}
