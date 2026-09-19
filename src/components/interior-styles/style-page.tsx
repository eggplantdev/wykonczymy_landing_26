import { PageWrapper } from '@/components/layout/page-wrapper'
import { getTranslations, type Locale } from '@/lib/i18n/i18n'
import { ObjectCarousel } from '@/components/object-carousel/object-carousel'
import { PhotoButton } from '@/components/lightbox/photo-button'
import { PhotoLightbox } from '@/components/lightbox/photo-lightbox'
import { StyleGallery } from './style-gallery'
import { FadeUp } from '@/components/ui/fade-up'
import type { InteriorStyleT } from '@/lib/content/interior-styles'
import { childPath } from '@/lib/routing'

type PropsT = {
  locale: Locale
  style: InteriorStyleT
  basePath: string
  related: InteriorStyleT[]
}

// tdg splits this template into a mobile/tablet tree and a desktop one, which ships the
// article twice and downloads both images twice; one tree serves both here.
export function StylePage({ locale, style, basePath, related }: PropsT) {
  const { common } = getTranslations(locale)
  const { title, body, image, contentImage, gallery } = style
  const [lead, ...rest] = body
  const split = Math.ceil(rest.length / 2)
  // The hero and the mid-article image fall back to the first gallery shots when unset, so
  // the same photo can reach the lightbox twice; it belongs in the strip once.
  const photos = [
    ...new Map(
      [image, contentImage, ...gallery]
        .filter((photo) => photo !== null)
        .map((photo) => [photo.url, photo]),
    ).values(),
  ]

  return (
    <PageWrapper hasHero={false} title={title}>
      <PhotoLightbox images={photos}>
        <article className="gridContainer paddings">
          <div className="relative col-span-full mb-8 h-80 overflow-hidden md:mb-12 md:h-88 lg:col-span-10 lg:col-start-2 xl:h-140">
            <PhotoButton
              image={image}
              priority
              sizes="(max-width: 1023px) 100vw, (max-width: 2399px) 80vw, 1920px"
            />
          </div>

          {/* The column is one reading unit, so it rises as one: splitting the prose would pop the
              second half while it is already being read. The hero above stays still, as on a
              project page — an entrance on something already in view reads as a load glitch. */}
          <FadeUp className="text-14 lg:text-16 col-span-full md:col-span-6 md:col-start-2 lg:col-span-6 lg:col-start-4 lg:row-start-2">
            <p className="border-b-border border-b pb-8 font-medium">{lead}</p>
            {rest.slice(0, split).map((paragraph, index) => (
              <p key={index} className="pt-8">
                {paragraph}
              </p>
            ))}

            <div className="relative mt-10 aspect-312/238 overflow-hidden md:mt-8 md:aspect-523/342 lg:mt-12 lg:aspect-661/432">
              <PhotoButton
                image={contentImage}
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 72vw, (max-width: 2399px) 48vw, 1152px"
              />
            </div>

            {rest.slice(split).map((paragraph, index) => (
              <p key={index} className="pt-8">
                {paragraph}
              </p>
            ))}
          </FadeUp>
        </article>

        <StyleGallery title={common.gallery} images={gallery} />
      </PhotoLightbox>

      <ObjectCarousel
        container="pt-20 md:pt-24 xl:pt-40"
        sectionTitle={common.moreInteriorStyles}
        items={related.map((item) => ({
          key: item.slug,
          href: childPath(basePath, item.slug),
          title: item.title,
          text: item.text,
          image: item.image,
        }))}
      />
    </PageWrapper>
  )
}
