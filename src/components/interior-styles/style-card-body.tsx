import { twMerge } from 'tailwind-merge'

import { Media } from '@/components/media/media'
import type { InteriorStyleT } from './types'

type PropsT = {
  style: InteriorStyleT
  // The two callers frame the same card differently: the carousel slide is a fixed height,
  // the listing cell goes fluid and takes an aspect ratio once the grid reaches three columns.
  imageClassName: string
  sizes: string
}

export function StyleCardBody({ style, imageClassName, sizes }: PropsT) {
  const { title, text, image } = style

  return (
    <>
      <header className="text-14 md:text-18 xlg:text-20 leading-120 xlg:h-12 mb-3 line-clamp-2 h-8.5 font-medium md:h-11">
        {title}
      </header>
      <div className="text-12 md:leading-135 xlg:line-clamp-4 xlg:h-16 mb-5 line-clamp-5 h-[4.375rem] md:mb-6 md:h-20">
        {text}
      </div>
      <div className={twMerge('relative overflow-hidden', imageClassName)}>
        <Media image={image} sizes={sizes} />
        <div className="absolute inset-0 delay-100 duration-1000 group-hover:bg-black/20" />
      </div>
    </>
  )
}
