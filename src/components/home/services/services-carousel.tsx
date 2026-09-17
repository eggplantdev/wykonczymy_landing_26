'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { carouselDefaults, useCarouselReady } from '@/lib/carousel'
import { SectionTitle } from '@/components/layout/section-title'
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
      >
        {cards.map((card) => (
          <SwiperSlide key={card.title}>
            <ServiceSlide card={card} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
