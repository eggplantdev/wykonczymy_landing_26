import { Media } from '@/components/media/media'
import type { MediaImageT } from '@/components/media/types'

type SinglePropsT = {
  image: MediaImageT
  index: number
}

export function GallerySingle({ image, index }: SinglePropsT) {
  // The first single runs full width; the later ones are inset, alternating sides.
  if (index === 0) {
    return (
      <div className="relative aspect-312/208 overflow-hidden md:aspect-704/395 lg:aspect-1346/757">
        <Media image={image} sizes="(max-width: 1919px) 100vw, 1920px" />
      </div>
    )
  }

  const alignRight = index % 2 === 0

  return (
    <div className="grid grid-cols-6 gap-4 md:grid-cols-8 lg:grid-cols-12">
      <div
        className={`relative col-span-full aspect-312/208 overflow-hidden md:col-span-5 md:aspect-431/287 lg:col-span-8 lg:aspect-890/593 ${
          alignRight ? 'md:col-start-4 lg:col-start-5' : 'col-start-1'
        }`}
      >
        <Media
          image={image}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 62vw, (max-width: 1919px) 67vw, 1286px"
        />
      </div>
    </div>
  )
}
