import { SectionTitle } from '@/components/ui/section-title'
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
        <SectionTitle title={sectionTitle} className="pr-4 md:pr-5 lg:col-span-4 xlg:col-span-6" />
        <ul className="grid pr-4 md:grid-cols-2 md:pr-5 lg:col-span-8 xlg:col-span-6">
          {cards.map((card) => (
            <NumberCard key={card.id} card={card} />
          ))}
        </ul>
      </div>
    </section>
  )
}
