'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { carouselDefaults, useCarouselReady } from '@/lib/carousel'
import { SectionTitle } from '@/components/layout/section-title'
import { ButtonLink } from '@/components/ui/button-link'
import { cn } from '@/lib/cn'
import { ProjectSlide, type ProjectSlideT } from './project-slide'

export type ProjectsSectionT = {
  sectionTitle?: string
  ctaLabel?: string
  ctaHref: string
  slides: ProjectSlideT[]
}

type PropsT = {
  container: string
  data: ProjectsSectionT
}

export function ProjectsCarousel({ container, data }: PropsT) {
  const { slides, ctaLabel, ctaHref, sectionTitle } = data
  const carousel = useCarouselReady()

  if (slides.length < 1) return null

  return (
    <section className={cn(container, carousel.className)}>
      <div className="gridContainer mb-4 items-center justify-between md:mb-6 xl:mb-10">
        <SectionTitle title={sectionTitle} className="col-span-4 lg:col-span-5 lg:col-start-3" />
        <div className="col-span-3">
          <ButtonLink label={ctaLabel} href={ctaHref} className="ml-auto hidden md:flex" />
        </div>
      </div>
      <Swiper
        {...carouselDefaults}
        // Too few projects to loop: Swiper keeps a slide on each flank of the centred one
        // and runs out, parking the track with a hole beside whichever side came up short.
        // A bounded track puts that space where it belongs — before the first, after the last.
        loop={false}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          768: { spaceBetween: 20, slidesPerView: 1.144 },
          1024: { centeredSlides: true, spaceBetween: 22, slidesPerView: 1.5 },
        }}
        onSwiper={carousel.onSwiper}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.caption}>
            <ProjectSlide slide={slide} total={slides.length} />
          </SwiperSlide>
        ))}
      </Swiper>
      <ButtonLink label={ctaLabel} href={ctaHref} className="mx-auto mt-8 md:hidden" />
    </section>
  )
}
