import { useId, type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

// The underline the whole form lines up on. Shared with the attachments row, which is a
// <label> rather than a control and so cannot take the control-only half below.
export const fieldShellClasses = 'border-grau_300 text-12 text-grau_300 w-full border-b pt-8 pb-2'

// `placeholder:` is not decoration: a browser does not inherit the element's `color` into
// `::placeholder`, so without it the fields show the UA's own grey while the attachments
// label — real text, not a placeholder — sits next to them in `grau_300`.
export const fieldControlClasses = twMerge(
  fieldShellClasses,
  'focus:border-grau_100 aria-invalid:border-error placeholder:text-grau_300 border-0 border-b bg-transparent pl-0',
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
export function FieldError({ id, error, className }: ErrorPropsT) {
  return (
    <span
      id={id}
      role="status"
      aria-live="polite"
      className={twMerge('text-10 text-error block', className)}
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
    <div className={className}>
      <label htmlFor={id}>
        <span className="sr-only">{label}</span>
      </label>
      {children}
      <FieldError id={errorId} error={error} />
    </div>
  )
}
