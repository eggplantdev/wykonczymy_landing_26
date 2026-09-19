import { config, type IconDefinition } from '@fortawesome/fontawesome-svg-core'
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

import type { ServiceIconKeyT } from '@/lib/service-icons'

// Font Awesome otherwise injects a stylesheet whose `.svg-inline--fa { height: 1em }` loads
// after Tailwind and silently beats every `size-*` class. Nothing here needs the rest of that
// sheet, so it is never added and Tailwind sizes the glyph.
config.autoAddCss = false

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
