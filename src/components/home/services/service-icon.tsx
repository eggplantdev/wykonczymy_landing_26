import { type IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightDots,
  faBrush,
  faLightbulb,
  faRulerCombined,
  faCompassDrafting,
  faDoorOpen,
  faFan,
  faFaucetDrip,
  faHammer,
  faHouseChimney,
  faPaintRoller,
  faScrewdriverWrench,
} from '@fortawesome/free-solid-svg-icons'

import '@/lib/fontawesome'
import type { ServiceIconKeyT } from '@/lib/service-icons'

const icons: Record<ServiceIconKeyT, IconDefinition> = {
  hammer: faHammer,
  'arrow-up-right-dots': faArrowUpRightDots,
  'paint-roller': faPaintRoller,
  'screwdriver-wrench': faScrewdriverWrench,
  lightbulb: faLightbulb,
  'faucet-drip': faFaucetDrip,
  fan: faFan,
  'ruler-combined': faRulerCombined,
  'door-open': faDoorOpen,
  'house-chimney': faHouseChimney,
  brush: faBrush,
  'compass-drafting': faCompassDrafting,
}

type PropsT = {
  icon: ServiceIconKeyT
  className?: string
}

export function ServiceIcon({ icon, className }: PropsT) {
  return <FontAwesomeIcon className={className} icon={icons[icon]} />
}
