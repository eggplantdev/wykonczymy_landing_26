import { Fixly } from '@/components/ui/icons/fixly'
import { Google } from '@/components/ui/icons/google'
import { StarRating } from '@/components/ui/star-rating'
import type { RatingPlatformT } from '@/lib/ratings'

export type RatingT = {
  platform: RatingPlatformT
  rating: number
  profileUrl?: string
}

const PLATFORM_MARKS: Record<RatingPlatformT, (props: { className?: string }) => React.ReactNode> =
  {
    fixly: Fixly,
    google: Google,
  }

type PropsT = {
  data: RatingT
}

// The score is typed in, not fetched: Fixly publishes no API at all and Google bills its
// rating per page view under a licence that forbids caching it.
export function RatingBadge({ data }: PropsT) {
  const { platform, rating, profileUrl } = data
  const Mark = PLATFORM_MARKS[platform]
  const score = rating.toFixed(1)

  const badge = (
    <>
      <Mark className="h-6 w-auto shrink-0" />
      <StarRating rating={rating} label={`${platform}: ${score} / 5`} />
      <span className="text-16 md:text-18 font-medium">{score}</span>
    </>
  )

  const className = 'flex items-center gap-x-3'

  return profileUrl ? (
    <a
      href={profileUrl}
      target="_blank"
      rel="noreferrer"
      className={`${className} transition-opacity hover:opacity-70`}
    >
      {badge}
    </a>
  ) : (
    <div className={className}>{badge}</div>
  )
}
