import { SectionTitle } from '@/components/layout/section-title'
import { NumberCard, type NumberCardT } from './number-card'

export type NumbersSectionT = {
  sectionTitle?: string
  cards: NumberCardT[]
}

type PropsT = {
  container: string
  data: NumbersSectionT
}

export function NumbersSection({ container, data }: PropsT) {
  const { sectionTitle, cards } = data
  if (cards.length < 1) return null

  return (
    <section className={container}>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <SectionTitle title={sectionTitle} className="xlg:col-span-6 pr-4 md:pr-5 lg:col-span-4" />
        <ul className="xlg:col-span-6 grid pr-4 md:grid-cols-2 md:pr-5 lg:col-span-8">
          {cards.map((card) => (
            <NumberCard key={card.id} card={card} />
          ))}
        </ul>
      </div>
    </section>
  )
}
