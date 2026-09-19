import type { MediaImageT } from '@/components/media/types'
import { FadeUp } from '@/components/ui/fade-up'
import { GalleryPair } from './gallery-pair'
import { GallerySingle } from './gallery-single'
import { SectionTitle } from '@/components/ui/section-title'

type PropsT = {
  container: string
  title: string
  images: MediaImageT[]
}

// tdg made every arrangement an authored block; here the photo order alone drives it —
// a pair, a pair, then a single, repeating, so a longer gallery keeps its rhythm without
// anyone laying it out. See AGENTS.md on structure being code's, content the CMS's.
export function ProjectGallery({ container, title, images }: PropsT) {
  if (images.length < 1) return null

  const rows: MediaImageT[][] = []
  for (let index = 0; index < images.length;) {
    const isPair = rows.length % 3 !== 0 && index + 1 < images.length
    rows.push(images.slice(index, index + (isPair ? 2 : 1)))
    index += isPair ? 2 : 1
  }

  return (
    <section className={container}>
      <SectionTitle title={title} className="mb-6 md:mb-8" />

      <div className="grid gap-6 md:gap-4 xl:gap-y-16">
        {rows.map(([large, small], rowIndex) => (
          <FadeUp key={rowIndex}>
            {small ? (
              <GalleryPair large={large} small={small} flipped={rowIndex % 2 === 0} />
            ) : (
              <GallerySingle image={large} index={rowIndex} />
            )}
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
