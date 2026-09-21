'use client'

import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as RadixDialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { useState } from 'react'
import { Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import type { MediaImageT } from '@/components/media/types'
import { CarouselArrow } from '@/components/ui/carousel-arrow'
import { CarouselCounter } from '@/components/ui/carousel-counter'
import { useTranslation } from '@/lib/i18n/use-translation'
import '@/lib/fontawesome'

type PropsT = {
  images: MediaImageT[]
  initialIndex: number
  onClose: () => void
}

// The slide is padded and the photo is only contained inside it, so its drawn width is
// decided by its own proportions and the viewport's height — nothing a media query can
// state. The upper bound is what this declares; the optimizer never serves past the
// source's own width anyway.
const sizes = '(max-width: 767px) 100vw, 90vw'

export function PhotoLightboxDialog({ images, initialIndex, onClose }: PropsT) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const { t } = useTranslation('common')
  const isAlone = images.length < 2

  return (
    <RadixDialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <RadixDialog.Portal>
        {/* Radix mounts the scroll lock on the overlay, so it is required even though the
            content paints over all of it. */}
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-card" />

        <RadixDialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col bg-card outline-hidden"
        >
          <RadixDialog.Title className="sr-only">{t('gallery')}</RadixDialog.Title>

          <RadixDialog.Close
            aria-label={t('close')}
            className="absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-md bg-card hover:bg-muted md:top-6 md:right-6"
          >
            <FontAwesomeIcon icon={faXmark} className="size-3.5" />
          </RadixDialog.Close>

          <Swiper
            modules={[Keyboard]}
            className="size-full"
            slidesPerView={1}
            initialSlide={initialIndex}
            loop={!isAlone}
            speed={200}
            grabCursor
            keyboard={{ enabled: true }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="px-6 pt-16 pb-24 md:px-10">
                <div className="relative size-full">
                  {/* `Media` crops to the focal point, exactly wrong here: this is the one
                      place the photo is shown whole, portrait or landscape alike. */}
                  <Image
                    fill
                    src={image.url}
                    alt={image.alt}
                    sizes={sizes}
                    quality={90}
                    className="object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}

            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-6 pb-6 text-14 *:leading-140 md:px-10 md:text-16">
              <CarouselCounter current={activeIndex + 1} total={images.length} />
              <div className="flex gap-x-1.5">
                <CarouselArrow direction="left" disabled={isAlone} />
                <CarouselArrow direction="right" disabled={isAlone} />
              </div>
            </div>
          </Swiper>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
