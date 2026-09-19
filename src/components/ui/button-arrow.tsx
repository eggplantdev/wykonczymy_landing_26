import { buttonLabelClasses, type ButtonSizeT, type ButtonVariantT } from '@/components/ui/button'
import { Arrow } from '@/components/ui/icons/arrow'
import { cn } from '@/lib/cn'

// Matched to the label's own type size, so the arrow reads as one more glyph in the word it
// trails rather than a mark that happens to sit beside it.
const ARROW_HEIGHT = {
  sm: 'h-3',
  responsive: 'h-3',
  xl: 'h-4',
} as const satisfies Record<ButtonSizeT, string>

type PropsT = {
  variant?: ButtonVariantT
  size?: ButtonSizeT
  disabled?: boolean
}

// Takes the same inputs the button does, so an arrow cannot end up a different colour or a
// different size from the text it trails — which is what happens to a hand-rolled one the
// moment its button is `outline`, disabled, or anything but the default size.
export function ButtonArrow({ variant, size = 'responsive', disabled }: PropsT) {
  return (
    <span
      aria-hidden
      className={cn(
        buttonLabelClasses({ variant, disabled }),
        ARROW_HEIGHT[size],
        'flex ease-out group-hover:translate-x-2',
      )}
    >
      <Arrow />
    </span>
  )
}
