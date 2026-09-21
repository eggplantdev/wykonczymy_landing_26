'use client'

import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { ServiceIcon } from '@/components/home/services/service-icon'
import { CarouselNav } from '@/components/ui/carousel-nav'
import { SectionTitle } from '@/components/ui/section-title'
import { carouselDefaults, useCarousel } from '@/lib/carousel'
import { cn } from '@/lib/cn'
import '@/lib/fontawesome'
import type { ServiceIconKeyT } from '@/lib/service-icons'

export type ProcessStepT = {
  id: string
  /** The same closed set the services cards draw from, so one select field serves both. */
  icon: ServiceIconKeyT
  title: string
  text: string
}

export type ProcessSectionT = {
  sectionTitle: string
  steps: ProcessStepT[]
}

type PropsT = {
  container: string
  data: ProcessSectionT
}

export function ProcessSpotlight({ container, data }: PropsT) {
  const { sectionTitle, steps } = data
  const carousel = useCarousel()
  const [current, setCurrent] = useState(0)
  // Where each dot sits along the line, 0–1. The grid's gaps mean they are not at `index / steps.length`.
  const [marks, setMarks] = useState<number[]>([])
  // Distance from the strip's edge to the dots' centres — where the line has to be drawn.
  const [axis, setAxis] = useState(0)
  const reduced = useReducedMotion()
  // Swiper is told to start rotating rather than rendered with autoplay on, so it cannot
  // spend its pass above the fold.
  const hasRun = useRef(false)
  const wantsRun = useRef(false)
  const strip = useRef<HTMLDivElement>(null)

  const elapsed = useMotionValue(0)
  const from = marks[current] ?? 0
  const to = marks[current + 1] ?? from
  const end = marks[marks.length - 1] ?? 1
  const lit = useTransform(elapsed, (value) => from + value * (to - from))

  const measure = useCallback(() => {
    const box = strip.current
    if (!box) return

    const stripBox = box.getBoundingClientRect()
    const dots = Array.from(box.querySelectorAll('[data-step-dot]')).map((dot) =>
      dot.getBoundingClientRect(),
    )

    // The breakpoint that decides this lives in the `xlg:` classes, and JS has no way to read one.
    const isHorizontal = dots.length > 1 && dots[1]!.top === dots[0]!.top
    const origin = isHorizontal ? stripBox.left : stripBox.top
    const span = isHorizontal ? stripBox.width : stripBox.height

    setMarks(
      dots.map((dot) => {
        if (!span) return 0
        const centre = isHorizontal ? dot.left + dot.width / 2 : dot.top + dot.height / 2
        return (centre - origin) / span
      }),
    )

    // Measured, not stated as half the dot's size: that only holds if the dot's box starts at the edge.
    const first = dots[0]
    if (!first) return
    setAxis(
      isHorizontal
        ? first.top + first.height / 2 - stripBox.top
        : first.left + first.width / 2 - stripBox.left,
    )
  }, [])

  useLayoutEffect(() => {
    const box = strip.current
    if (!box) return
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(box)
    return () => observer.disconnect()
  }, [measure])

  // Called from both ends of a race: the section can reach the viewport before Swiper hands
  // its instance over, or after.
  const startRun = (instance = carousel.swiper) => {
    wantsRun.current = true
    if (hasRun.current || reduced || !instance) return
    hasRun.current = true
    instance.autoplay.start()
  }

  const go = (index: number) => carousel.swiper?.slideTo(index)

  if (steps.length < 1) return null

  return (
    <motion.section
      className={cn(container, carousel.className)}
      viewport={{ amount: 0.2 }}
      onViewportEnter={() => startRun()}
    >
      <SectionTitle title={sectionTitle} className="pb-6 md:pb-8 lg:pb-10" />

      {/* The line is measured off the strip's own box, so padding there draws it past the last dot. */}
      <div className="pb-12 md:pb-20">
        <div
          ref={strip}
          className="relative grid gap-y-6 xlg:auto-cols-fr xlg:grid-flow-col xlg:gap-x-5"
        >
          {/* One box cannot switch which axis its length lives on. */}
          <span
            aria-hidden
            className="absolute top-0 w-px bg-border-muted xlg:hidden"
            style={{ left: axis, height: `${end * 100}%` }}
          />
          <motion.span
            aria-hidden
            className="absolute top-0 bottom-0 w-px origin-top bg-success xlg:hidden"
            style={{ left: axis, scaleY: lit }}
          />
          <span
            aria-hidden
            className="absolute left-0 hidden h-px bg-border-muted xlg:block"
            style={{ top: axis, width: `${end * 100}%` }}
          />
          <motion.span
            aria-hidden
            className="absolute left-0 hidden h-px w-full origin-left bg-success xlg:block"
            style={{ top: axis, scaleX: lit }}
          />

          {steps.map((step, index) => {
            const isActive = index === current
            return (
              <button
                key={step.id}
                type="button"
                aria-current={isActive ? 'step' : undefined}
                onClick={() => go(index)}
                className={cn(
                  'relative pl-8 text-left duration-500 focus-visible:outline-ring xlg:pt-8 xlg:pl-0',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <StepDot lit={lit} at={marks[index] ?? 1} />

                <span className={cn('text-14 xlg:text-16', isActive && 'font-medium')}>
                  {step.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <Swiper
        {...carouselDefaults}
        loop={false}
        autoplay={{ ...carouselDefaults.autoplay, stopOnLastSlide: true }}
        spaceBetween={24}
        slidesPerView={1}
        onSwiper={(instance) => {
          instance.autoplay.stop()
          carousel.onSwiper(instance)
          if (wantsRun.current) startRun(instance)
        }}
        onSlideChange={(instance) => {
          elapsed.set(0)
          setCurrent(instance.activeIndex)
        }}
        // Swiper reports the share of the delay still to run, and stops reporting while paused.
        onAutoplayTimeLeft={(_instance, _timeLeft, share) => elapsed.set(1 - share)}
      >
        {steps.map((step) => (
          <SwiperSlide key={step.id}>
            <div className="flex flex-col gap-y-5 md:flex-row md:items-start md:gap-x-10">
              <ServiceIcon className="size-12 shrink-0 md:size-16" icon={step.icon} />

              <div className="max-w-2xl">
                <h3 className="text-18 font-medium md:text-20">{step.title}</h3>
                <p className="pt-3 text-14 md:leading-130">{step.text}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {steps.length > 1 && (
          <div slot="container-end">
            <CarouselNav current={current + 1} total={steps.length} className="pt-4" />
          </div>
        )}
      </Swiper>
    </motion.section>
  )
}

type DotPropsT = {
  lit: MotionValue<number>
  /** Where this dot sits along the line, 0–1. */
  at: number
}

function StepDot({ lit, at }: DotPropsT) {
  const reached = useTransform(lit, (value): number => (value >= at ? 1 : 0))
  // The overshoot is the point: the mark lands with a small pop as the line arrives.
  const scale = useSpring(reached, { stiffness: 420, damping: 22 })

  return (
    <span
      aria-hidden
      data-step-dot
      className="absolute top-1/2 left-0 flex size-4.5 -translate-y-1/2 items-center justify-center xlg:top-0 xlg:translate-y-0"
    >
      <span className="absolute inset-0 rounded-full border border-border bg-background" />
      <motion.span className="relative flex text-success" style={{ scale }}>
        <FontAwesomeIcon icon={faCircleCheck} className="size-4.5" />
      </motion.span>
    </span>
  )
}
