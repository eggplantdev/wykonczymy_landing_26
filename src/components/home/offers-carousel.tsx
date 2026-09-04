'use client'

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { twMerge } from 'tailwind-merge'
import 'swiper/css'

import { SectionTitle } from '@/components/layout/section-title'
import { ButtonLink } from '@/components/ui/button-link'
import { OfferSlide, type OfferSlideT } from './offer-slide'

export type OffersSectionT = {
  sectionTitle?: string
  ctaLabel?: string
  ctaHref: string
  slides: OfferSlideT[]
}

type PropsT = {
  container: string
  data: OffersSectionT
}

export function OffersCarousel({ container, data }: PropsT) {
  const { slides, ctaLabel, ctaHref, sectionTitle } = data
  const [isReady, setIsReady] = useState(false)

  if (slides.length < 1) return null

  return (
    <section className={twMerge(container, !isReady && 'opacity-0')}>
      <div className="gridContainer mb-4 items-center justify-between md:mb-6 xl:mb-10">
        <SectionTitle title={sectionTitle} className="col-span-4 lg:col-span-5 lg:col-start-3" />
        <div className="col-span-3">
          <ButtonLink
            label={ctaLabel}
            href={ctaHref}
            className="ml-auto hidden text-nowrap md:block"
          />
        </div>
      </div>
      <Swiper
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          768: { spaceBetween: 20, slidesPerView: 1.144 },
          1024: { centeredSlides: true, spaceBetween: 22, slidesPerView: 1.5 },
        }}
        onSwiper={() => setIsReady(true)}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.caption}>
            <OfferSlide slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
      <ButtonLink label={ctaLabel} href={ctaHref} className="mx-auto mt-8 md:hidden" />
    </section>
  )
}
