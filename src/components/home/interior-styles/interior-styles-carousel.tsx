'use client'

import { useState } from 'react'
import { Autoplay, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { twMerge } from 'tailwind-merge'
import 'swiper/css'

import type { InteriorStyleT } from '@/components/interior-styles/types'
import { SectionTitle } from '@/components/layout/section-title'
import { ButtonLink } from '@/components/ui/button-link'
import { InteriorStyleSlide } from './interior-style-slide'

export type InteriorStylesSectionT = {
  sectionTitle: string
  ctaLabel: string
  ctaHref: string
  styles: InteriorStyleT[]
}

type PropsT = {
  container: string
  data: InteriorStylesSectionT
}

export function InteriorStylesCarousel({ container, data }: PropsT) {
  const { sectionTitle, ctaLabel, ctaHref, styles } = data
  // Swiper lays the track out on the client, so the first paint is a stack of
  // full-width slides; held hidden until it reports ready.
  const [isReady, setIsReady] = useState(false)

  if (styles.length < 1) return null

  return (
    <section className={twMerge(container, !isReady && 'opacity-0')}>
      <SectionTitle title={sectionTitle} className="pb-6 md:pb-8 lg:pb-10" />
      <Swiper
        loop
        modules={[Autoplay, Keyboard]}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        speed={200}
        grabCursor
        keyboard={{ enabled: true }}
        slidesPerView="auto"
        className="xlg:mb-10 mb-8"
        onSwiper={() => setIsReady(true)}
      >
        {/* Every card goes to the listing page: the styles have no addresses of their own. */}
        {styles.map((style) => (
          <SwiperSlide key={style.id} className="w-auto!">
            <InteriorStyleSlide style={style} href={ctaHref} />
          </SwiperSlide>
        ))}
      </Swiper>
      <ButtonLink label={ctaLabel} href={ctaHref} className="mx-auto" />
    </section>
  )
}
