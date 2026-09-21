import { PageWrapper } from '@/components/layout/page-wrapper'
import { FadeUp } from '@/components/ui/fade-up'
import { StyleCard } from './style-card'
import type { InteriorStyleT } from '@/lib/content/interior-styles'
import { childPath } from '@/lib/routing'

export type InteriorStylesPageDataT = {
  styles: InteriorStyleT[]
}

type PropsT = {
  // The heading is the page document's own localized title, not part of the field group.
  title: string
  basePath: string
  data: InteriorStylesPageDataT
}

export function InteriorStylesPage({ title, basePath, data }: PropsT) {
  const { styles } = data

  return (
    <PageWrapper hasHero={false} title={title}>
      <section className="mb-20 paddings md:mb-30 xl:px-55">
        <div className="grid grid-cols-1 gap-y-8 divide-y divide-border md:grid-cols-2 md:gap-y-12 md:divide-y-0 lg:grid-cols-3 lg:gap-y-15">
          {styles.map((style, index) => (
            <FadeUp key={style.id}>
              <StyleCard style={style} href={childPath(basePath, style.slug)} index={index} />
            </FadeUp>
          ))}
        </div>
      </section>
    </PageWrapper>
  )
}
