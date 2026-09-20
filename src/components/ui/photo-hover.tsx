import { Arrow } from '@/components/ui/icons/arrow'

// Goes inside a positioned box the size of the photograph, on a card carrying `group`.
export function PhotoHover() {
  return (
    <>
      <span aria-hidden className="hover-photo-outline" />
      <span aria-hidden className="hover-photo-mark">
        {/* `Arrow` is `h-full` and takes its width from the aspect, so it needs its own box. */}
        <span className="flex h-5">
          <Arrow />
        </span>
      </span>
    </>
  )
}
