import type { MediaVideoT } from './types'

type PropsT = {
  video: MediaVideoT
}

// `muted` is what makes `autoPlay` legal: browsers block autoplay with sound, so an
// unmuted video would simply never start.
export function MediaVideo({ video }: PropsT) {
  return (
    <video src={video.url} autoPlay loop playsInline muted className="h-full w-full object-cover" />
  )
}
