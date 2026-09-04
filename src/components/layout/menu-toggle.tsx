import { twMerge } from 'tailwind-merge'

type PropsT = {
  label: string
  isOpen: boolean
  onClick: () => void
  className?: string
  'aria-controls'?: string
}

// Ported from Chaos Kitchen's NavMobileToggle. One continuous stroke draws both icons:
// the dash window picks which run of the path is painted, so the bars sweep into the
// cross rather than cross-fading between two separate glyphs.
const TOGGLE_PATH = 'm 20 40 h 60 a 1 1 0 0 1 0 20 h -60 a 1 1 0 0 1 0 -40 h 30 v 70'

const TOGGLE_DASH = {
  // The dash boundary sits a fraction off the arc join, where WebKit leaked a cap
  // pixel. Under a device pixel of visual delta at 48px.
  closed: '59.75 31.25 60 300',
  open: '59.75 105.25 60 300',
} as const

const OPEN_DURATION_MS = 520
const CLOSE_DURATION_MS = 820

// White strokes inverted against whatever they sit over, so one icon reads on a photo,
// on white page sections and on the panel it slides over. Difference only sees the
// backdrop of the nearest stacking-context ancestor, which is why the button positions
// itself instead of sitting inside the fixed header.
export function MenuToggle({ label, isOpen, onClick, className, ...ariaProps }: PropsT) {
  const durationMs = isOpen ? OPEN_DURATION_MS : CLOSE_DURATION_MS

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={isOpen}
      {...ariaProps}
      className={twMerge(
        'fixed top-4 right-6 z-50 text-white mix-blend-difference md:hidden',
        className,
      )}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        stroke="currentColor"
        fill="none"
        viewBox="-10 -10 105 120"
        width="48"
        className={twMerge(
          'transition-[translate,rotate]',
          isOpen && 'translate-[-2px_-2px] rotate-45',
        )}
        style={{ transitionDuration: `${durationMs}ms` }}
      >
        <path
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d={TOGGLE_PATH}
          style={{
            transition: `${durationMs}ms`,
            strokeDasharray: isOpen ? TOGGLE_DASH.open : TOGGLE_DASH.closed,
            strokeDashoffset: isOpen ? -90 : 0,
          }}
        />
      </svg>
    </button>
  )
}
