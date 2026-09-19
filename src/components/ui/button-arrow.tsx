import { buttonLabelClasses, type ButtonVariantT } from '@/components/ui/button'
import { Arrow } from '@/components/ui/icons/arrow'
import { cn } from '@/lib/cn'

type PropsT = {
  variant?: ButtonVariantT
  disabled?: boolean
}

// Takes the same two inputs the label does, so an arrow cannot end up a different colour
// from the text it trails — which is what happens to a hand-rolled one the moment its
// button is `outline` or disabled.
export function ButtonArrow({ variant, disabled }: PropsT) {
  return (
    <span
      aria-hidden
      className={cn(
        buttonLabelClasses({ variant, disabled }),
        'flex h-3 group-hover:translate-x-0.5',
      )}
    >
      <Arrow />
    </span>
  )
}
