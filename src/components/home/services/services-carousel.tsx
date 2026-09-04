'use client'

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { twMerge } from 'tailwind-merge'
import 'swiper/css'

import { SectionTitle } from '@/components/layout/section-title'
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
  // Swiper lays the track out on the client, so the first paint is a stack of
  // full-width slides; held hidden until it reports ready.
  const [isReady, setIsReady] = useState(false)

  if (cards.length < 1) return null

  return (
    <section className={twMerge(container, 'col-span-full pr-0', !isReady && 'opacity-0')}>
      <SectionTitle title={sectionTitle} className="smd:w-full w-1/2 pb-6 md:pb-8 lg:pb-10" />

      <Swiper
        loop
        spaceBetween={16}
        slidesPerView={1.29}
        breakpoints={{
          768: { spaceBetween: 20, slidesPerView: 1.67 },
          1024: { spaceBetween: 22, slidesPerView: 2.2 },
          1280: { spaceBetween: 24, slidesPerView: 2.5 },
        }}
        onSwiper={() => setIsReady(true)}
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
