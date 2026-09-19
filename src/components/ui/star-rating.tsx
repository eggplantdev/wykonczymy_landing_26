import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { cn } from '@/lib/cn'
import '@/lib/fontawesome'

const STAR_COUNT = 5

type PropsT = {
  rating: number
  label: string
}

// Two identical star rows stacked, the lit one clipped to the score's share of the width, so
// 4.8 shows a part-filled fifth star. A gradient fill would do it too, but needs a unique id
// per instance; clipping needs nothing but the percentage.
export function StarRating({ rating, label }: PropsT) {
  const clamped = Math.min(STAR_COUNT, Math.max(0, rating))
  const stars = (className: string) => (
    <div className={cn('flex w-max gap-x-0.5', className)}>
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <FontAwesomeIcon key={index} icon={faStar} className="size-6" />
      ))}
    </div>
  )

  return (
    <div className="relative" role="img" aria-label={label}>
      {stars('text-subtle')}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${(clamped / STAR_COUNT) * 100}%` }}
      >
        {stars('text-rating')}
      </div>
    </div>
  )
}
