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
    <div className="mx-auto flex h-full max-w-sm flex-col">
      <ServiceIcon className="size-12 self-center text-foreground" icon={icon} />
      <header className="pt-6 pb-3 text-center text-18 font-medium md:pb-4 md:text-20">
        {title}
      </header>
      <p className="text-center text-12 md:text-14 md:leading-130">{text}</p>
    </div>
  )
}
