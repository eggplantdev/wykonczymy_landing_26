'use client'

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { twMerge } from 'tailwind-merge'
import 'swiper/css'

import { SectionTitle } from '@/components/layout/section-title'
import type { ServiceCardT } from './service-card'
import { ServiceSlide } from './service-slide'

type PropsT = {
  container: string
  cards: ServiceCardT[]
  sectionTitle: string
}

export function ServicesCarousel({ container, cards, sectionTitle }: PropsT) {
  // Swiper lays the track out on the client, so the first paint is a stack of
  // full-width slides; held hidden until it reports ready.
  const [isReady, setIsReady] = useState(false)

  return (
    <section className={twMerge(container, 'col-span-full pr-0', !isReady && 'opacity-0')}>
      <SectionTitle title={sectionTitle} className="smd:w-full w-1/2 pb-6" />

      <Swiper
        loop
        spaceBetween={16}
        slidesPerView={1.29}
        breakpoints={{ 768: { spaceBetween: 20, slidesPerView: 1.67 } }}
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
