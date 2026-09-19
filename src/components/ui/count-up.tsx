'use client'

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'

import { COUNT_UP_DURATION } from '@/lib/motion'

type PropsT = {
  /** The figure as the admin typed it — digits plus whatever decorates them, e.g. `250+`. */
  value: string
  /** Seconds. What staggers a group: give each member the next step up. */
  delay?: number
  className?: string
}

// Splits `250+` into `''`, `250`, `'+'` so only the digits climb and the admin keeps control of
// the decoration. A figure with no digits at all falls through unanimated.
const PARTS = /^(\D*)(\d+)(.*)$/s

export function CountUp({ value, delay = 0, className }: PropsT) {
  const parts = PARTS.exec(value)
  const target = parts ? Number(parts[2]) : 0

  const count = useMotionValue(0)
  // A motion value rendered as a child updates the text node directly, so the digits tick over
  // without re-rendering React once per frame.
  const text = useTransform(count, (n) => `${parts?.[1] ?? ''}${Math.round(n)}${parts?.[3] ?? ''}`)

  const reduced = useReducedMotion()
  if (!parts || reduced) return <span className={className}>{value}</span>

  return (
    <motion.span
      className={className}
      // `once`: a figure that re-counts every time the visitor scrolls back up reads as a glitch.
      viewport={{ once: true, amount: 0.5 }}
      onViewportEnter={() => {
        animate(count, target, { duration: COUNT_UP_DURATION, delay, ease: 'easeOut' })
      }}
    >
      {text}
    </motion.span>
  )
}
