import { MediaImage } from './media-image'
import { MediaPlaceholder } from './media-placeholder'
import { MediaVideo } from './media-video'
import type { MediaImageT, MediaVideoT } from './types'

type PropsT = {
  image?: MediaImageT | null
  video?: MediaVideoT | null
  sizes: string
  priority?: boolean
  placeholderType?: 'light' | 'dark' | 'default'
  placeholderClassName?: string
  className?: string
}

// Video wins when both are set, matching tdg.
export function Media({
  image,
  video,
  sizes,
  priority,
  placeholderType,
  placeholderClassName,
  className,
}: PropsT) {
  return (
    <MediaPlaceholder type={placeholderType} className={placeholderClassName}>
      {video ? (
        <MediaVideo video={video} />
      ) : (
        image && (
          <MediaImage image={image} sizes={sizes} priority={priority} className={className} />
        )
      )}
    </MediaPlaceholder>
  )
}
