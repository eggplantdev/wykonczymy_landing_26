import { MediaImage } from './media-image'
import { MediaPlaceholder } from './media-placeholder'
import { MediaVideo } from './media-video'
import type { MediaImageT, MediaVideoT } from './types'

type PropsT = {
  image?: MediaImageT | null
  video?: MediaVideoT | null
  sizes: string
  preload?: boolean
  placeholderType?: 'light' | 'dark' | 'default'
  placeholderClassName?: string
  className?: string
}

export function Media({
  image,
  video,
  sizes,
  preload,
  placeholderType,
  placeholderClassName,
  className,
}: PropsT) {
  return (
    <MediaPlaceholder type={placeholderType} className={placeholderClassName}>
      {video ? (
        <MediaVideo video={video} className={className} />
      ) : (
        image && <MediaImage image={image} sizes={sizes} preload={preload} className={className} />
      )}
    </MediaPlaceholder>
  )
}
