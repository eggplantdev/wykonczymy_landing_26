'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { carouselDefaults, useCarouselReady } from '@/lib/carousel'
import { SectionTitle } from '@/components/layout/section-title'
import { CarouselNav } from '@/components/ui/carousel-nav'
import { cn } from '@/lib/cn'
import { ServiceSlide, type ServiceCardT } from './service-slide'

export type ServicesSectionT = {
  sectionTitle: string
  cards: ServiceCardT[]
}

type PropsT = {
  container: string
  data: ServicesSectionT
}

export function ServicesCarousel({ container, data }: PropsT) {
  const { sectionTitle, cards } = data
  const carousel = useCarouselReady()

  if (cards.length < 1) return null

  return (
    <section className={cn(container, 'col-span-full pr-0', carousel.className)}>
      <SectionTitle title={sectionTitle} className="pb-6 md:pb-8 lg:pb-10" />

      <Swiper
        {...carouselDefaults}
        // A slide is only as wide as its paragraph wants to be: nothing here sets a width of
        // its own, so the counts are tuned to the copy rather than to an image.
        spaceBetween={32}
        slidesPerView={1.5}
        // Raw min-width px, not Tailwind names — Swiper's default `breakpointsBase` is
        // `'window'`, so these are matched against `window.innerWidth` (scrollbar included),
        // not against a media query. They mirror `--breakpoint-smd/md/xlg` so the track steps
        // where the section's own padding and type do.
        breakpoints={{
          480: { slidesPerView: 2.6 },
          768: { spaceBetween: 48, slidesPerView: 3.6 },
          1280: { spaceBetween: 56, slidesPerView: 4.6 },
        }}
        onSwiper={carousel.onSwiper}
      >
        {cards.map((card) => (
          <SwiperSlide key={card.id}>
            <ServiceSlide card={card} />
          </SwiperSlide>
        ))}

        {/* `container-end` renders after the track but still inside Swiper's context, so
            the arrows reach the instance without riding a slide. The section drops its right
            padding to let the track bleed off-screen, so the bar puts it back. */}
        {cards.length > 1 && (
          <div slot="container-end">
            <CarouselNav className="pt-4 pr-6 md:pr-8 xl:pr-12" />
          </div>
        )}
      </Swiper>
    </section>
  )
}
