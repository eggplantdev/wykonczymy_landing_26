import { useId } from 'react'

// The control's `aria-describedby` and the id `FieldError` renders have to be the same
// string, and every control in the form owes that pairing — so it is derived once here
// rather than re-stated beside each `useId`.
export function useFieldIds() {
  const id = useId()
  return { id, errorId: `${id}-error` }
}
