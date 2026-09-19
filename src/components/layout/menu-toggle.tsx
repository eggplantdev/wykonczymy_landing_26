import type { Ref } from 'react'

import { cn } from '@/lib/cn'

type PropsT = {
  label: string
  isOpen: boolean
  onClick: () => void
  className?: string
  // The menu hands this back the focus it took, so closing does not drop the reader on
  // the body with the next Tab restarting from the top of the document.
  ref?: Ref<HTMLButtonElement>
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

// Flat, matching the nav pill: it reads on the white page and on the panel it slides over,
// but not on a dark photo.
export function MenuToggle({ label, isOpen, onClick, className, ref, ...ariaProps }: PropsT) {
  const durationMs = isOpen ? OPEN_DURATION_MS : CLOSE_DURATION_MS

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={isOpen}
      {...ariaProps}
      className={cn(
        'text-foreground fixed top-2 right-6 z-50 md:hidden',
        // The open menu is a modal dialog, and Radix kills pointer events on everything
        // outside it. This button is outside it and is the only way to shut it.
        isOpen && 'pointer-events-auto',
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
        className={cn(
          'transition-[translate,rotate]',
          isOpen && '-translate-x-0.5 -translate-y-0.5 rotate-45',
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
