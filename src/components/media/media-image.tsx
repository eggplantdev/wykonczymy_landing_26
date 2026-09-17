import Image from 'next/image'

import type { MediaImageT } from './types'
import { cn } from '@/lib/cn'

type PropsT = {
  image: MediaImageT
  sizes: string
  priority?: boolean
  className?: string
}

export function MediaImage({ image, sizes, priority, className }: PropsT) {
  return (
    <Image
      fill
      src={image.url}
      alt={image.alt}
      sizes={sizes}
      priority={priority}
      className={cn('object-cover', className)}
    />
  )
}
