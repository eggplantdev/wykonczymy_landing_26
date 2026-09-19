'use client'

import { useCallback, useState } from 'react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/cn'
import { useTranslation } from '@/lib/i18n/use-translation'

export type TestimonialT = {
  id: string
  quote: SerializedEditorState
  name: string
  role?: string
}

type PropsT = {
  testimonial: TestimonialT
  isExpanded: boolean
  onToggle: () => void
}

// Swiper stretches every slide to the tallest one, so without a clamp the longest review
// on the page sets the section's height and the rest sit in whitespace.
const CLAMP_LINES = 8

export function TestimonialSlide({ testimonial, isExpanded, onToggle }: PropsT) {
  const { quote, name, role } = testimonial
  const { t } = useTranslation('common')
  const [isClamped, setIsClamped] = useState(false)

  // A callback ref rather than an effect: React 19 lets it return its own cleanup, so the
  // observer that re-measures after a breakpoint change lives and dies with the node.
  // Comparing against the line height (not `clientHeight`) keeps the answer stable once
  // expanded, where the clamp is gone and the two heights would agree.
  const measure = useCallback((node: HTMLQuoteElement | null) => {
    if (!node) return

    const check = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(node).lineHeight)
      setIsClamped(node.scrollHeight > lineHeight * CLAMP_LINES + 1)
    }

    check()
    const observer = new ResizeObserver(check)
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <figure>
      <blockquote
        ref={measure}
        className={cn(
          'text-14 md:text-16 lg:text-20 leading-140 text-balance [&>p+p]:pt-4 max-w-3xl',
          !isExpanded && 'line-clamp-8',
        )}
      >
        {/* `disableContainer` so the clamp lands on the blockquote itself — a wrapper div
            between them would be the clamped box and the paragraphs would spill past it. */}
        <RichText data={quote} disableContainer />
      </blockquote>

      {isClamped && (
        <button
          type="button"
          onClick={onToggle}
          className="text-12 md:text-14 text-muted-foreground hover:text-foreground pt-3 underline underline-offset-4 transition-colors"
        >
          {t(isExpanded ? 'showLess' : 'readMore')}
        </button>
      )}

      <figcaption className="flex flex-col pt-8 md:pt-10">
        <p className="text-16 md:text-20">{name}</p>
        {role && <p className="text-12 md:text-14 text-muted-foreground">{role}</p>}
      </figcaption>
    </figure>
  )
}
