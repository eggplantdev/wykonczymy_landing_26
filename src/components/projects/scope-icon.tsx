import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBath,
  faBolt,
  faBrush,
  faCheck,
  faDoorOpen,
  faFan,
  faFaucet,
  faFire,
  faGripLines,
  faHammer,
  faKitchenSet,
  faLayerGroup,
  faLightbulb,
  faPaintRoller,
  faRulerCombined,
  faScrewdriverWrench,
  faShower,
  faSink,
  faTableCellsLarge,
  faTrowelBricks,
  faWindowMaximize,
} from '@fortawesome/free-solid-svg-icons'

import '@/lib/fontawesome'
import { DEFAULT_SCOPE_ICON, type ScopeIconKeyT } from '@/lib/scope-icons'

const icons: Record<ScopeIconKeyT, IconDefinition> = {
  check: faCheck,
  bolt: faBolt,
  fire: faFire,
  faucet: faFaucet,
  sink: faSink,
  bath: faBath,
  shower: faShower,
  'layer-group': faLayerGroup,
  'table-cells-large': faTableCellsLarge,
  'grip-lines': faGripLines,
  'trowel-bricks': faTrowelBricks,
  'paint-roller': faPaintRoller,
  brush: faBrush,
  'kitchen-set': faKitchenSet,
  'door-open': faDoorOpen,
  'window-maximize': faWindowMaximize,
  lightbulb: faLightbulb,
  fan: faFan,
  hammer: faHammer,
  'screwdriver-wrench': faScrewdriverWrench,
  'ruler-combined': faRulerCombined,
}

type PropsT = {
  icon: ScopeIconKeyT | null | undefined
  className?: string
}

export function ScopeIcon({ icon, className }: PropsT) {
  return <FontAwesomeIcon className={className} icon={icons[icon ?? DEFAULT_SCOPE_ICON]} />
}
