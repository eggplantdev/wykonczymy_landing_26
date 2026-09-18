'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { carouselDefaults, useCarouselReady } from '@/lib/carousel'
import { cn } from '@/lib/cn'
import { childPath } from '@/lib/routing'
import type { InteriorStyleT } from '@/lib/content/interior-styles'
import { SectionTitle } from '@/components/layout/section-title'
import { ButtonLink } from '@/components/ui/button-link'
import { InteriorStyleSlide } from './interior-style-slide'

export type InteriorStylesSectionT = {
  sectionTitle: string
  ctaLabel: string
  ctaHref: string
  basePath: string
  styles: InteriorStyleT[]
}

type PropsT = {
  container: string
  data: InteriorStylesSectionT
}

export function InteriorStylesCarousel({ container, data }: PropsT) {
  const { sectionTitle, ctaLabel, ctaHref, basePath, styles } = data
  const carousel = useCarouselReady()

  if (styles.length < 1) return null

  return (
    <section className={cn(container, carousel.className)}>
      <SectionTitle title={sectionTitle} className="pb-6 md:pb-8 lg:pb-10" />
      <Swiper
        {...carouselDefaults}
        slidesPerView="auto"
        className="xlg:mb-10 mb-8"
        onSwiper={carousel.onSwiper}
      >
        {styles.map((style) => (
          <SwiperSlide key={style.id} className="w-auto!">
            <InteriorStyleSlide style={style} href={childPath(basePath, style.slug)} />
          </SwiperSlide>
        ))}
      </Swiper>
      <ButtonLink label={ctaLabel} href={ctaHref} className="mx-auto" />
    </section>
  )
}
