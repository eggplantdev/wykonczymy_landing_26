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
export function entranceTransition(shouldReduceMotion: boolean | null, delay = 0): Transition {
  return shouldReduceMotion
    ? { duration: 0 }
    : { duration: ENTRANCE_DURATION, ease: ENTRANCE_EASE, delay }
}

// One step of a staggered entrance. Short on purpose: a row of four lands inside a quarter second,
// so it reads as one movement crossing the row rather than as items queuing up.
export const ENTRANCE_STAGGER = 0.08

// The hero's two scroll-linked movements, both spent over its exit: the photo pushes toward the
// viewer while the copy runs ahead of the scroll and leaves through the top of the frame. Negative
// because it leads rather than lags, and in viewport heights because it is a share of the distance
// the page moved, not a size — `svh`, because the hero is `h-svh` and that is exactly how much
// scrolling the movement is spent over.
export const HERO_PARALLAX_SCALE = 1.5
export const HERO_PARALLAX_TRAVEL = '-40svh'
// The window the copy fades across, as a share of the hero's exit. Both ends were found by
// overshooting them: keyed to 0 the text read as bailing out the moment the page was touched, and
// held to 0.5 it slid off the top still solid, because between the page scroll and the `y` lead the
// stack travels 140svh and so clears the top of the screen around 0.6. A quarter in is late enough
// to feel deliberate, and 0.75 leaves the copy at roughly a third of its strength as it goes.
export const HERO_FADE_START_AT = 0.25
export const HERO_FADE_OUT_AT = 0.75
