'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

import { Media } from '@/components/media/media'
import type { MediaImageT, MediaVideoT } from '@/components/media/types'
import { ButtonArrow } from '@/components/ui/button-arrow'
import { ButtonLink } from '@/components/ui/button-link'
import { HERO_FADE_OUT_AT, HERO_PARALLAX_SCALE, HERO_PARALLAX_TRAVEL } from '@/lib/motion'

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
    // The tail is pinned with a third stop rather than left to the transform's own clamping: the
    // copy came back into view once already, and this is the shape that cannot do that.
    [0, HERO_FADE_OUT_AT, 1],
    [1, shouldReduceMotion ? 1 : 0, shouldReduceMotion ? 1 : 0],
  )

  // Invisible has to mean gone: at `opacity: 0` the CTA pill still sat under the cursor and still
  // took a tab stop, so the hero could be clicked through to the quote page with nothing on screen.
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
      <div className="bg-scrim/10 absolute inset-0" />

      {/* No measure on the title: the field is a textarea so the editor owns where the line
          breaks, and a width cap would re-break it on the next copy change. */}
      <motion.div
        style={{ y, opacity, visibility }}
        className="paddings text-on-media relative flex h-full w-full flex-col justify-end pb-12 md:pb-16"
      >
        <p
          data-display
          className="text-40 md:text-72 leading-105 font-bold break-words whitespace-pre-line"
        >
          {title}
        </p>
        {/* The photo is a dark surface whatever the page's theme is, so the CTA claims the
            dark role tokens the way the footer band does — `solid` then resolves to the same
            white pill here as it does down there, instead of going black on the light theme. */}
        {ctaLabel && ctaHref && (
          <div data-theme="dark" className="flex pt-6 md:pt-10">
            <ButtonLink href={ctaHref} label={ctaLabel} variant="solid" size="xl" icon="trailing">
              <ButtonArrow variant="solid" size="xl" />
            </ButtonLink>
          </div>
        )}
      </motion.div>
    </section>
  )
}
