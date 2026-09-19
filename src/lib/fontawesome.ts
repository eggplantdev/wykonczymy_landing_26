import { config } from '@fortawesome/fontawesome-svg-core'

// Font Awesome otherwise injects a stylesheet whose `.svg-inline--fa { height: 1em }` loads
// after Tailwind and silently beats every `size-*` class. It has to run in a module the
// icon components import — a server layout would set it in the wrong process.
config.autoAddCss = false
