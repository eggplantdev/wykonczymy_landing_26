'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { carouselDefaults, useCarouselReady } from '@/lib/carousel'
import { cn } from '@/lib/cn'
import { useTranslation } from '@/lib/i18n/use-translation'
import { childPath } from '@/lib/routing'
import type { InteriorStyleT } from '@/lib/content/interior-styles'
import { SectionTitle } from '@/components/layout/section-title'
import { ButtonLink } from '@/components/ui/button-link'
import { CarouselNav } from '@/components/ui/carousel-nav'
import { InteriorStyleSlide } from './interior-style-slide'

export type InteriorStylesSectionT = {
  sectionTitle: string
  ctaHref: string
  basePath: string
  styles: InteriorStyleT[]
}

type PropsT = {
  container: string
  data: InteriorStylesSectionT
}

export function InteriorStylesCarousel({ container, data }: PropsT) {
  const { sectionTitle, ctaHref, basePath, styles } = data
  const { t } = useTranslation('common')
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

        {/* `container-end` renders after the track but still inside Swiper's context, which
            is where the arrows read the instance from — so the link comes in here too rather
            than the arrows going out, which is what puts both on one row. Three columns so
            the link stays centred on the section whatever width the arrows take. No count
            beside them: the row is `slidesPerView="auto"`, so "3 of 12" would be counting
            something the visitor cannot see the edges of. The row also undoes the section's
            right bleed, so the arrows land on the column rather than out in the gutter. */}
        <div
          slot="container-end"
          className="unbleed-right grid grid-cols-3 items-center pt-4 pr-6 md:pr-8 xl:pr-12"
        >
          <ButtonLink
            label={t('more')}
            href={ctaHref}
            variant="solid"
            size="sm"
            className="col-start-2 justify-self-center"
          />

          {styles.length > 1 && <CarouselNav className="col-start-3 justify-self-end" />}
        </div>
      </Swiper>
    </section>
  )
}
