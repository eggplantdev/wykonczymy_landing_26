import type { MediaVideoT } from './types'
import { cn } from '@/lib/cn'

type PropsT = {
  video: MediaVideoT
  className?: string
}

// `muted` is what makes `autoPlay` legal: browsers block autoplay with sound, so an
// unmuted video would simply never start.
export function MediaVideo({ video, className }: PropsT) {
  return (
    <video
      src={video.url}
      autoPlay
      loop
      playsInline
      muted
      className={cn('h-full w-full object-cover', className)}
    />
  )
}
