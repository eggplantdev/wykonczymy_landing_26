'use client'

import * as RadixDialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ReactNode, RefObject } from 'react'

import { cn } from '@/lib/cn'

const ENTER_TRANSITION = { type: 'spring', stiffness: 400, damping: 28 } as const
const EXIT_TRANSITION = { type: 'tween', duration: 0.15, ease: 'easeOut' } as const
const NO_TRANSITION = { duration: 0 } as const

type PropsT = {
  isOpen: boolean
  onClose: () => void
  // Radix only knows about a `Dialog.Trigger`, and this dialog is driven by a button
  // that is not one, so it has to be told: closing hands focus back here, and a press on
  // it is not treated as a press outside.
  triggerRef: RefObject<HTMLElement | null>
  label: string
  closeLabel: string
  id?: string
  className?: string
  children: ReactNode
}

// `forceMount` hands mounting to `AnimatePresence` so the panel still animates on the
// way out.
export function Sheet({
  isOpen,
  onClose,
  triggerRef,
  label,
  closeLabel,
  id,
  className,
  children,
}: PropsT) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <RadixDialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <RadixDialog.Portal forceMount>
            {/* Painted over by the panel and still required: Radix mounts the scroll
                lock on the overlay rather than on the content. */}
            <RadixDialog.Overlay forceMount className="fixed inset-0 z-40" />

            <RadixDialog.Content
              forceMount
              asChild
              id={id}
              onCloseAutoFocus={(event) => {
                event.preventDefault()
                triggerRef.current?.focus()
              }}
              onPointerDownOutside={(event) => {
                // The trigger already toggles this dialog. Dismissing on the same press
                // would close it a beat before its own handler reopened it.
                if (triggerRef.current?.contains(event.detail.originalEvent.target as Node)) {
                  event.preventDefault()
                }
              }}
            >
              <motion.div
                className={cn(
                  'fixed inset-0 z-40 flex h-lvh w-full flex-col overflow-y-auto',
                  className,
                )}
                initial={{ x: '100%' }}
                animate={{
                  x: 0,
                  transition: shouldReduceMotion ? NO_TRANSITION : ENTER_TRANSITION,
                }}
                exit={{
                  x: '100%',
                  transition: shouldReduceMotion ? NO_TRANSITION : EXIT_TRANSITION,
                }}
              >
                <RadixDialog.Title className="sr-only">{label}</RadixDialog.Title>

                {/* Radix hides everything outside the panel from assistive tech, the
                    trigger included — so without this the trap announces no way out. */}
                <RadixDialog.Close className="sr-only">{closeLabel}</RadixDialog.Close>

                {children}
              </motion.div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  )
}
