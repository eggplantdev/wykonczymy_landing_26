import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

// `placeholder:` is not decoration: a browser does not inherit the element's `color` into
// `::placeholder`, so without it the fields show the UA's own grey instead of `subtle-foreground`.
// The top padding is also the gap between two stacked fields — there is no visible label above
// the line, so nothing else holds them apart. A phone gets less of it: at `pt-8` a one-line
// field is a 48px band of empty space, and seven of them push the send button off the screen.
export const fieldControlClasses = cn(
  'border-border text-12 text-muted-foreground w-full pt-5 pb-2 md:pt-8',
  'focus:border-muted-foreground aria-invalid:border-error placeholder:text-subtle-foreground border-0 border-b bg-transparent pl-0',
)

// The control's `aria-describedby` and the id `FieldError` renders have to be the same
// string, and every control in the form owes that pairing — so it is derived once here
// rather than re-stated beside each `useId`.
export function useFieldIds() {
  const id = useId()
  return { id, errorId: `${id}-error` }
}

type ErrorPropsT = {
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
export function FieldError({ id, error, className }: ErrorPropsT) {
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

type PropsT = {
  id: string
  errorId: string
  label: string
  error?: string
  className?: string
  children: ReactNode
}

export function ContactFormField({ id, errorId, label, error, className, children }: PropsT) {
  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id}>
        <span className="sr-only">{label}</span>
      </label>
      {children}
      <FieldError id={errorId} error={error} />
    </div>
  )
}
