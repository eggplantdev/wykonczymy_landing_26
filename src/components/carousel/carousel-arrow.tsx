'use client'

import { useSwiper } from 'swiper/react'
import { twMerge } from 'tailwind-merge'

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

  function handleClick() {
    if (direction === 'left') swiper.slidePrev()
    else swiper.slideNext()
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={twMerge(
        'h-[22px] rounded-full px-4',
        variant === 'default' && 'bg-grau_900 hover:bg-grau_800',
        variant === 'transparent' && 'bg-grau_200/30 hover:bg-grau_200/50',
        disabled && 'opacity-30',
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
