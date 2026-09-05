'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { twMerge } from 'tailwind-merge'
import 'swiper/css'

import { carouselDefaults, useCarouselReady } from '@/lib/carousel'
import { Media } from '@/components/media/media'
import type { MediaImageT } from '@/components/media/types'
import { SectionTitle } from '@/components/layout/section-title'

type PropsT = {
  title: string
  images: MediaImageT[]
}

export function StyleGallery({ title, images }: PropsT) {
  const carousel = useCarouselReady()

  if (images.length < 1) return null

  return (
    <section className={twMerge('paddings pt-16 md:pt-20 lg:pt-30', carousel.className)}>
      <SectionTitle title={title} className="mb-6 md:mb-8" />

      <Swiper
        {...carouselDefaults}
        spaceBetween={16}
        slidesPerView={1.15}
        breakpoints={{
          768: { spaceBetween: 20, slidesPerView: 2.2 },
          1024: { spaceBetween: 20, slidesPerView: 3 },
        }}
        onSwiper={carousel.onSwiper}
      >
        {images.map((image) => (
          <SwiperSlide key={image.url}>
            <div className="relative aspect-4/3 overflow-hidden">
              <Media
                image={image}
                sizes="(max-width: 767px) 87vw, (max-width: 1023px) 45vw, 33vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
