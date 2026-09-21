'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { carouselDefaults, useCarousel } from '@/lib/carousel'
import { useTranslation } from '@/lib/i18n/use-translation'
import { SectionTitle } from '@/components/ui/section-title'
import { ButtonLink } from '@/components/ui/button-link'
import { cn } from '@/lib/cn'
import { ProjectSlide, type ProjectSlideT } from './project-slide'

export type ProjectsSectionT = {
  sectionTitle?: string
  ctaHref: string
  slides: ProjectSlideT[]
}

type PropsT = {
  container: string
  data: ProjectsSectionT
}

export function ProjectsCarousel({ container, data }: PropsT) {
  const { slides, ctaHref, sectionTitle } = data
  const { t } = useTranslation('common')
  const carousel = useCarousel()

  if (slides.length < 1) return null

  return (
    <section className={cn(container, carousel.className)}>
      <div className="mb-4 gridContainer items-center justify-between md:mb-6 xl:mb-10">
        <SectionTitle title={sectionTitle} className="col-span-4 lg:col-span-5 lg:col-start-3" />
        <div className="col-span-3">
          <ButtonLink
            label={t('more')}
            href={ctaHref}
            variant="solid"
            size="sm"
            className="ml-auto hidden md:flex"
          />
        </div>
      </div>
      <Swiper
        {...carouselDefaults}
        // Too few projects to loop: Swiper keeps a slide on each flank of the centred one
        // and runs out, parking the track with a hole beside whichever side came up short.
        // A bounded track puts that space where it belongs — before the first, after the last.
        loop={false}
        // The track moves only when a visitor moves it. Drag and the arrows both stay; what goes
        // is the rotation that advanced it on its own.
        autoplay={false}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          768: { spaceBetween: 20, slidesPerView: 1.144 },
          1024: { centeredSlides: true, spaceBetween: 22, slidesPerView: 1.5 },
        }}
        onSwiper={carousel.onSwiper}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <ProjectSlide slide={slide} total={slides.length} />
          </SwiperSlide>
        ))}
      </Swiper>
      <ButtonLink
        label={t('more')}
        href={ctaHref}
        variant="solid"
        size="sm"
        className="mx-auto mt-4 md:hidden"
      />
    </section>
  )
}
