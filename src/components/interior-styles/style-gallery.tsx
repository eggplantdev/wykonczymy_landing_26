import type { MediaImageT } from '@/components/media/types'
import { SectionTitle } from '@/components/layout/section-title'
import { cn } from '@/lib/cn'
import { PhotoButton } from '@/components/lightbox/photo-button'

type PropsT = {
  title: string
  images: MediaImageT[]
}

// `paddings` is px-6 / md:px-8 / xl:px-12, and the gutters come off the columns too. Move the
// column count or the gap without moving these and nothing breaks at build time — the browser
// just fetches the wrong resolution.
const sizes =
  '(max-width: 767px) calc(50vw - 2rem), (max-width: 1023px) calc(50vw - 2.5rem), (max-width: 1439px) calc(25vw - 1.94rem), calc(25vw - 2.44rem)'
const wideSizes =
  '(max-width: 767px) calc(100vw - 3rem), (max-width: 1023px) calc(100vw - 4rem), (max-width: 1439px) calc(50vw - 2.63rem), (max-width: 1919px) calc(50vw - 3.63rem), 902px'

// The photo sets are not one orientation: `modern` is twelve 2:1 shots, `klasyczny` six 3:4
// ones, `industrialny` all square. A single cell shape means one of those loses most of its
// frame, so the wide shots take two cells and come out close to their native proportions.
const isWide = (image: MediaImageT) =>
  Boolean(image.width && image.height && image.width / image.height >= 1.2)

// Four columns rather than three because two wide tiles then fill a row exactly; on three, a
// set that is all landscape would leave a hole in every row.
export function StyleGallery({ title, images }: PropsT) {
  if (images.length < 1) return null

  return (
    <section className="paddings pt-20 md:pt-24 xl:pt-40">
      <SectionTitle title={title} className="mb-6 md:mb-8" />

      <div className="grid grid-flow-row-dense grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        {images.map((image, index) => {
          const wide = isWide(image)

          return (
            <div
              key={index}
              className={cn(
                'relative overflow-hidden',
                wide ? 'col-span-2 aspect-2/1' : 'aspect-square',
              )}
            >
              <PhotoButton image={image} sizes={wide ? wideSizes : sizes} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
