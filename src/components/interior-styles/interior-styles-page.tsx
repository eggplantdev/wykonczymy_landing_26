import { PageWrapper } from '@/components/layout/page-wrapper'
import { StyleCard } from './style-card'
import type { InteriorStyleT } from './types'

export type InteriorStylesPageDataT = {
  styles: InteriorStyleT[]
}

type PropsT = {
  // The heading is the page document's own localized title, not part of the field group.
  title: string
  // This page's own address; each style hangs off it as `<basePath><slug>/`.
  basePath: string
  data: InteriorStylesPageDataT
}

export function InteriorStylesPage({ title, basePath, data }: PropsT) {
  const { styles } = data

  return (
    <PageWrapper hasHero={false}>
      <section className="paddings md:mb-30 mb-20 xl:px-55">
        <h1 className="text-32 md:text-40 lg:text-58 mb-12 text-center md:mb-24 lg:mb-20">
          {title}
        </h1>
        <div className="divide-grau_300 grid grid-cols-1 gap-y-8 divide-y md:grid-cols-2 md:gap-y-12 md:divide-y-0 lg:grid-cols-3 lg:gap-y-15">
          {styles.map((style, index) => (
            <StyleCard
              key={style.id}
              style={style}
              href={`${basePath}${style.slug}/`}
              index={index}
            />
          ))}
        </div>
      </section>
    </PageWrapper>
  )
}
