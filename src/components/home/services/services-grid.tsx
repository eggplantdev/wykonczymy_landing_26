import { twMerge } from 'tailwind-merge'

import { SectionTitle } from '@/components/layout/section-title'
import { ServiceCard, type ServiceCardT } from './service-card'

type PropsT = {
  container: string
  cards: ServiceCardT[]
  sectionTitle: string
}

export function ServicesGrid({ container, cards, sectionTitle }: PropsT) {
  return (
    <section className={twMerge(container, 'hidden lg:block')}>
      <SectionTitle title={sectionTitle} className="pb-10" />
      <div className="grid grid-cols-3 gap-x-6">
        {cards.map((card) => (
          <ServiceCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  )
}
