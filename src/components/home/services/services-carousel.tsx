'use client'

import { useState } from 'react'
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
  const [current, setCurrent] = useState(1)

  if (cards.length < 1) return null

  return (
    <section className={cn(container, 'col-span-full pr-0', carousel.className)}>
      <SectionTitle title={sectionTitle} className="smd:w-full w-1/2 pb-6 md:pb-8 lg:pb-10" />

      <Swiper
        {...carouselDefaults}
        spaceBetween={16}
        slidesPerView={1.29}
        breakpoints={{
          768: { spaceBetween: 20, slidesPerView: 1.67 },
          1024: { spaceBetween: 22, slidesPerView: 2.2 },
          1280: { spaceBetween: 24, slidesPerView: 2.5 },
        }}
        onSwiper={carousel.onSwiper}
        onSlideChange={(instance) => setCurrent(instance.realIndex + 1)}
      >
        {cards.map((card) => (
          <SwiperSlide key={card.title}>
            <ServiceSlide card={card} />
          </SwiperSlide>
        ))}

        {/* `container-end` renders after the track but still inside Swiper's context, so
            the arrows reach the instance without riding a slide. The section drops its right
            padding to let the track bleed off-screen, so the bar puts it back. */}
        {cards.length > 1 && (
          <div slot="container-end">
            <CarouselNav
              current={current}
              total={cards.length}
              className="pt-8 pr-6 md:pt-10 md:pr-8 xl:pr-12"
            />
          </div>
        )}
      </Swiper>
    </section>
  )
}
