import { Media } from '@/components/media/media'
import type { MediaImageT, MediaVideoT } from '@/components/media/types'
import { buttonLabelClasses } from '@/components/ui/button'
import { ButtonLink } from '@/components/ui/button-link'
import { Arrow } from '@/components/ui/icons/arrow'
import { cn } from '@/lib/cn'

export type HeroSourceT = {
  title: string
  image: MediaImageT | null
  video: MediaVideoT | null
  ctaLabel?: string
  ctaHref?: string
}

type FramePropsT = {
  label: string
  note: string
  source: HeroSourceT
  children: React.ReactNode
}

/** The parts every variant shares: the full-bleed photo, the scrim, and the label naming it. */
export function HeroFrame({ label, note, source, children }: FramePropsT) {
  return (
    <section className="relative mx-[calc(50%-50vw)] h-svh w-screen">
      <div className="absolute inset-0 flex">
        <Media image={source.image} video={source.video} sizes="100vw" />
      </div>
      <div className="bg-scrim/20 absolute inset-0" />

      <div className="text-12 bg-scrim/70 absolute top-4 left-4 z-10 rounded-full px-4 py-2 text-on-media">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground"> — {note}</span>
      </div>

      <div className="relative h-full w-full text-on-media">{children}</div>
    </section>
  )
}

/** The hero's CTA, arrow and all, so five variants do not restate it five times. */
export function HeroCta({ label, href }: { label: string; href: string }) {
  return (
    <ButtonLink href={href} label={label} variant="light" icon="trailing">
      <span
        aria-hidden
        className={cn(buttonLabelClasses({}), 'flex h-3 group-hover:translate-x-0.5')}
      >
        <Arrow />
      </span>
    </ButtonLink>
  )
}

export const titleClasses =
  'text-52 md:text-72 xl:text-hero leading-105 font-bold whitespace-pre-line'
