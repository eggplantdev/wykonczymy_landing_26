'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

import { Media } from '@/components/media/media'
import type { MediaImageT, MediaVideoT } from '@/components/media/types'
import { ButtonArrow } from '@/components/ui/button-arrow'
import { ButtonLink } from '@/components/ui/button-link'
import {
  HERO_FADE_OUT_AT,
  HERO_FADE_START_AT,
  HERO_PARALLAX_SCALE,
  HERO_PARALLAX_TRAVEL,
} from '@/lib/motion'

export type HeroT = {
  title: string
  image: MediaImageT | null
  video: MediaVideoT | null
  ctaLabel?: string
  ctaHref?: string
}

type PropsT = {
  data: HeroT
}

export function Hero({ data }: PropsT) {
  const { title, image, video, ctaLabel, ctaHref } = data
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // Two speeds over the hero's exit: the photo pushes forward while the copy runs ahead of the
  // scroll and off the top, so the frame gains depth instead of sliding away as one flat plane.
  // Chaos Kitchen's hero scales its background the same way. `start start` is the moment the hero's top meets the
  // viewport top, `end start` the moment its bottom does.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Reduced motion flattens the output ranges rather than dropping the hooks: a `style` that differs
  // between the server and the first client render is a hydration mismatch, and `useReducedMotion`
  // disagrees with itself across exactly that boundary.
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, shouldReduceMotion ? 1 : HERO_PARALLAX_SCALE],
  )
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ['0svh', shouldReduceMotion ? '0svh' : HERO_PARALLAX_TRAVEL],
  )
  // Gone before it leaves the frame: the copy is white on a photo and reads as dirt the moment any
  // of it is over the light page behind the hero.
  const opacity = useTransform(
    scrollYProgress,
    // Four stops, not two: the first pair holds full strength through the start of the exit, and the
    // tail is pinned rather than left to the transform's own clamping — the copy came back into view
    // once already, and this is the shape that cannot do that.
    [0, HERO_FADE_START_AT, HERO_FADE_OUT_AT, 1],
    [1, 1, shouldReduceMotion ? 1 : 0, shouldReduceMotion ? 1 : 0],
  )

  // Invisible has to mean gone: at `opacity: 0` the CTA pill still sat under the cursor and still
  // took a tab stop, so the hero could be clicked through to the quote page with nothing on screen.
  // Scoped to the pill and not the whole block because `visibility: hidden` prunes its subtree from
  // the accessibility tree, and the block holds the page's only `h1` — scrolling past the hero
  // would leave the document with no level-1 heading. Nothing else in there is interactive.
  const visibility = useTransform(opacity, (value) => (value === 0 ? 'hidden' : 'visible'))

  // `overflow-clip` on the section rather than on the photo itself: a clip box on the scaled element
  // is scaled along with it, so the photo grew past the hero and the next section slid under it.
  // `clip` over `hidden` because `hidden` leaves the box programmatically scrollable, and the hero
  // holds content that is scrolled out of its own frame rather than merely painted over.
  return (
    <section ref={sectionRef} className="relative flex h-svh flex-col overflow-clip">
      {/* `sizes` stays at the layout width: `scale` is a paint-time transform, so it never changes
          how wide the element is laid out. Asking for 150vw only made the browser pick a source two
          steps up the srcset for the LCP image, to buy sharpness at the far end of the exit. */}
      <motion.div
        // Grow about the focal point, not the container's centre: `MediaImage` already frames the
        // photo on it, and scaling from the middle would walk an off-centre subject out of frame.
        style={{
          scale,
          transformOrigin: image?.focalPoint
            ? `${image.focalPoint.x}% ${image.focalPoint.y}%`
            : undefined,
        }}
        className="absolute inset-0 flex"
      >
        <Media image={image} video={video} priority sizes="150vw" />
      </motion.div>
      {/* Covers the whole frame rather than fading in from an edge: the photo is editable in
          the admin, so nothing here can assume where its bright areas fall. */}
      <div className="absolute inset-0 bg-scrim/10" />

      <motion.div
        style={{ y, opacity }}
        className="relative flex h-full w-full flex-col justify-end paddings pb-20 text-on-media md:pb-16"
      >
        {/* The measure is mobile-only and deliberate: at `text-40` the second line of today's
            title reaches within a few pixels of the gutter, so it is capped short enough to
            break once more and set the copy over three lines. The field is a textarea, so the
            editor still owns the hard breaks — this only adds a soft one, and a longer word
            than `wykończenie` (280px is roughly twelve characters at this size) will re-break
            somewhere the editor did not choose. From `md` up the title has room and takes none. */}
        <h1 className="max-w-70 text-40 leading-105 font-bold break-words whitespace-pre-line md:max-w-lg md:text-72">
          {title}
        </h1>
        {/* The photo is a dark surface whatever the page's theme is, so the CTA claims the dark
            role tokens the way the footer band does — that is where its focus ring comes from. */}
        {ctaLabel && ctaHref && (
          <motion.div style={{ visibility }} data-theme="dark" className="flex pt-6 md:pt-10">
            <ButtonLink href={ctaHref} label={ctaLabel} variant="success" size="xl" icon="trailing">
              <ButtonArrow variant="dark" size="xl" />
            </ButtonLink>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
