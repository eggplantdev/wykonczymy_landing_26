import type { Transition } from 'motion/react'

// One entrance movement, shared by the page transition and every section that rises into view —
// they run side by side on a navigation, so a second set of numbers would read as two competing
// systems.
export const ENTRANCE_DURATION = 0.5
export const ENTRANCE_EASE = 'easeInOut' as const
export const ENTRANCE_OFFSET_Y = 20

// Reduced motion may only reach the transition, never `initial`/`animate`/`exit`: `useReducedMotion`
// reports false on the server and true on the very first client render, so branching anything that
// is serialised into the DOM hands React a hydration mismatch, and it answers by throwing the
// server's HTML away and client-rendering the whole page. At `duration: 0` the offset never shows
// anyway. Shared so the rule is enforced in one place rather than restated at each motion component.
export function entranceTransition(shouldReduceMotion: boolean | null): Transition {
  return shouldReduceMotion ? { duration: 0 } : { duration: ENTRANCE_DURATION, ease: ENTRANCE_EASE }
}
