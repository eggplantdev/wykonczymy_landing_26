import { cn } from '@/lib/cn'

type PropsT = {
  id: string
  error?: string
  className?: string
}

// Validation only runs on submit, so an error appearing is a change the visitor did not
// witness — without the live region a screen reader user presses Send and hears nothing
// at all. The element is always rendered: a region that only appears along with its text
// is not announced.
//
// Taken out of flow and hung under the control it belongs to: every message appears at
// once on submit, and in flow each one would push the rest of the form down the page
// under the visitor's cursor.
export function FieldError({ id, error, className }: PropsT) {
  return (
    <span
      id={id}
      role="status"
      aria-live="polite"
      className={cn('text-10 text-error absolute top-full left-0 block', className)}
    >
      {error}
    </span>
  )
}
