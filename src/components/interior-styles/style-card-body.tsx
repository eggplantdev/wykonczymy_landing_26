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
  preload?: boolean
}

export function StyleCardBody({ style, imageClassName, textClassName, sizes, preload }: PropsT) {
  const { title, text, image } = style

  return (
    <>
      {/* Both blocks keep a reserved height so every photo in a row starts at the same y,
          whatever the copy runs to. Reserved in `lh` — one unit is this element's own
          `font-size` x `line-height` — so the box tracks the type scale instead of being a
          pixel constant re-derived by hand at every breakpoint. The last time the title moved
          one step the md tier landed at exactly its box height, with no slack for a descender. */}
      <header className="mb-3 line-clamp-2 min-h-[2lh] text-18 leading-120 font-medium md:text-20 xlg:text-22">
        {title}
      </header>
      <div className={cn('mb-5 text-14 md:mb-6', textClassName)}>{text}</div>
      <div className={cn('relative overflow-hidden', imageClassName)}>
        <Media image={image} sizes={sizes} preload={preload} className="hover-photo" />
        <PhotoHover />
      </div>
    </>
  )
}
