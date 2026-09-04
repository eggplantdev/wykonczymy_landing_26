'use client'

import { useState } from 'react'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { twMerge } from 'tailwind-merge'
import 'swiper/css'

import type { ObjectCarouselItemT } from '@/types/object-carousel'
import { ObjectCarouselSlide } from './object-carousel-slide'

type PropsT = {
  container: string
  sectionTitle: string
  items: ObjectCarouselItemT[]
}

// The section that closes a detail page — tdg's `ObjectsSlider`, shared by the interior
// style pages and the project pages.
export function ObjectCarousel({ container, sectionTitle, items }: PropsT) {
  // Swiper lays the track out on the client, so the first paint is a stack of
  // full-width slides; held hidden until it reports ready.
  const [isReady, setIsReady] = useState(false)

  if (items.length < 1) return null

  return (
    <section className={twMerge('duration-200', container, !isReady && 'opacity-0')}>
      <Swiper
        modules={[Autoplay]}
        loop
        autoplay={{ delay: 5000 }}
        speed={200}
        spaceBetween={24}
        slidesPerView={1}
        centeredSlides
        onSwiper={() => setIsReady(true)}
      >
        {items.map((item) => (
          <SwiperSlide key={item.key}>
            <ObjectCarouselSlide item={item} sectionTitle={sectionTitle} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
