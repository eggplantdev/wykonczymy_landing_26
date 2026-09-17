import { SectionTitle } from '@/components/layout/section-title'
import { Media } from '@/components/media/media'
import type { MediaImageT, MediaVideoT } from '@/components/media/types'
import { ButtonLink } from '@/components/ui/button-link'

export type FeaturedProjectT = {
  sectionTitle: string
  projectTitle: string | null
  projectSubtitle: string | null
  ctaLabel: string | null
  ctaHref: string
  image: MediaImageT | null
  video: MediaVideoT | null
}

type PropsT = {
  container: string
  data: FeaturedProjectT
}

export function FeaturedProject({ container, data }: PropsT) {
  const { sectionTitle, projectTitle, projectSubtitle, ctaLabel, ctaHref, image, video } = data

  return (
    <section className={container}>
      <SectionTitle title={sectionTitle} className="pb-6 md:pb-8" />
      <div className="relative flex h-lvh items-center justify-center md:h-176 lg:h-[755px]">
        <div className="absolute inset-0 flex">
          <Media image={image} video={video} sizes="100vw" />
        </div>

        <div className="paddings relative flex flex-col items-center justify-center text-center text-white">
          <p className="text-32 md:text-40 lg:text-58">{projectTitle}</p>
          <p className="text-18 leading-125 md:text-20 md:leading-130 lg:text-32 lg:leading-normal pt-3 text-balance md:pt-3.5 xl:pt-4">
            {projectSubtitle}
          </p>
        </div>
        {ctaLabel && (
          <div className="absolute right-0 bottom-6 left-0 flex justify-center md:bottom-12 lg:bottom-10">
            <ButtonLink label={ctaLabel} href={ctaHref} className="mx-auto" />
          </div>
        )}
      </div>
    </section>
  )
}
