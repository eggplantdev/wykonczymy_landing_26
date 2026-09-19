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
      // rather than an effect.
      //
      // `amount` has a ceiling worth knowing: the intersection ratio caps at `viewport / element`,
      // so 0.3 is unreachable on a section past ~3.3 viewports (~2400px at 720) and it would sit at
      // `opacity: 0` for good. Section length is the editor's, so a section that grows that far is
      // where to look first. Every section on the site today is under 600px.
      viewport={{ once: true, amount: 0.3 }}
      transition={
        shouldReduceMotion ? { duration: 0 } : { duration: ENTRANCE_DURATION, ease: ENTRANCE_EASE }
      }
    >
      {children}
    </motion.div>
  )
}
