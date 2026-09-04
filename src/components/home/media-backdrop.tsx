import { Media } from '@/components/media/media'
import type { MediaImageT, MediaVideoT } from '@/components/media/types'

type PropsT = {
  image?: MediaImageT | null
  video?: MediaVideoT | null
  priority?: boolean
}

// Full-bleed media behind a centred headline — the hero and the featured project are the
// same layout at different heights.
export function MediaBackdrop({ image, video, priority }: PropsT) {
  return (
    <div className="absolute inset-0 flex">
      <Media image={image} video={video} priority={priority} sizes="100vw" />
    </div>
  )
}
