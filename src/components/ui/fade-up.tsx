'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { ENTRANCE_OFFSET_Y, entranceTransition } from '@/lib/motion'

type PropsT = {
  className?: string
  children?: ReactNode
}

// Fade-and-rise as the element is scrolled to, the one entrance this site uses.
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
      // so 0.3 is unreachable on a wrapper past ~3.3 viewports (~2800px at 844) and it would sit at
      // `opacity: 0` for good. The tallest wrapper today is the footer's contact block at roughly
      // 1300px on a 390px-wide phone, so there is margin — but wrapper height comes from CMS copy
      // and photo counts, which is why `tests/e2e/entrance-animation.e2e.spec.ts` scrolls real pages
      // instead of trusting this number.
      viewport={{ once: true, amount: 0.3 }}
      transition={entranceTransition(shouldReduceMotion)}
    >
      {children}
    </motion.div>
  )
}
