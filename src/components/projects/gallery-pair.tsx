import { Media } from '@/components/media/media'
import type { MediaImageT } from '@/components/media/types'

type PairPropsT = {
  large: MediaImageT
  small: MediaImageT
  /** tdg alternates which side the narrow photo takes, so no two pairs read the same. */
  flipped: boolean
}

export function GalleryPair({ large, small, flipped }: PairPropsT) {
  return (
    <div className="grid grid-cols-6 gap-4 md:grid-cols-8 lg:grid-cols-12">
      <div
        className={`relative col-span-full aspect-312/208 overflow-hidden md:aspect-704/468 lg:aspect-888/592 ${
          flipped ? 'lg:col-span-8' : 'lg:order-2 lg:col-span-8 lg:col-start-5'
        }`}
      >
        <Media image={large} sizes="(max-width: 1023px) 100vw, (max-width: 2047px) 67vw, 1372px" />
      </div>
      <div
        className={`relative col-span-6 aspect-312/436 overflow-hidden md:col-span-5 md:aspect-495/432 lg:col-span-4 lg:aspect-493/430 ${
          flipped ? '' : 'md:col-start-4 lg:col-start-1'
        }`}
      >
        <Media
          image={small}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 62vw, (max-width: 2047px) 33vw, 676px"
        />
      </div>
    </div>
  )
}
