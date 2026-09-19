'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { ENTRANCE_OFFSET_Y, entranceTransition } from '@/lib/motion'

export function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion()
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: ENTRANCE_OFFSET_Y }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -ENTRANCE_OFFSET_Y }}
        transition={entranceTransition(shouldReduceMotion)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
