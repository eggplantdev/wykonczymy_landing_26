'use client'

import { useRef, useState } from 'react'
import type { Swiper as SwiperT } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { carouselDefaults, useCarouselReady } from '@/lib/carousel'
import { SectionTitle } from '@/components/ui/section-title'
import { CarouselNav } from '@/components/ui/carousel-nav'
import { RatingBadge, type RatingT } from '@/components/ui/rating-badge'
import { cn } from '@/lib/cn'
import { TestimonialSlide, type TestimonialT } from './testimonial-slide'

export type TestimonialsSectionT = {
  sectionTitle?: string
  quotes: TestimonialT[]
}

type PropsT = {
  container: string
  data: TestimonialsSectionT
  ratings: RatingT[]
}

export function TestimonialsCarousel({ container, data, ratings }: PropsT) {
  const { sectionTitle, quotes } = data
  const carousel = useCarouselReady()
  const swiper = useRef<SwiperT>(null)
  const [current, setCurrent] = useState(1)

  // Expansion is the track's business, not a slide's: Swiper stretches every slide to the
  // tallest one, so a quote left open keeps the whole section tall after you move past it.
  // Only one can be open, and moving to another slide closes it.
  const [expandedId, setExpandedId] = useState<string>()

  // Autoplay would pull a long review away mid-sentence, so reading pauses the rotation.
  const toggle = (id: string) => {
    const next = expandedId === id ? undefined : id
    setExpandedId(next)
    if (next) swiper.current?.autoplay.stop()
    else swiper.current?.autoplay.start()
  }

  if (quotes.length < 1) return null

  return (
    <section className={cn(container, carousel.className)}>
      <div className="gridContainer">
        <SectionTitle
          title={sectionTitle}
          className="col-span-full -mt-1.5 pb-6 md:pb-8 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-start lg:pb-0"
        />

        <div className="col-span-full lg:col-span-7 lg:col-start-6 lg:row-start-1">
          <Swiper
            {...carouselDefaults}
            spaceBetween={24}
            slidesPerView={1}
            onSwiper={(instance) => {
              swiper.current = instance
              carousel.onSwiper()
            }}
            // `slideChange` also fires without the visitor moving: expanding a quote
            // re-renders the track, and Swiper's loop fix shifts `activeIndex` to emit it.
            // Keying off `realIndex` tells a real move from that bookkeeping — otherwise
            // opening a quote closes it again in the same tick.
            onSlideChange={(instance) => {
              const next = instance.realIndex + 1
              if (next === current) return

              setCurrent(next)
              if (!expandedId) return
              setExpandedId(undefined)
              instance.autoplay.start()
            }}
          >
            {quotes.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialSlide
                  testimonial={testimonial}
                  isExpanded={expandedId === testimonial.id}
                  onToggle={() => toggle(testimonial.id)}
                />
              </SwiperSlide>
            ))}

            {/* `container-end` renders after the track but still inside Swiper's context, so
                the arrows reach the instance without riding a slide. */}
            {quotes.length > 1 && (
              <div slot="container-end">
                <CarouselNav current={current} total={quotes.length} className="pt-4" />
              </div>
            )}
          </Swiper>
        </div>

        {ratings.length > 0 && (
          // From `lg` the badges sit in the title's row, pinned to its bottom so they land on
          // the same line as the carousel controls; below that they stack underneath. They run
          // to column 5 — the title's four are too narrow for two badges side by side, and the
          // carousel only starts at column 6.
          <ul className="col-span-full flex flex-col flex-wrap gap-y-3 pt-4 md:flex-row md:gap-x-12 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-end lg:pt-0">
            {ratings.map((rating) => (
              <li key={rating.platform}>
                <RatingBadge data={rating} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
