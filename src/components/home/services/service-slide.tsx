'use client'

import Link from 'next/link'
import { useSwiperSlide } from 'swiper/react'
import { twMerge } from 'tailwind-merge'

import { Media } from '@/components/media/media'
import { Arrow } from '@/components/ui/icons/arrow'
import type { ServiceCardT } from './service-card'

type PropsT = {
  card: ServiceCardT
}

// The carousel counterpart of ServiceCard: the tint follows the active slide instead of
// hover, and the copy sits on a tighter type scale.
export function ServiceSlide({ card }: PropsT) {
  const { tint, label, title, text, href, image, video } = card
  const swiperSlide = useSwiperSlide()
  const isActive = swiperSlide?.isActive

  return (
    <Link href={href}>
      <div
        className={twMerge(
          'shrink-0 px-4 pt-3 pb-4 delay-100 duration-300 md:pb-6',
          isActive && tint === 'slate' && 'bg-living_800',
          isActive && tint === 'blue' && 'bg-finance_800',
          isActive && tint === 'green' && 'bg-optimum_800',
        )}
      >
        <div className="relative aspect-[233/156] md:aspect-[400/381]">
          <Media
            image={image}
            video={video}
            sizes="(max-width: 767px) 75vw, (max-width: 1023px) 52vw, (max-width: 1919px) 33vw, 560px"
          />
        </div>
        <div className="border-b-shwarz flex h-6.5 items-center justify-between border-b md:h-10">
          <span className="text-12 md:text-14">{label}</span>
          <div className="h-2.5">
            <Arrow color="#1B1B1B" />
          </div>
        </div>

        <header className="text-18 md:text-20 mb-3 line-clamp-1 pt-4 font-medium md:mb-4 md:pt-8">
          {title}
        </header>
        <div className="text-12 md:text-14 md:leading-130 line-clamp-7 h-[6.125rem] overflow-hidden md:h-[5.625rem]">
          {text}
        </div>
      </div>
    </Link>
  )
}
