'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { useSwiper } from 'swiper/react'

import { useTranslation } from '@/lib/i18n/use-translation'
import { cn } from '@/lib/cn'

type PropsT = {
  direction?: 'left' | 'right'
  variant?: 'default' | 'transparent'
  disabled?: boolean
  className?: string
}

export function CarouselArrow({
  direction = 'right',
  variant = 'default',
  disabled,
  className,
}: PropsT) {
  const swiper = useSwiper()
  const { t } = useTranslation('common')

  // The track's position is Swiper's state, not React's, so the arrow subscribes to it. A
  // looping one still reports `isBeginning` on its first slide, so `!loop` guards a false dim.
  const subscribe = useCallback(
    (onChange: () => void) => {
      swiper.on('slideChange', onChange)
      // `updateProgress` emits these on every resize and breakpoint change, which is where
      // the last slide can stop being the last one — `slideChange` alone would miss it.
      swiper.on('toEdge', onChange)
      swiper.on('fromEdge', onChange)
      return () => {
        if (swiper.destroyed) return
        swiper.off('slideChange', onChange)
        swiper.off('toEdge', onChange)
        swiper.off('fromEdge', onChange)
      }
    },
    [swiper],
  )
  const atEdge = useSyncExternalStore(
    subscribe,
    // `destroy()` deletes every own property before it sets the flag, so a destroyed
    // instance has no `params` — and the dev double-mount reads one through stale context.
    () =>
      !swiper.destroyed &&
      !swiper.params.loop &&
      (direction === 'left' ? swiper.isBeginning : swiper.isEnd),
    () => false,
  )
  const isDisabled = disabled ?? atEdge

  function handleClick() {
    if (direction === 'left') swiper.slidePrev()
    else swiper.slideNext()
  }

  return (
    <button
      type="button"
      aria-label={t(direction === 'left' ? 'previousSlide' : 'nextSlide')}
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(
        'h-5.5 rounded-md px-4',
        variant === 'default' && 'bg-card hover:bg-muted',
        variant === 'transparent' && 'bg-glass/30 hover:bg-glass/50',
        isDisabled && 'opacity-30',
        className,
      )}
    >
      <svg
        className={direction === 'right' ? 'rotate-180' : ''}
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="12"
        viewBox="0 0 15 12"
        fill="none"
      >
        <path
          d="M14.5 6.5C14.7761 6.5 15 6.27614 15 6C15 5.72386 14.7761 5.5 14.5 5.5L14.5 6.5ZM14.5 5.5L0.888889 5.5L0.888889 6.5L14.5 6.5L14.5 5.5Z"
          fill="currentColor"
        />
        <path
          d="M4.77783 11L0.611293 6.13002C0.547253 6.05517 0.547253 5.94483 0.611293 5.86998L4.77783 1"
          stroke="currentColor"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
