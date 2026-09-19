'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { ENTRANCE_DURATION, ENTRANCE_EASE, ENTRANCE_OFFSET_Y } from '@/lib/motion'

export function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion()
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        // Only the transition reacts to reduced motion — see `FadeUp`: branching what reaches the
        // DOM costs a hydration mismatch, and at `duration: 0` the offset never shows.
        initial={{ opacity: 0, y: ENTRANCE_OFFSET_Y }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -ENTRANCE_OFFSET_Y }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: ENTRANCE_DURATION, ease: ENTRANCE_EASE }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
