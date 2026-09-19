import type { ServiceIconKeyT } from '@/lib/service-icons'
import { ServiceIcon } from './service-icon'

export type ServiceCardT = {
  /** The CMS row's own id — a title is not unique and does not survive a rename. */
  id: string
  title: string
  text: string
  icon: ServiceIconKeyT
}

type PropsT = {
  card: ServiceCardT
}

export function ServiceSlide({ card }: PropsT) {
  const { title, text, icon } = card

  return (
    // Full height, because Swiper stretches every slide to the tallest: the copy then sits
    // under an icon row of one shared height instead of floating mid-card.
    <div className="flex h-full flex-col">
      <ServiceIcon className="text-foreground size-12 self-center" icon={icon} />
      <header className="text-18 md:text-20 pt-6 pb-3 text-center font-medium md:pb-4">
        {title}
      </header>
      <p className="text-12 md:text-14 md:leading-130">{text}</p>
    </div>
  )
}
