'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const DURATION = 0.5
const OFFSET_Y = 20

export function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion()
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: OFFSET_Y }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -OFFSET_Y }}
        transition={
          shouldReduceMotion ? { duration: 0 } : { duration: DURATION, ease: 'easeInOut' }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
