'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { ENTRANCE_DURATION, ENTRANCE_EASE, ENTRANCE_OFFSET_Y } from '@/lib/motion'

type PropsT = {
  className?: string
  children?: ReactNode
}

// Fade-and-rise as the element is scrolled to, the one entrance this site uses.
//
// Only the transition reacts to reduced motion, never `initial`: `useReducedMotion` reports false
// on the server and true on the very first client render, so branching anything that reaches the
// DOM hands React a hydration mismatch and it answers by throwing the server's HTML away and
// client-rendering the whole page. At `duration: 0` the offset is never on screen anyway.
export function FadeUp({ className, children }: PropsT) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: ENTRANCE_OFFSET_Y }}
      whileInView={{ opacity: 1, y: 0 }}
      // `once`: an entrance that replays every time the visitor scrolls back up reads as a glitch
      // rather than an effect. `amount` and `margin` are left at their defaults on purpose — any
      // raised threshold is unreachable on a section taller than the viewport, and section length
      // is the editor's.
      viewport={{ once: true, amount: 0.3 }}
      transition={
        shouldReduceMotion ? { duration: 0 } : { duration: ENTRANCE_DURATION, ease: ENTRANCE_EASE }
      }
    >
      {children}
    </motion.div>
  )
}
