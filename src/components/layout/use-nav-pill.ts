'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

type PillT = { x: number; y: number; width: number; height: number }

// The bar lives in `[[...segments]]/layout.tsx`, and Next keys a layout by its dynamic
// segment — so the whole nav remounts on every navigation and no component state can
// carry the pill's last position across. Module scope can: it lives exactly as long as
// the client session, so a fresh page load correctly has nothing to slide from.
let lastPill: PillT | null = null

// The pill is measured rather than animated by `layoutId`: a layout animation snapshots
// the outgoing item in page coordinates, and the router resets the scroll to the top
// between that snapshot and the incoming measurement, so the pill flew in from however
// far down the page you had been. `offsetLeft`/`offsetTop` cannot see the scroll at all.
export function useNavPill({ enabled }: { enabled: boolean }) {
  const pathname = usePathname()
  const listRef = useRef<HTMLUListElement | null>(null)
  const [pill, setPill] = useState<PillT | null>(null)

  const measure = useCallback(() => {
    // Scoped to the bar's own items: the trailing slot holds a popover whose language
    // links also carry `aria-current`, and on a page with no nav item selected an unscoped
    // query would measure one of those instead.
    const active = listRef.current?.querySelector<HTMLElement>(
      ':scope > li > [aria-current="page"]',
    )
    const next = active
      ? {
          x: active.offsetLeft,
          y: active.offsetTop,
          width: active.offsetWidth,
          height: active.offsetHeight,
        }
      : null

    lastPill = next
    setPill(next)
  }, [])

  // Captured at mount, before `attach` overwrites it — this is where the pill was sitting
  // in the copy of the bar that the navigation just destroyed.
  const [enterFrom] = useState(lastPill)

  // A callback ref rather than an effect, per TestimonialSlide: it runs before paint with
  // the items already mounted, and the observer that re-measures after a breakpoint or a
  // font swap lives and dies with the node.
  const attach = useCallback(
    (node: HTMLUListElement | null) => {
      listRef.current = node
      if (!node || !enabled) return

      measure()
      const observer = new ResizeObserver(measure)
      observer.observe(node)

      return () => {
        observer.disconnect()
        listRef.current = null
      }
    },
    [enabled, measure],
  )

  // The bar survives navigation, so nothing remounts when the active item changes — only
  // `aria-current` moves, and this is what notices.
  useEffect(() => {
    if (enabled) measure()
  }, [enabled, measure, pathname])

  return { pill, enterFrom, attach }
}
