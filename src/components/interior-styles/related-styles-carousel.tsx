'use client'

import { useState } from 'react'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { twMerge } from 'tailwind-merge'
import 'swiper/css'

import { RelatedStyleSlide } from './related-style-slide'
import type { InteriorStyleT } from './types'

type PropsT = {
  sectionTitle: string
  basePath: string
  styles: InteriorStyleT[]
}

export function RelatedStylesCarousel({ sectionTitle, basePath, styles }: PropsT) {
  // Swiper lays the track out on the client, so the first paint is a stack of
  // full-width slides; held hidden until it reports ready.
  const [isReady, setIsReady] = useState(false)

  if (styles.length < 1) return null

  return (
    <section className={twMerge('lg:pt-30 pt-16 duration-200 md:pt-20', !isReady && 'opacity-0')}>
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
        {styles.map((style) => (
          <SwiperSlide key={style.slug}>
            <RelatedStyleSlide
              style={style}
              href={`${basePath}${style.slug}/`}
              sectionTitle={sectionTitle}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
