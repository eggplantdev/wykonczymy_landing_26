import { Media } from '@/components/media/media'
import { cn } from '@/lib/cn'
import type { InteriorStyleT } from '@/lib/content/interior-styles'

type PropsT = {
  style: InteriorStyleT
  // The two callers frame the same card differently: the carousel slide is a fixed height,
  // the listing cell goes fluid and takes an aspect ratio once the grid reaches three columns.
  imageClassName: string
  // The copy follows the frame, so the clamp and its reserved height belong to the caller too:
  // a fixed-height slide can only afford two lines, the wider listing cell shows five.
  textClassName: string
  sizes: string
}

export function StyleCardBody({ style, imageClassName, textClassName, sizes }: PropsT) {
  const { title, text, image } = style

  return (
    <>
      {/* Both blocks keep a reserved height so every photo in a row starts at the same y,
          whatever the copy runs to. */}
      <header className="text-14 md:text-18 xlg:text-20 leading-120 xlg:h-12 mb-3 line-clamp-2 h-8.5 font-medium md:h-11">
        {title}
      </header>
      <div className={cn('text-12 mb-5 md:mb-6', textClassName)}>{text}</div>
      <div className={cn('relative overflow-hidden', imageClassName)}>
        {/* The scale rides on the photo rather than on the clip box, which would be scaled
            along with its element and grow the frame instead of pushing the photo against it. */}
        <Media
          image={image}
          sizes={sizes}
          className="delay-100 duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 delay-100 duration-1000 group-hover:bg-black/20" />
      </div>
    </>
  )
}
