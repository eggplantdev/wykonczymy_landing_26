import { cn } from '@/lib/cn'

type PropsT = {
  /** 1-based position of the active slide. */
  current: number
  // Passed in rather than read off `swiper.slides`, which in loop mode counts the
  // duplicate slides Swiper clones onto each end and so roughly doubles the total —
  // and is empty during SSR, rendering "00" before hydration.
  total: number
  className?: string
}

const pad = (value: number) => (value < 10 ? `0${value}` : String(value))

export function CarouselCounter({ current, total, className }: PropsT) {
  return (
    <div className={cn('flex items-center justify-center text-subtle-foreground', className)}>
      <span className="text-foreground">{pad(current)}</span>
      <span className="mx-2 h-3 w-px bg-current" />
      <span>{pad(total)}</span>
    </div>
  )
}
