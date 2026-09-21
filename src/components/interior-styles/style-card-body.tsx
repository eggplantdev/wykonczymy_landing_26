import { Media } from '@/components/media/media'
import { PhotoHover } from '@/components/ui/photo-hover'
import { cn } from '@/lib/cn'
import type { InteriorStyleT } from '@/lib/content/interior-styles'

type PropsT = {
  style: InteriorStyleT
  // The two callers frame the same card differently: the carousel slide is a fixed height,
  // the listing cell goes fluid and takes an aspect ratio once the grid reaches three columns.
  imageClassName: string
  // The copy follows the frame, so the clamp and its reserved height belong to the caller too:
  // a fixed-height slide can only afford three lines, the wider listing cell shows five.
  textClassName: string
  sizes: string
}

export function StyleCardBody({ style, imageClassName, textClassName, sizes }: PropsT) {
  const { title, text, image } = style

  return (
    <>
      {/* Both blocks keep a reserved height so every photo in a row starts at the same y,
          whatever the copy runs to. */}
      <header className="text-18 md:text-20 xlg:text-22 leading-120 xlg:h-13.5 mb-3 line-clamp-2 h-11 font-medium md:h-12.5">
        {title}
      </header>
      <div className={cn('text-12 mb-5 md:mb-6', textClassName)}>{text}</div>
      <div className={cn('relative overflow-hidden', imageClassName)}>
        <Media image={image} sizes={sizes} className="hover-photo" />
        <PhotoHover />
      </div>
    </>
  )
}
