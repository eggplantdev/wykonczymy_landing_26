import type { ServiceCardT } from './service-card'
import { ServicesCarousel } from './services-carousel'
import { ServicesGrid } from './services-grid'

export type ServicesSectionT = {
  sectionTitle: string
  cards: ServiceCardT[]
}

type PropsT = {
  container: string
  data: ServicesSectionT
}

// Grid and carousel are separate trees rather than one responsive component: below lg the
// cards have to be swipeable, and Swiper cannot be turned off by a media query.
export function ServicesSection({ container, data }: PropsT) {
  const { sectionTitle, cards } = data
  if (cards.length < 1) return null

  return (
    <>
      <ServicesGrid container={container} cards={cards} sectionTitle={sectionTitle} />
      <div className="lg:hidden">
        <ServicesCarousel container={container} cards={cards} sectionTitle={sectionTitle} />
      </div>
    </>
  )
}
