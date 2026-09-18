'use client'

import { Media } from '@/components/media/media'
import type { MediaImageT } from '@/components/media/types'
import { useTranslation } from '@/lib/i18n/use-translation'
import { useOpenPhoto } from './photo-lightbox'

type PropsT = {
  image: MediaImageT | null
  sizes: string
  priority?: boolean
}

export function PhotoButton({ image, sizes, priority }: PropsT) {
  const openPhoto = useOpenPhoto()
  const { t } = useTranslation('common')

  if (!image) return <Media image={image} sizes={sizes} priority={priority} />

  return (
    <button
      type="button"
      aria-label={t('enlargePhoto')}
      onClick={() => openPhoto(image.url)}
      className="block h-full w-full cursor-zoom-in"
    >
      <Media image={image} sizes={sizes} priority={priority} />
    </button>
  )
}
