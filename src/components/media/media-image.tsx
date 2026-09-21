import Image from 'next/image'

import type { MediaImageT } from './types'
import { cn } from '@/lib/cn'

type PropsT = {
  image: MediaImageT
  sizes: string
  preload?: boolean
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
  className?: string
}

export function MediaImage({ image, sizes, preload, loading, fetchPriority, className }: PropsT) {
  return (
    <Image
      fill
      src={image.url}
      alt={image.alt}
      sizes={sizes}
      preload={preload}
      loading={loading}
      fetchPriority={fetchPriority}
      // Every source photo is already a lossy WebP, so Next's default 75 re-encodes a
      // re-encode and smears the smooth walls and soft daylight this material is mostly
      // made of. 90 lands back at roughly the original file's weight. Allowed values are
      // pinned in `next.config.ts`.
      quality={90}
      className={cn('object-cover', className)}
      style={
        image.focalPoint && {
          objectPosition: `${image.focalPoint.x}% ${image.focalPoint.y}%`,
        }
      }
    />
  )
}
