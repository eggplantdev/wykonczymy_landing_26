import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import type { MediaImageT } from './types'

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
      className={twMerge('object-cover', className)}
    />
  )
}
