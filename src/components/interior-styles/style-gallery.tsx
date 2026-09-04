'use client'

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { twMerge } from 'tailwind-merge'
import 'swiper/css'

import { carouselDefaults } from '@/lib/carousel'
import { Media } from '@/components/media/media'
import type { MediaImageT } from '@/components/media/types'

type PropsT = {
  title: string
  images: MediaImageT[]
}

export function StyleGallery({ title, images }: PropsT) {
  // Swiper lays the track out on the client, so the first paint is a stack of
  // full-width slides; held hidden until it reports ready.
  const [isReady, setIsReady] = useState(false)

  if (images.length < 1) return null

  return (
    <section className={twMerge('paddings pt-16 md:pt-20 lg:pt-30', !isReady && 'opacity-0')}>
      <h2 className="text-22 md:text-28 lg:text-36 mb-6 font-medium md:mb-8">{title}</h2>

      <Swiper
        {...carouselDefaults}
        spaceBetween={16}
        slidesPerView={1.15}
        breakpoints={{
          768: { spaceBetween: 20, slidesPerView: 2.2 },
          1024: { spaceBetween: 20, slidesPerView: 3 },
        }}
        onSwiper={() => setIsReady(true)}
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
