'use client'

import { useRef } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'

import { cn } from '@/lib/cn'

import { formatFigure, parseFigure } from './figure'

// Long enough for the digits to read as climbing rather than flickering, which is why it does not
// borrow the entrance tween's half second.
const DURATION = 1.6

type PropsT = {
  /** The figure as the admin typed it — digits plus whatever decorates them, e.g. `250+`. */
  value: string
  className?: string
}

export function CountUp({ value, className }: PropsT) {
  const figure = parseFigure(value)
  const reduced = useReducedMotion()

  // Seeded with the real figure rather than zero, because this value is what the server
  // serialises: a crawler, a visitor whose JS never arrives, and the pre-hydration paint all read
  // `250+`. The drop to zero happens in the viewport callback, which only runs on the client.
  const count = useMotionValue(figure?.target ?? 0)
  // A motion value rendered as a child updates the text node directly, so the digits tick over
  // without re-rendering React once per frame.
  const text = useTransform(count, (n) => (figure ? formatFigure(figure, n) : value))

  // `viewport.once` only suppresses the *leave* callback — `onViewportEnter` fires again on every
  // re-entry — so the one-shot guarantee has to be held here or scrolling back up re-counts.
  const hasRun = useRef(false)

  // Safe to branch on because it is a pure function of the prop: the server and the client reach
  // the same answer. `reduced` is NOT — `useReducedMotion` reads `null` on the server and its real
  // answer on the client, so branching the tree on it hands React a mismatch and it responds by
  // discarding the server's HTML. Reduced motion has to be handled without changing what renders.
  if (!figure) return <span className={className}>{value}</span>

  return (
    <>
      {/* The ticking node is decoration. Assistive tech gets one static truth instead of a figure
          that rewrites itself under the cursor. */}
      <span className="sr-only">{value}</span>
      <motion.span
        aria-hidden
        // `tabular-nums`: proportional digits change width per frame, so the figure jitters and
        // shoves the unit label beside it.
        className={cn('tabular-nums', className)}
        viewport={{ amount: 0.5 }}
        onViewportEnter={() => {
          if (hasRun.current || reduced) return
          hasRun.current = true
          count.set(0)
          animate(count, figure.target, { duration: DURATION, ease: 'easeOut' })
        }}
      >
        {text}
      </motion.span>
    </>
  )
}
