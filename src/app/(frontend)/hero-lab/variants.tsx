import { cn } from '@/lib/cn'

import { HeroCta, HeroFrame, titleClasses, type HeroSourceT } from './hero-frame'

type PropsT = { source: HeroSourceT }

const hasCta = (
  source: HeroSourceT,
): source is HeroSourceT & { ctaLabel: string; ctaHref: string } =>
  Boolean(source.ctaLabel && source.ctaHref)

export function CentredStack({ source }: PropsT) {
  return (
    <HeroFrame label="1 · Centred stack" note="everything on the centre axis" source={source}>
      <div className="flex h-full flex-col items-center justify-center">
        <p className={cn(titleClasses, 'mx-10 text-center')}>{source.title}</p>
        {hasCta(source) && (
          <div className="pt-6 md:pt-10">
            <HeroCta label={source.ctaLabel} href={source.ctaHref} />
          </div>
        )}
      </div>
    </HeroFrame>
  )
}

/**
 * The button drops to the foot of the frame. `1fr auto` rather than an absolute button:
 * the title then centres in the space the button does not occupy, so on a short landscape
 * phone the two compress instead of overlapping.
 */
export function CentredBottomCta({ source }: PropsT) {
  return (
    <HeroFrame
      label="2 · Centred title, CTA at the foot"
      note="uses the empty lower third"
      source={source}
    >
      <div className="grid h-full grid-rows-[1fr_auto]">
        <p className={cn(titleClasses, 'mx-10 self-center text-center')}>{source.title}</p>
        {hasCta(source) && (
          <div className="flex justify-center pb-12 md:pb-16">
            <HeroCta label={source.ctaLabel} href={source.ctaHref} />
          </div>
        )}
      </div>
    </HeroFrame>
  )
}

export function LeftCentred({ source }: PropsT) {
  return (
    <HeroFrame label="3 · Left, centred" note="what ships today" source={source}>
      <div className="paddings flex h-full flex-col justify-center">
        <p className={cn(titleClasses, 'max-w-[18ch]')}>{source.title}</p>
        {hasCta(source) && (
          <div className="flex pt-6 md:pt-10">
            <HeroCta label={source.ctaLabel} href={source.ctaHref} />
          </div>
        )}
      </div>
    </HeroFrame>
  )
}

export function LeftFoot({ source }: PropsT) {
  return (
    <HeroFrame
      label="4 · Bottom-left block"
      note="the block sat on the floor of the frame"
      source={source}
    >
      <div className="paddings flex h-full flex-col justify-end pb-12 md:pb-16">
        <p className={cn(titleClasses, 'max-w-[18ch]')}>{source.title}</p>
        {hasCta(source) && (
          <div className="flex pt-6 md:pt-10">
            <HeroCta label={source.ctaLabel} href={source.ctaHref} />
          </div>
        )}
      </div>
    </HeroFrame>
  )
}

/**
 * Title bottom-left, button bottom-right on the same baseline. The widest split, and the
 * one that needs the photo to be quiet in the lower band.
 */
export function SplitFoot({ source }: PropsT) {
  return (
    <HeroFrame label="5 · Split foot" note="title left, CTA right, one baseline" source={source}>
      <div className="paddings flex h-full flex-col justify-end pb-12 md:pb-16">
        <div className="flex flex-col gap-y-6 md:flex-row md:items-end md:justify-between md:gap-x-10">
          <p className={cn(titleClasses, 'max-w-[18ch]')}>{source.title}</p>
          {hasCta(source) && (
            <div className="flex md:pb-2">
              <HeroCta label={source.ctaLabel} href={source.ctaHref} />
            </div>
          )}
        </div>
      </div>
    </HeroFrame>
  )
}
