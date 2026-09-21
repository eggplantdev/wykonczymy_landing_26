'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { carouselDefaults, useCarousel } from '@/lib/carousel'
import type { ObjectCarouselItemT } from '@/components/object-carousel/types'
import { cn } from '@/lib/cn'
import { ObjectCarouselSlide } from './object-carousel-slide'

type PropsT = {
  container: string
  sectionTitle: string
  items: ObjectCarouselItemT[]
}

// The section that closes a detail page — tdg's `ObjectsSlider`, shared by the interior
// style pages and the project pages.
export function ObjectCarousel({ container, sectionTitle, items }: PropsT) {
  const carousel = useCarousel()

  if (items.length < 1) return null

  return (
    <section className={cn('duration-200', container, carousel.className)}>
      <h2 className="sr-only">{sectionTitle}</h2>
      <Swiper
        {...carouselDefaults}
        spaceBetween={24}
        slidesPerView={1}
        centeredSlides
        onSwiper={carousel.onSwiper}
      >
        {items.map((item, index) => (
          <SwiperSlide key={item.key}>
            <ObjectCarouselSlide item={item} sectionTitle={sectionTitle} isFirst={index === 0} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
